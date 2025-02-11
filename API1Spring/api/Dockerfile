# Usa OpenJDK 17 como base
FROM openjdk:17-jdk-slim AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do Gradle
COPY gradlew build.gradle settings.gradle ./
COPY gradle gradle

# Garante que o Gradle tenha permissão de execução
RUN chmod +x gradlew

# Baixa as dependências antes de compilar o código
RUN ./gradlew dependencies --no-daemon || return 0

# Copia o restante dos arquivos do projeto
COPY . .

# Compila a aplicação
RUN ./gradlew bootJar --no-daemon

# Segunda fase: cria uma imagem menor para rodar o JAR
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copia o JAR gerado
COPY --from=build /app/build/libs/*.jar app.jar

# Expondo a porta 8081
EXPOSE 8081

# Comando de execução
ENTRYPOINT ["java", "-jar", "app.jar"]
