# Étape 1 : Build React app
FROM node:18-alpine AS build
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le code source
COPY . .

# Build de l'application
RUN npm run build

# Étape 2 : Utiliser Nginx pour servir les fichiers
FROM nginx:alpine

# Copier les fichiers de build dans le dossier public de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose le port utilisé par Nginx
EXPOSE 80

# Lancer Nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
