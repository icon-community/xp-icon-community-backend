FROM node:20-alpine

WORKDIR /app

RUN apk update
RUN apk add --no-cache libc6-compat
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python
RUN apk add g++ make py3-pip

COPY . .

RUN npm install

# Specify the command to run your application
CMD ["node", "blockchain-scraper.js"]
