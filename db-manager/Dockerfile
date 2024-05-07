FROM node:latest

WORKDIR /usr/src/app

# Create a directory named root
RUN mkdir root

# Copy the common folder into the root directory
COPY ../common .

# Copy the entire contents of the db-manager directory into the root directory
COPY . root/db-manager

# Navigate to the root directory
WORKDIR /usr/src/app/root/db-manager

# Install dependencies
COPY package*.json ./
RUN npm install

# Specify the command to run your application
CMD ["node", "blockchain-scraper.js"]
