# Use official Node.js image as the base image
FROM node:18-alpine

# Install bash
RUN apk add --no-cache bash

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .
RUN chmod +x /usr/src/app/wait-for-it.sh

# Build the NestJS application
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
