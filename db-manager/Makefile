LINE_BREAK := @echo "************"
START_DOCKER_NON_PERSISTENT := @echo "Starting mongodb container" && docker compose -f docker-compose-non-persistent.yml up -d
STOP_DOCKER_NON_PERSISTENT := @echo "Stopping mongodb container" && docker compose -f docker-compose-non-persistent.yml down
MONGO_CONTAINER_NAME := mongodb-db-non-persistent

start-docker-non-persistent:
	$(START_DOCKER_NON_PERSISTENT)

stop-docker-non-persistent:
	$(STOP_DOCKER_NON_PERSISTENT)

test-scraper-mainnet:
	@echo "> Running scraper tests"
	$(START_DOCKER_NON_PERSISTENT)
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	# BLOCK=80670350 TIME=60 NODE_ENV=dev node blockchain-scraper.js
	TIME=60 NODE_ENV=dev node blockchain-scraper.js
	$(LINE_BREAK)
	$(STOP_DOCKER_NON_PERSISTENT)

test-scraper-mainnet-no-task:
	@echo "> Running scraper tests"
	$(START_DOCKER_NON_PERSISTENT)
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=80670350 TIME=60 NO_TASK=true NODE_ENV=dev node blockchain-scraper.js
	$(LINE_BREAK)
	$(STOP_DOCKER_NON_PERSISTENT)

test-scraper-devnet-no-task:
	@echo "> Running scraper tests"
	$(START_DOCKER_NON_PERSISTENT)
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=8031000 TIME=300 NO_TASK=true CHAIN=devnet NODE_ENV=dev node blockchain-scraper.js
	$(LINE_BREAK)
	$(STOP_DOCKER_NON_PERSISTENT)

test-scraper-devnet-no-task-no-time-limit:
	@echo "> Running scraper tests"
	$(START_DOCKER_NON_PERSISTENT)
	$(LINE_BREAK)
	@echo "Starting blockchain scraper"
	BLOCK=8082000 NO_TASK=true CHAIN=devnet NODE_ENV=dev node blockchain-scraper.js
	$(LINE_BREAK)
	$(STOP_DOCKER_NON_PERSISTENT)

test-task-addition:
	@echo "> Running scraper tests"
	$(START_DOCKER_NON_PERSISTENT)
	$(LINE_BREAK)
	@echo "Starting task addition"
	NODE_ENV=dev node scripts/updateTasks.js
	$(LINE_BREAK)
	$(STOP_DOCKER_NON_PERSISTENT)

test-season-addition:
	@echo "> Running scraper tests"
	$(START_DOCKER_NON_PERSISTENT)
	$(LINE_BREAK)
	@echo "Starting task addition"
	NODE_ENV=dev node scripts/updateTasks.js
	@echo "Starting season addition"
	NODE_ENV=dev node scripts/updateSeasons.js
	$(LINE_BREAK)
	$(STOP_DOCKER_NON_PERSISTENT)

test-user-addition:
	@echo "> Running scraper tests"
	$(START_DOCKER_NON_PERSISTENT)
	$(LINE_BREAK)
	@echo "Starting task addition"
	NODE_ENV=dev node scripts/updateTasks.js
	@echo "Starting season addition"
	NODE_ENV=dev node scripts/updateSeasons.js
	@echo "Starting users addition"
	NODE_ENV=dev node scripts/updateUsers.js
	$(LINE_BREAK)
	$(STOP_DOCKER_NON_PERSISTENT)

test-user-addition-2:
	@echo "> Running scraper tests"
	$(START_DOCKER_NON_PERSISTENT)
	$(LINE_BREAK)
	@echo "Starting task addition"
	NODE_ENV=dev node scripts/updateTasks.js
	@echo "Starting season addition"
	NODE_ENV=dev node scripts/updateSeasons.js
	@echo "Starting users addition"
	NODE_ENV=dev node scripts/updateUsers.js
	@echo "Starting users addition"
	NODE_ENV=dev node scripts/updateUsers.js
	$(LINE_BREAK)
	$(STOP_DOCKER_NON_PERSISTENT)
