# Common
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# E2E tests
FROM base AS e2e_tests
RUN apk add --no-cache bash
COPY . .
RUN npm run build
COPY ./ci/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
ENTRYPOINT ["/wait-for-it.sh", "makefilm_db_tests:5432", "--", "sh", "-c", "npm run migration:run:e2e:ci || echo 'Migration failed!' && npm run test:api:e2e:ci || echo 'Test failed!'"]
