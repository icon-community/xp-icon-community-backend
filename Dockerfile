FROM node:20-alpine

RUN apk update
RUN apk add --no-cache libc6-compat
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python
RUN apk add g++ make py3-pip

RUN mkdir -p /app

WORKDIR /app
RUN mkdir common db-manager rest-server utils

COPY db-manager/common ./common
COPY ./db-manager ./db-manager
COPY ./rest-server ./rest-server
COPY db-manager/common/utils ./utils
COPY package.json package-lock.json .env .

RUN npm install

WORKDIR /app/rest-server
RUN npm install

WORKDIR /app/db-manager
RUN npm install

# Specify the command to run your application
CMD ["node", "blockchain-scraper.js"]
