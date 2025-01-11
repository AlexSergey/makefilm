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
RUN npm run test:api
