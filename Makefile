build:
	docker-compose build

build-api:
	docker-compose build app-backend

up:
	docker-compose up -d

up-db:
	docke-compose up app-db -d

down:
	docker-compose down
