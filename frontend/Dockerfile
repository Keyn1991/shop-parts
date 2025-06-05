FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
# COPY yarn.lock ./
RUN npm install # Lub npm ci --ignore-scripts
# RUN yarn install --frozen-lockfile

COPY . .

# Przekazywanie VITE_API_URL jako argumentu budowania
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Etap 2: Serwowanie aplikacji za pomocą Nginx
FROM nginx:stable-alpine

# Usuń domyślną konfigurację Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Kopiuj niestandardową konfigurację Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiuj zbudowane pliki statyczne
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]