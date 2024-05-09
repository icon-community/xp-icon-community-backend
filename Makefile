run-prod:
	@echo "Running production server"
	@docker compose -f docker-compose-prod.yml up -d

stop-prod:
	@echo "Stopping production server"
	@docker compose -f docker-compose-prod.yml down

run-dev:
	@echo "Running development server"
	@docker compose -f docker-compose-dev.yml up -d --build

stop-dev:
	@echo "Stopping development server"
	@docker compose -f docker-compose-dev.yml down
