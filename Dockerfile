# Build Spring Boot
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY server/pom.xml server/pom.xml
RUN mvn -q -f server/pom.xml -B -DskipTests dependency:go-offline
COPY server/ server/
RUN mvn -q -f server/pom.xml -B -DskipTests package

# Run Spring Boot
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN mkdir -p /app/uploads
COPY server/uploads/ /app/uploads/

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"
ENV PORT=8081
EXPOSE 8081

COPY --from=build /app/server/target/*.jar /app/app.jar
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-} -jar /app/app.jar"]
