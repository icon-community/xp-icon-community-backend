# Hana Rewards Backend

## Project structure
```
./
├── db-manager/                 # Blockchain scraper and database management scripts
├── docker-compose-dev.yml
├── docker-compose-prod.yml
├── Makefile
├── nestjs-rest-server/         # REST API server
├── nginx/                      # Nginx configuration files
├── smart-contract/             # Smart contract source code
```

## Pre-requisites
- Node.js
- Docker
- Docker Compose
- MongoDB

## REST API Server

* `GET /v1/auth/challenge/:address`
    - **Description**: Generates a challenge string for the given user address.
    - **Path Parameters**:
    - `address` (string): The user's wallet address.
    - **Response**: Returns a challenge string.

* `POST /v1/auth/challenge/verify`
    - **Description**: Verifies the provided challenge response.
    - **Request Body**:
  ```json
  {
    "message": "<string>"
  }
  ```
    - **Response**: Returns a JWT token upon successful verification.

* `POST /v1/auth/logout`
    - **Description**: Logs out the user by invalidating the JWT token.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Response**: Confirmation of logout.

* `GET /v1/daily-check-in`
    - **Description**: Retrieves the current daily check-in status for the user.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Response**: Status of the daily check-in.

* `POST /v1/daily-check-in`
    - **Description**: Marks the user’s daily check-in.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Response**: Confirmation of the daily check-in.

* `GET /v1/referral/:address`
    - **Description**: Retrieves referral details for the specified address.
    - **Path Parameters**:
        - `address` (string): The user's wallet address.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Response**: Referral details.

* `GET /v1/referral/:address/period`
    - **Description**: Retrieves referral details for a specified period.
    - **Path Parameters**:
        - `address` (string): The user's wallet address.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Response**: Referral details for the period.

* `GET /v1/season/:seasonLabel`
    - **Description**: Retrieves details about a specific season.
    - **Path Parameters**:
        - `seasonLabel` (string): The identifier for the season.
    - **Response**: Season details.

* `POST /v1/season/:seasonLabel`
    - **Description**: Creates or updates a season with baseline and total information.
    - **Path Parameters**:
        - `seasonLabel` (string): The identifier for the season.
    - **Request Body**:
  ```json
  {
    "baseline": <number>,
    "total": <number>,
    "filter": {
      "omit": ["<string>"]
    }
  }
  ```
    - **Response**: Confirmation of season creation or update.
    - **Example**:
``` bash
# with filter
curl -X POST -H "Content-Type: application/json" --data '{"total": "10000", "baseline": "10","filter":{"omit":["hxd4eb0a6c591b5e7a76e9a6677da055ebfdd897da","hxd83405d540ac959c2921be4ef735a5ab7114a748","hxad77420520a8dfe69ce3c4a8055cfcf0fa3e3c2c"]}}' http://localhost:3500/v1/season/seasonLabel

# without filter
curl -X POST -H "Content-Type: application/json" --data '{"total": "10000", "baseline": "10"}' http://localhost:3500/v1/season/seasonLabel
```

* `GET /v1/season/:seasonLabel/task/:taskLabel`
    - **Description**: Retrieves details of a specific task within a season.
    - **Path Parameters**:
        - `seasonLabel` (string): The identifier for the season.
        - `taskLabel` (string): The identifier for the task.
    - **Response**: Task details.

* `POST /v1/tasks/claimable`
    - **Description**: Retrieves tasks claimable by the user.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Request Body**:
  ```json
  {
    "season": "<string>",
    "taskLabel": "<string>",
    "details": {
      "kind": "<string>",
      "email": "<string>",
      "provider": "<string>"
    }
  }
  ```
    - **Response**: Claimable tasks.

* `POST /v1/tasks/claim`
    - **Description**: Claims a specified task for the user.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Request Body**:
  ```json
  {
    "season": "<string>",
    "taskLabel": "<string>",
    "details": {
      "kind": "<string>",
      "email": "<string>",
      "provider": "<string>"
    }
  }
  ```
    - **Response**: Confirmation of task claim.

* `GET /v1/user/hana-newsletter/subscriber`
    - **Description**: Checks if the user is subscribed to the Hana newsletter.
    - **Headers**:  `Authorization`: Bearer {Token}
    - **Response**: Subscription status.

* `POST /v1/user/hana-newsletter/subscribe`
    - **Description**: Subscribes the user to the Hana newsletter.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Request Body**:
  ```json
  {
    "season": "<string>",
    "taskLabel": "<string>",
    "email": "<string>"
  }
  ```
    - **Response**: Confirmation of subscription.

* `POST /v1/user/register`
    - **Description**: Registers a new user with a referral code.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Request Body**:
  ```json
  {
    "referralCode": "<string>"
  }
  ```
    - **Response**: Confirmation of user registration.

* `POST /v1/user/register-season`
    - **Description**: Registers a user for a specific season.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Request Body**:
  ```json
  {
    "address": "<string>",
    "seasonLabel": "<string>"
  }
  ```
    - **Response**: Confirmation of season registration.

* `POST /v1/user/link-social`
    - **Description**: Links a social account to the user's profile.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Request Body**:
  ```json
  {
    "provider": "<string>",
    "providerAccountId": "<string>",
    "name": "<string>",
    "email": "<string>",
    "imageUrl": "<string>",
    "seasonLabel": "<string>"
  }
  ```
    - **Response**: Confirmation of social account linkage.

* `POST /v1/user/link-wallet`
    - **Description**: Links a wallet to the user's profile.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Request Body**:
  ```json
  {
    "address": "<string>",
    "type": "<string>",
    "accessToken": "<string>"
  }
  ```
    - **Response**: Confirmation of wallet linkage.

* `GET /v1/user/:address`
    - **Description**: Retrieves user details for the specified address.
    - **Path Parameters**:
        - `address` (string): The user's wallet address.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Response**: User details.

* `GET /v1/user/:userWallet/season/:season`
    - **Description**: Retrieves details about a user's participation in a specific season.
    - **Path Parameters**:
        - `userWallet` (string): The user's wallet address.
        - `season` (string): The season identifier.
    - **Response**: User season details.

* `GET /v1/user/:referral-code`
    - **Description**: Retrieves user details using a referral code.
    - **Path Parameters**:
        - `referral-code` (string): The referral code.
    - **Headers**: `Authorization`: Bearer {Token}
    - **Response**: User details.

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
