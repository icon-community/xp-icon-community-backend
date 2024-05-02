LINE_BREAK := @echo "************"


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

stop-docker-non-persistent:
	@echo "Stopping mongodb container"
	docker compose -f db/docker-compose-non-persistent.yml down

test-scraper:
	@echo "> Running scraper tests"
	@echo "Starting mongodb container"
	docker compose -f db/docker-compose-non-persistent.yml up -d
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=80670350 TIME=60 node db-manager/blockchain-scraper.js
	$(LINE_BREAK)
	@echo "Stopping mongodb container"
	docker compose -f db/docker-compose-non-persistent.yml down

test-scraper-no-task:
	@echo "> Running scraper tests"
	@echo "Starting mongodb container"
	docker compose -f db/docker-compose-non-persistent.yml up -d
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=80670350 TIME=60 NO_TASK=true node db-manager/blockchain-scraper.js
	$(LINE_BREAK)
	@echo "Stopping mongodb container"
	docker compose -f db/docker-compose-non-persistent.yml down

test-scraper-devnet-no-task:
	@echo "> Running scraper tests"
	@echo "Starting mongodb container"
	docker compose -f db/docker-compose-non-persistent.yml up -d
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=8031000 TIME=300 NO_TASK=true CHAIN=devnet node db-manager/blockchain-scraper.js
	$(LINE_BREAK)
	@echo "Stopping mongodb container"
	docker compose -f db/docker-compose-non-persistent.yml down

test-scraper-devnet-no-task-no-time-limit:
	@echo "> Running scraper tests"
	@echo "Starting mongodb container"
	docker compose -f db/docker-compose-non-persistent.yml up -d
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=8031000 NO_TASK=true CHAIN=devnet node db-manager/blockchain-scraper.js
	$(LINE_BREAK)
	@echo "Stopping mongodb container"
	docker compose -f db/docker-compose-non-persistent.yml down
