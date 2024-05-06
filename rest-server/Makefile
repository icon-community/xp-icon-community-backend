start-rest-server:
	docker compose up -d
	@echo "Docker containers up"

stop-rest-server:
	docker compose down
	@echo "Docker containers down"

rebuild-rest-server:
	docker compose down
	docker compose up -d --build
	@echo "Docker containers up"
