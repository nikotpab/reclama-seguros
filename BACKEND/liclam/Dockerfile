FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy the maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (this caches them in a separate layer)
RUN ./mvnw dependency:go-offline -B

# Copy source code and build
COPY src src
RUN ./mvnw package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
