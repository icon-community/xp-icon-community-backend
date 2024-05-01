start-rest-server:
	@docker compose up -d
	@echo "Docker containers up"

stop-rest-server:
	@docker compose down
	@echo "Docker containers down"

rebuild-rest-server:
	@docker compose down
	@docker compose up -d --build
	@echo "Docker containers up"

test-scraper:
	@echo "> Running scraper tests"
	@echo "Starting mongodb container"
	@docker compose -f db/docker-compose-non-persistent.yml up -d
	@echo "Starting blockchain scraper"
	@BLOCK=80670350 node db-manager/blockchain-scraper.js
	@echo "Stopping mongodb container"
	@docker compose -f db/docker-compose-non-persistent.yml down
# test-scraper:
# 	@echo "> Running scraper tests"
# 	@echo "Starting mongodb container"
# 	@docker compose -f db/docker-compose-non-persistent.yml up -d
# 	@echo "Starting blockchain scraper"
# 	@node db-manager/blockchain-scraper.js
# 	@echo "Stopping mongodb container"
# 	@docker compose -f db/docker-compose-non-persistent.yml down
