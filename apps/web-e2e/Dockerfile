FROM mcr.microsoft.com/playwright:v1.50.0-noble
WORKDIR /app
COPY . .
RUN npm install
RUN npx playwright install --with-deps
ARG API_URL
ENV API_URL=${API_URL}
ARG WEB_BASE_URL
ENV WEB_BASE_URL=${WEB_BASE_URL}
COPY ./ci/wait-for-http.sh /app/wait-for-http.sh
RUN chmod +x /app/wait-for-http.sh
RUN apt-get update && \
      apt-get -y install sudo
RUN apt-get install bash
RUN apt-get install curl
# CMD ["tail", "-f", "/dev/null"]
ENTRYPOINT ["/bin/sh", "-c" , "./wait-for-http.sh ${API_URL}/api/health && npx env-cmd cross-env CI=true cross-env WEB_BASE_URL=${WEB_BASE_URL} nx run web-e2e:e2e"]
