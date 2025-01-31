# Common
FROM node:22-alpine AS base
WORKDIR /app
COPY . .
ARG API_URL
ENV API_URL=${API_URL}
RUN npm install
RUN npx nx reset
RUN npx env-cmd cross-env cross-env API_URL=${API_URL} nx run web:build --verbose

# Web
FROM nginx:1.27.3 AS prod
COPY --from=base /app/dist/apps/web /usr/share/nginx/html
COPY ./apps/web/nginx/serve.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
