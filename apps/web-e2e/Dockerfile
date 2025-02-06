FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
ARG API_URL
ENV API_URL=${API_URL}
ARG WEB_BASE_URL
ENV WEB_BASE_URL=${WEB_BASE_URL}
COPY ./ci/wait-for-http.sh /app/wait-for-http.sh
RUN chmod +x /app/wait-for-http.sh
RUN apk add --no-cache bash
RUN apk add curl
ENTRYPOINT ["/bin/sh", "-c" , "./wait-for-http.sh ${API_URL}/api/health && npx env-cmd cross-env WEB_BASE_URL=${WEB_BASE_URL} nx run web-e2e:e2e"]
