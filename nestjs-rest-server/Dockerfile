FROM node:20 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm ci
RUN npm install

FROM builder AS prod

COPY . .

RUN npm run build

CMD [ "node", "./dist/main.js" ]

FROM builder AS dev

COPY *.json ./

CMD ["/bin/sh", "-c", "npm run start:dev"]
