
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install

COPY . .
RUN npm run build

# Etap 2: Uruchamianie aplikacji
FROM node:20 AS runner

WORKDIR /usr/src/app


COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./



RUN npm install --only=production --ignore-scripts


RUN npm rebuild bcrypt --build-from-source

ENV NODE_ENV=production

EXPOSE 3000

# Użytkownik nie-root dla bezpieczeństwa (opcjonalne, ale zalecane)
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nestjs --ingroup nodejs
# USER nestjs

CMD ["node", "dist/main.js"]