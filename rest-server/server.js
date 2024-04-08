// rest-server/server.js
// REST API server. Gets data from the local mongoDB database and serves it to the client.
//
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

// Configure middlewares
morgan.token("body", (req, res) => {
  if (req.body == null) {
    return {};
  } else {
    const maxLength = 120;
    const bodyString = JSON.stringify(req.body);
    return bodyString.length < maxLength
      ? bodyString
      : bodyString.slice(0, maxLength) + "...";
  }
});

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Create the express app
const app = express();

// Use middlewares
app.use(express.json());
app.use(helmet());
app.use(
  morgan(
    ":method :req[header] :url :status :body - :response-time ms \n------------\n"
  )
);

app.use(express.static(path.join(__dirname, "www")));

// routes
app.use("/foo", require("./routes/foo"));

async function start() {
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
}

start();
