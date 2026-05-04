FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts .
COPY src ./src
RUN npx prisma generate
RUN npm run build

FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts .
RUN npm ci --omit=dev
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/src/main"]
