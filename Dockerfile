FROM node:20-alpine
RUN mkdir -p /app

WORKDIR /app
RUN mkdir common db-manager rest-server utils

COPY ./common ./common
COPY ./db-manager ./db-manager
COPY ./rest-server ./rest-server
COPY ./utils ./utils
COPY package.json package-lock.json .env .

RUN npm install

WORKDIR /app/rest-server
RUN npm install

WORKDIR /app/db-manager
RUN npm install

# Specify the command to run your application
CMD ["node", "blockchain-scraper.js"]
