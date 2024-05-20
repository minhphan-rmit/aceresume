FROM node:latest as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
RUN npm run build
CMD ["npm", "run", "preview"]
