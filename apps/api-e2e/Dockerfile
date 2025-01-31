FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
ARG API_URL
ARG DATABASE_URL
ENV API_URL=${API_URL}
ENV DATABASE_URL=${DATABASE_URL}
COPY ./ci/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
RUN apk add --no-cache bash
ENTRYPOINT ./wait-for-it.sh $API_URL -- sh -c "npx env-cmd cross-env DATABASE_URL=${DATABASE_URL} cross-env API_URL=${API_URL} nx run api-e2e:e2e"
