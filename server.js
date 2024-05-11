const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const config = {
  bRebuildDatabase: false,
};

start();

async function start() {
  const app = express();

  var corsOptions = {
    origin: "http://localhost:8081",
  };
  const db = require("./app/models");
  await db.sequelize.sync({ force: config.bRebuildDatabase }).then((oData) => {
    if (config.bRebuildDatabase) {
      console.log(">> Drop and re-sync db.");
    }
  });

  app.use(cors(corsOptions));

  // parse requests of content-type - application/json
  app.use(bodyParser.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  // simple route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application." });
  });

  // set port, listen for requests
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
