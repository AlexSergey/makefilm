setup local dev env:
NODE_ENV=test DATABASE_PORT=5432 DATABASE_URL="postgresql://poll_user:poll_password@makefilm_db_test:
5432/poll_db?schema=public" docker-compose --env-file .env up -d database

setup local api e2e test env:
NODE_ENV=test DATABASE_PORT=5433 DATABASE_URL="postgresql://poll_user:poll_password@makefilm_db_test:
5432/poll_db?schema=public" docker-compose --env-file .env up -d database db_configurator

setup ci api e2e test env:
NODE_ENV=test DATABASE_PORT=5433 DATABASE_URL="postgresql://poll_user:poll_password@makefilm_db_test:
5432/poll_db?schema=public" docker-compose --env-file .env up -d database db_configurator api api-e2e

setup local web e2e test env:
NODE_ENV=test API_URL=http://localhost FIXTURES=true SEEDS=false DATABASE_PORT=5433 DATABASE_URL="postgresql://poll_user:
poll_password@makefilm_db_test:
5432/poll_db?schema=public" docker-compose --env-file .env up -d database db_configurator api web nginx web-e2e

setup ci web e2e test env:
NODE_ENV=test API_URL=http://makefilm:80 FIXTURES=true SEEDS=false DATABASE_PORT=5433 DATABASE_URL="postgresql://poll_user:
poll_password@makefilm_db_test:
5432/poll_db?schema=public" docker-compose --env-file .env up -d database db_configurator api web nginx web-e2e
