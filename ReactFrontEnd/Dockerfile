# Usando Node.js como imagem base
FROM node:18-alpine as build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos para dentro do container
COPY . .

# Compila a aplicação React
RUN npm run build

# Usa uma imagem Nginx para servir os arquivos estáticos do React
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html

RUN ls /usr/share/nginx/html

# Expondo a porta usada pela aplicação
EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]