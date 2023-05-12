up:
	docker compose up -d

down:
	docker compose down

create-network:
	docker network create challenge2

exec:
	docker compose exec back /bin/sh

back-start:
	docker compose exec back npm start

back-install:
	docker compose exec back npm install

back-dev:
	docker compose exec back npm run start:dev
	