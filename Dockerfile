# ------------------------------------------------------------------------------
# Stage 1: Build the Vite React frontend
# ------------------------------------------------------------------------------
FROM node:20-alpine AS ui
WORKDIR /ui

# Install deps with cache-friendly layers
COPY client/package*.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# Build production assets
COPY client/ .
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Build the Spring Boot backend (no Maven wrapper required)
# ------------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Warm up Maven cache with dependencies
COPY server/pom.xml server/pom.xml
RUN mvn -q -f server/pom.xml -B -DskipTests dependency:go-offline

# Copy backend sources
COPY server/ server/

# Copy frontend build into Spring Boot static resources
# Contents in server/src/main/resources/static/ are served at /
RUN mkdir -p server/src/main/resources/static && rm -rf server/src/main/resources/static/*
COPY --from=ui /ui/dist/ server/src/main/resources/static/

# Package the fat jar
RUN mvn -q -f server/pom.xml -B -DskipTests package

# ------------------------------------------------------------------------------
# Stage 3: Run the app on a slim JRE
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre
WORKDIR /app

# JVM tuning to respect container limits
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

# Render provides PORT at runtime; default 8080 for local
ENV PORT=8080
EXPOSE 8080

# Copy built jar
COPY --from=build /app/server/target/*.jar /app/app.jar

# Start the application; bind Spring to $PORT
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-} -jar /app/app.jar"]
