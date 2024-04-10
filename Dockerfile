FROM node:20-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install
COPY . .
EXPOSE 3500
ENV PORT 3500

CMD ["npm", "run", "start"]
