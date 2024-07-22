# XP ICON COMMUNITY BACKEND

Backend for the XP ICON Community project.

## Project structure
```
project-root/
│
├───common/                       # Common files for the project
│   ├───services/                 # Business logic or services
│   ├───models/                   # Database models (MongoDB schemas)
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
│   ├───routes/                   # API route definitions
│   └───utils/                    # Backend Utility functions
│
├───smart-contract/               # Source code for smart contract
│
├───tests/                        # Unit and integration tests
│
├───utils/                       # Global utility files (e.g., database connection)

```

## Development setup

First of all `npm install` to install all the dependencies.

Eslint is used for linting, I recommend to setup eslint in your editor. The project is using the latest Eslint (v9) which uses flat configuration files (`eslint.config.js`) instead of the old hierarchical configuration files (`.eslintrc`).

Migration guide -> https://eslint.org/docs/latest/use/configure/migration-guide

For prettier  we are using V3 this should be easier to setup in your editor.

## Backend server
### Routes

The following routes are available:

- `/v1/user/:userWallet/season/:seasonId` - GET - Get season data for a user
- `/v1/user/:userWallet/` - GET - **Not implemented** Get all seasons for a user
- `/v1/season/:seasonId/` - GET - Return data related to the season
- `/v1/season/:seasonId/` - POST - { baseline: number, total: number, filter: { omit(?): Address[] } } - Receives data for calculation of season rewards to each user. Examples:

``` bash
# with filter
curl -X POST -H "Content-Type: application/json" --data '{"total": "10000", "baseline": "10","filter":{"omit":["hxd4eb0a6c591b5e7a76e9a6677da055ebfdd897da","hxd83405d540ac959c2921be4ef735a5ab7114a748","hxad77420520a8dfe69ce3c4a8055cfcf0fa3e3c2c"]}}' http://localhost:3500/v1/season/seasonLabel

# without filter
curl -X POST -H "Content-Type: application/json" --data '{"total": "10000", "baseline": "10"}' http://localhost:3500/v1/season/seasonLabel
```

- `/v1/season/:seasonId/task/:taskId` - GET - **Not implemented**


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

## MongoDB
To enter the docker container running the mongodb database, run the following command:

```bash
# for the production database
docker exec -it mongodb-prod /bin/bash

# for the development database
docker exec -it mongodb-dev /bin/bash
```

After entering the container in an interactive shell, you can access the mongo shell by running the following command:

```bash
mongosh
```

Once in the mongo shell, you can need to first authenticate with the database by running the following command:

```bash
use admin
#use the username and password defined in the .env file
db.auth("username", "password")
```

After authenticating, you can use the following list of commands to examine the database

```bash
# show all databases
test> show dbs
admin   100.00 KiB
config   60.00 KiB
local    72.00 KiB
test    264.00 KiB # this is the database for the project

# use the project database
test> use test

# show all collections in the database
test> show collections
seasons
tasks
user_tasks
users

# show one document from the users collection
# this command can be used to see the structure of
# the documents in the collection
# you can replace `users` with any other collection name
# ie: db.tasks.findOne()
test> db.users.findOne()
{
  _id: ObjectId('ID_STRING'),
  walletAddress: 'hxcb1...741c8',
  registrationBlock: 80884702,
  dailyCheckInStreak: 0,
  referrals: [],
  updatedAtBlock: 80884702,
  createdAt: ISODate('2024-05-23T14:43:02.522Z'),
  updatedAt: ISODate('2024-05-23T14:43:02.522Z'),
  __v: 0,
  seasons: [
    {
      seasonId: ObjectId('ID_STRING'),
      registrationBlock: 80884702,
      referrals: [],
      _id: ObjectId('ID_STRING')
    }
  ]
}

# show the amount of documents in a collection
test> db.users.countDocuments()
6
```
