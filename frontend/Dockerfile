FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build aşaması
RUN npm run build

# Production sunucusu olarak serve kullanabilirsin:
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
