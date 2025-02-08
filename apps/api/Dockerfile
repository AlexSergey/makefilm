# Common
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build
FROM base AS build
COPY . .
RUN npm run build

# DB Configurator
FROM base AS db_configurator
WORKDIR /app
COPY . .
COPY .env .env
COPY ./ci/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
RUN apk add --no-cache bash
ARG NODE_ENV
ARG DATABASE_PORT
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV FIXTURES=false
ENV SEEDS=false
ENTRYPOINT ["/bin/bash", "-c", " \
  ./wait-for-it.sh makefilm_db_$NODE_ENV:5432 -- sh -c \"npx cross-env DATABASE_URL=${DATABASE_URL} cross-env DATABASE_TYPE=postgres npm run migration:run\"; \
  if [ \"$SEEDS\" == \"true\" ] && [ \"$FIXTURES\" == \"true\" ]; then \
    npx cross-env DATABASE_URL=${DATABASE_URL} cross-env DATABASE_TYPE=postgres npm run seeds && cross-env DATABASE_URL=${DATABASE_URL} cross-env DATABASE_TYPE=postgres npm run fixtures; \
  elif [ \"$SEEDS\" == \"true\" ]; then \
    npx cross-env DATABASE_URL=${DATABASE_URL} cross-env DATABASE_TYPE=postgres npm run seeds; \
  elif [ \"$FIXTURES\" == \"true\" ]; then \
    npx cross-env DATABASE_URL=${DATABASE_URL} cross-env DATABASE_TYPE=postgres npm run fixtures; \
  else \
    echo 'No operations to run'; \
  fi; \
  touch /shared/db_ready; \
  tail -f /dev/null \
"]

# Production
FROM node:22-alpine AS prod
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
CMD ["sh", "-c", "while [ ! -f \"/shared/db_ready\" ]; do sleep 1; done && node dist/main.js"]
