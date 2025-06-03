# Plik: backend/Dockerfile

# Etap 1: Budowanie aplikacji
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etap 2: Uruchamianie aplikacji
FROM node:20-slim AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --only=production

ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "dist/main.js"]