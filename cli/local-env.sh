#!/bin/bash

export NODE_ENV=dev
export DATABASE_PORT=5432
export DATABASE_URL="postgresql://poll_user:poll_password@localhost:5432/poll_db?schema=public"
export FIXTURES=false
export SEEDS=false

cd "$(dirname "$0")/.."

docker-compose --env-file .env -f docker-compose.yml up -d database
