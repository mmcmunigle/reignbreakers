build:
	docker-compose build

build-api:
	docker-compose build app-backend

up:
	docker-compose up -d

down:
	docker-compose down