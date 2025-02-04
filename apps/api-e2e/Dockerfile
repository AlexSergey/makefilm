FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
ARG API_URL
ARG DATABASE_URL
ENV API_URL=${API_URL}
ENV DATABASE_URL=${DATABASE_URL}
COPY ./ci/wait-for-http.sh /app/wait-for-http.sh
RUN chmod +x /app/wait-for-http.sh
RUN apk add --no-cache bash
RUN apk add curl
ENTRYPOINT ["/bin/sh", "-c" , "./wait-for-http.sh ${API_URL}/api/health && npx env-cmd cross-env DATABASE_URL=${DATABASE_URL} cross-env API_URL=${API_URL} nx run api-e2e:e2e"]
