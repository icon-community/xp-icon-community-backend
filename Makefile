#------------------- Prod Environment Commands----------
run-prod:
	@echo "Running production server"
	@docker compose -f docker-compose-prod.yml up -d

run-prod-rebuild:
	@echo "Running production server"
	@docker compose -f docker-compose-prod.yml up -d --build

stop-prod:
	@echo "Stopping production server"
	@docker compose -f docker-compose-prod.yml down

update-prod-rest-server:
	@echo "Updating production server (rest-server)"
	@docker compose -f docker-compose-prod.yml up -d --no-deps --build rest-server

update-prod-blockchain-scraper:
	@echo "Updating production server (rest-server)"
	@docker compose -f docker-compose-prod.yml up -d --no-deps --build blockchain-scraper

#------------------- Dev Environment Commands-----------
run-dev:
	@echo "Running development server"
	@docker compose -f docker-compose-dev.yml up -d --build

stop-dev:
	@echo "Stopping development server"
	@docker compose -f docker-compose-dev.yml down

run-dev-mongodb:
	@echo "Running dev mongodb server"
	@docker compose -f docker-compose-dev.yml up -d mongodb --build

stop-dev-mongodb:
	@echo "Running dev mongodb server"
	@docker compose -f docker-compose-dev.yml down mongodb

run-dev-rest-api:
	@echo "Running dev mongodb server"
	@docker compose -f docker-compose-dev.yml up -d rest-server --build

stop-dev-rest-api:
	@echo "Running dev mongodb server"
	@docker compose -f docker-compose-dev.yml down rest-server

update-dev-rest-server:
	@echo "Updating dev server (rest-server)"
	@docker compose -f docker-compose-dev.yml up -d --no-deps --build rest-server

update-dev-auth-server:
	@echo "Updating dev server (rest-server)"
	@docker compose -f docker-compose-dev.yml up -d --no-deps --build auth-server
