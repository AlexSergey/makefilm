# Common
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npm run prisma:generate

# Lint
FROM base AS lint
COPY . .
RUN npm run lint

# Build
FROM base AS build
COPY . .
RUN npm run build

# Unit tests
FROM base AS unit_tests
COPY . .
RUN npm test

# E2E tests
FROM base AS e2e_tests
COPY . .
RUN npm run build
RUN npm run test:e2e

# Production
FROM node:22-alpine AS prod
WORKDIR /app
COPY .env ./
COPY package*.json ./
COPY prisma ./prisma
COPY --from=build /app/dist /app/dist
RUN npm ci --prod --ignore-scripts
RUN npm run prisma:generate
CMD ["npm", "run", "start:prod"]
