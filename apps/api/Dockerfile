# Common
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build
FROM base AS build
COPY . .
RUN npm run build

# Production
FROM node:22-alpine AS prod
WORKDIR /app
COPY .env ./
COPY package*.json ./
RUN npm ci --prod --ignore-scripts
COPY --from=build /app/dist/apps/api /app/dist
