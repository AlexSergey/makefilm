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

# Unit tests
FROM base AS unit_tests
COPY . .
RUN npm test

# Production
FROM node:22-alpine AS prod
WORKDIR /app
COPY .env ./
COPY package*.json ./
COPY --from=build /app/dist /app/dist
RUN npm ci --prod --ignore-scripts
