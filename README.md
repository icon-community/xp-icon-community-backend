# XP ICON COMMUNITY BACKEND

Backend for the XP ICON Community project.

## Project structure
```
project-root/
│
├───db/                           # MongoDB database files
│   └───docker-compose.yml        # Docker Compose file for running MongoDB
│
├───db-manager/                   # Database management scripts or jobs
│   └───blockchain-scraper.js     # Script for fetching data from blockchain
│   ├───data/                     # Seed files for database initialization
│   ├───scripts/                  # Scripts for updating tasks and seasons in the database
│   ├───tasks/                    # Tasks for the blockchain scraper
│   ├───utils/                    # Utility functions
│
├───rest-server/                  # Source code for the REST API server
│   ├───controllers/              # Route controllers
│   ├───models/                   # Database models (MongoDB schemas)
│   ├───routes/                   # API route definitions
│   ├───services/                 # Business logic or services
│   └───utils/                    # Backend Utility functions
│
├───smart-contract/               # Source code for smart contract
│
├───tests/                        # Unit and integration tests
│
├───utils/                       # Global utility files (e.g., database connection)
│
└───node_modules/                 # Node.js modules (generated after running npm install)

```

## Development setup

First of all `npm install` to install all the dependencies.

Eslint is used for linting, I recommend to setup eslint in your editor. The project is using the latest Eslint (v9) which uses flat configuration files (`eslint.config.js`) instead of the old hierarchical configuration files (`.eslintrc`).

Migration guide -> https://eslint.org/docs/latest/use/configure/migration-guide

For prettier  we are using V3 this should be easier to setup in your editor.

## Backend server
### Routes

The following routes are available:

- `/v1/user/:userWallet` - GET - Get all season data for a user
- `/v1/user/:userWallet/season/:seasonId` - GET - Get season data for a user

## Blockchain scraper
The blockchain scraper is a script that fetches data from the ICON blockchain and stores it in the database. The script is located in the `db-manager` directory.

A mongodb database is required to be running in the background and accessible via the URI defined in a `.env` file in the root directory. If a mongodb database is not running, the scraper will not work and will show connection errors.

### Running the blockchain scraper

The blockchain scraper can be called with environment variables to define specific parameters, you can see examples of these in the `Makefile`.

The following environment variables are available:

- `BLOCK` - defines the block number from which the scraper should start fetching data. If not defined the scraper will read from a seed file that contains the last block number that was fetched, if the seed file doesnt have any data it will start from the `blockStart` entry in the season defined as `active` in the database.
- `TIME` - Defines the time in seconds the scraper will run (Used only for testing purposes)
- `NO_TASK` - if defined the value should be `true` and the scraper will not run the internal tasks in the monitor. (Used only for testing purposes)
- `CHAIN` - defines the chain to be used, if not defined the scraper will use the `mainnet` chain.


### Updating tasks and seasons in the database

Individual scripts can be run to update tasks and seasons in the database. These scripts are located in the `db-manager/scripts` directory.

* `updateSeasons.js` - Updates the seasons in the database by reading the seed file in the `db-manager/data` directory.
* `updateTasks.js` - Updates the tasks in the database by reading the seed file in the `db-manager/data` directory.
