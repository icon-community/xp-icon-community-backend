LINE_BREAK := @echo "************"
START_DOCKER := @echo "Starting mongodb container" && docker compose -f db/docker-compose-non-persistent.yml up -d
STOP_DOCKER := @echo "Stopping mongodb container" && docker compose -f db/docker-compose-non-persistent.yml down


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

start-docker-non-persistent:
	$(START_DOCKER)

stop-docker-non-persistent:
	$(STOP_DOCKER)

test-scraper-mainnet:
	@echo "> Running scraper tests"
	$(START_DOCKER)
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=80670350 TIME=60 node db-manager/blockchain-scraper.js
	$(LINE_BREAK)
	$(STOP_DOCKER)

test-scraper-mainnet-no-task:
	@echo "> Running scraper tests"
	$(START_DOCKER)
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=80670350 TIME=60 NO_TASK=true node db-manager/blockchain-scraper.js
	$(LINE_BREAK)
	$(STOP_DOCKER)

test-scraper-devnet-no-task:
	@echo "> Running scraper tests"
	$(START_DOCKER)
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=8031000 TIME=300 NO_TASK=true CHAIN=devnet node db-manager/blockchain-scraper.js
	$(LINE_BREAK)
	$(STOP_DOCKER)

test-scraper-devnet-no-task-no-time-limit:
	@echo "> Running scraper tests"
	$(START_DOCKER)
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=8082000 NO_TASK=true CHAIN=devnet node db-manager/blockchain-scraper.js
	$(LINE_BREAK)
	$(STOP_DOCKER)

test-task-addition:
	@echo "> Running scraper tests"
	$(START_DOCKER)
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	node db-manager/scripts/updateTasks.js
	$(LINE_BREAK)
	$(STOP_DOCKER)
