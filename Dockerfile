# ------------------------------------------------------------------------------
# Build stage: compile the Spring Boot app with Maven (no wrapper needed)
# ------------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy only pom first to cache dependencies between builds
COPY server/pom.xml server/pom.xml
RUN mvn -q -f server/pom.xml -B -DskipTests dependency:go-offline

# Now copy sources and build the jar
COPY server/src/ server/src/
RUN mvn -q -f server/pom.xml -B -DskipTests package

# ------------------------------------------------------------------------------
# Run stage: run the fat jar on a slim JRE
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Respect container memory limits
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

# Render will inject PORT; default to 8080 for local runs
ENV PORT=8080
EXPOSE 8080

# Copy artifact from build stage
COPY --from=build /app/server/target/*.jar /app/app.jar

# Start app; bind to Render's $PORT
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-} -jar /app/app.jar"]
