# Common
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build
FROM base AS build
COPY . .
RUN npm run build

# Migrations
FROM base AS migrations
COPY . .
COPY .env .env
RUN npm run build
COPY ./ci/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
RUN apk add --no-cache bash
ARG NODE_ENV
ARG DATABASE_PORT
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
WORKDIR /app
ENTRYPOINT ./wait-for-it.sh makefilm_db_$NODE_ENV:5432 -- sh -c "DATABASE_URL=${DATABASE_URL} DATABASE_TYPE=postgres npm run migration:run && touch /shared/db_ready && tail -f /dev/null"

# Production
FROM node:22-alpine AS run_api
WORKDIR /app
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
COPY .env .env
COPY package*.json ./
RUN npm ci --prod --ignore-scripts
COPY --from=build /app/dist/apps/api /app/dist
COPY ./ci/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
RUN apk add --no-cache bash
CMD while [ ! -f "/shared/db_ready" ]; do sleep 1; done && "node dist/main.js"
