# Common
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Production
FROM node:22-alpine AS prod
WORKDIR /app
COPY .env ./
COPY package*.json ./
COPY --from=build /app/dist /app/dist
RUN npm ci --prod --ignore-scripts
