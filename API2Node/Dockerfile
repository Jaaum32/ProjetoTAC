# Usando Node.js como imagem base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos para dentro do container
COPY . .

# Expondo a porta usada pela aplicação
EXPOSE 3000


# Comando para iniciar a aplicação
CMD ["node", "app.js"]
