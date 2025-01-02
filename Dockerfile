# Common
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Lint
FROM base AS lint
COPY . .
RUN npm run lint

# Build
FROM base AS build
COPY . .
RUN npm run build

# E2E tests
FROM base AS test
COPY . .
RUN npm run build
RUN npm run test:e2e

CMD ["node", "dist/main.js"]
