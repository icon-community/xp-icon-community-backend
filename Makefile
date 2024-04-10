start:
	@docker compose up -d
	@echo "Docker containers up"

stop:
	@docker compose down
	@echo "Docker containers down"

rebuild:
	@docker compose down
	@docker compose up -d --build
	@echo "Docker containers up"
