FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
ARG WEB_BASE_URL
ENV WEB_BASE_URL=${WEB_BASE_URL}
ENTRYPOINT ["/bin/sh", "-c" , "./wait-for-http.sh ${API_URL}/api/health && npx env-cmd cross-env WEB_BASE_URL=${WEB_BASE_URL} nx run web-e2e:e2e"]
