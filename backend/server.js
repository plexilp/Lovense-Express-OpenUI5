const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const constants = require("./app/constants/constants");

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

  requestController = require("./app/controllers/requests.controller");

  // simple route
  app.get("/", (req, res) => {
    res.json({ message: "NodeJS LovApi" });
  });
  app.get("/getConfig", (req, res) => {
    res.send(constants.CONFIG);
  });
  app.get("/getDevices", (req, res) => {
    const result = requestController.getDevice();
    res.send(result);
  });

  // ValueHelps
  app.get("/listActions", (req, res) => {
    res.send(constants.ACTIONS);
  });
  app.get("/listRules", (req, res) => {
    res.send(constants.RULES);
  });
  app.get("/listModes", (req, res) => {
    res.send(constants.MODES);
  });

  // Posts
  app.post("/startDevice", (req, res) => {
    res.send("POST");
  });
  app.post("/stopDevice", (req, res) => {
    res.send("POST");
  });
  app.post("/checkConnection", (req, res) => {
    res.send("POST");
  });

  // set port, listen for requests
  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
