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
│   └───blockchain_scraper.js     # Script for fetching data from blockchain
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

## Routes

The following routes are available:

- `/v1/user/:userWallet` - GET - Get all season data for a user
- `/v1/user/:userWallet/season/:seasonId` - GET - Get season data for a user
