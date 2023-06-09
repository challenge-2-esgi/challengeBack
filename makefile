up:
	docker compose up -d

down:
	docker compose down

create-network:
	docker network create challenge2

exec:
# pass docker compose service name as argument
	docker compose exec $(filter-out $@,$(MAKECMDGOALS)) /bin/sh

back-install:
	docker compose exec auth-service npm install
	docker compose exec candidate-service npm install
	docker compose exec recruiter-service npm install

back-dev:
	docker compose exec -d auth-service npm run start:dev
	docker compose exec -d candidate-service npm run start:dev
	docker compose exec -d recruiter-service npm run start:dev

# start dev server for specific service
auth-dev:
	docker compose exec auth-service npm run start:dev
candidate-dev:
	docker compose exec candidate-service npm run start:dev
recruiter-dev:
	docker compose exec recruiter-service npm run start:dev

# make command on each Caddyfile change
caddy-reload:
	docker compose exec api-gateway caddy reload --config /etc/caddy/Caddyfile

# prisma
# pass docker compose service name as argument to the command
prisma-client:
	docker compose exec $(filter-out $@,$(MAKECMDGOALS)) npx prisma generate
prisma-db:
	docker compose exec $(filter-out $@,$(MAKECMDGOALS)) npx prisma db push
migrate:
	docker compose exec $(filter-out $@,$(MAKECMDGOALS)) npx prisma migrate dev
seed:
	docker compose exec $(filter-out $@,$(MAKECMDGOALS)) npx prisma db seed

# e2e tests
test:
	docker compose exec $(filter-out $@,$(MAKECMDGOALS)) npm run test:e2e