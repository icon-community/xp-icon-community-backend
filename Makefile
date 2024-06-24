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

run-dev:
	@echo "Running development server"
	@docker compose -f docker-compose-dev.yml up -d --build

stop-dev:
	@echo "Stopping development server"
	@docker compose -f docker-compose-dev.yml down
