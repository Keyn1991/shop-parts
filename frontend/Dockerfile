# Etap 1: Budowanie aplikacji React
FROM node:20-slim AS builder

WORKDIR /app

# Kopiuj package.json i package-lock.json (lub yarn.lock)
COPY package*.json ./
# COPY yarn.lock ./ # Jeśli używasz yarn

# Instaluj zależności
RUN npm install
# RUN yarn install # Jeśli używasz yarn

# Kopiuj resztę kodu aplikacji
COPY . .

# Buduj aplikację produkcyjną
# Pamiętaj, aby skonfigurować BASE_API_URL dla frontendu (np. przez zmienne środowiskowe Vite)
# Jeśli API będzie pod adresem np. /api na tej samej domenie co frontend,
# to BASE_API_URL może być relatywne.
# Jeśli backend będzie na innej domenie/porcie, frontend musi o tym wiedzieć.
RUN npm run build

# Etap 2: Serwowanie aplikacji za pomocą Nginx
FROM nginx:stable-alpine

# Usuń domyślną konfigurację Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Kopiuj niestandardową konfigurację Nginx (stworzymy ją poniżej)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiuj zbudowane pliki statyczne z etapu 'builder' do folderu serwowanego przez Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Odsłoń port, na którym Nginx będzie nasłuchiwał
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]