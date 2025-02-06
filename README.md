setup local dev env:
NODE_ENV=test DATABASE_PORT=5432 DATABASE_URL="postgresql://poll_user:poll_password@makefilm_db_test:
5432/poll_db?schema=public" docker-compose --env-file .env up -d database

setup local e2e test env:
NODE_ENV=test DATABASE_PORT=5433 DATABASE_URL="postgresql://poll_user:poll_password@makefilm_db_test:
5432/poll_db?schema=public" docker-compose --env-file .env up -d database migrations

setup ci e2e test env:
NODE_ENV=test DATABASE_PORT=5433 DATABASE_URL="postgresql://poll_user:poll_password@makefilm_db_test:
5432/poll_db?schema=public" docker-compose --env-file .env up -d database migrations api api-e2e
