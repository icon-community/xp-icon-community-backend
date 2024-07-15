// rest-server/server.js
// REST API server. Gets data from the local mongoDB database and serves it to the client.
//
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const config = require("../utils/config");
const PORT = config.ports.backend;

// Configure middlewares
morgan.token("body", (req, res) => {
  void res;
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
  optionsSuccessStatus: 204,
};

// Create the express app
const app = express();

// Use middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(
  morgan(
    ":method :req[header] :url :status :body - :response-time ms \n------------\n",
  ),
);

app.use(express.static(path.join(__dirname, "www")));

// routes
app.use("/v1", require("./routes/v1"));

/* eslint-disable-next-line no-unused-vars */
app.use((req, res, next) => {
  res.status(404).json({ error: "Path not found" });
});

async function start() {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

start();
