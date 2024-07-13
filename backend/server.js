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

  process.on("uncaughtException", (err) => {
    console.error("There was an uncaught error", err);
    // Optional: exit process with a 'failure' code
    // process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Optional: exit process with a 'failure' code
    // process.exit(1);
  });
  const RequestController = require("./app/controllers/requests.controller");
  const oReqCtrlInstances = {};

  getUserObject = (req, res) => {
    const sUserId = req.query.userId;
    if (!sUserId) {
      return res
        .status(400)
        .json({ error: "userId is required: Example: /getConfig?userId=1" });
    }

    return _getSetUser(sUserId);
  };

  _getSetUser = (sUserId) => {
    if (!oReqCtrlInstances[sUserId]) {
      oReqCtrlInstances[sUserId] = new RequestController(
        sUserId,
        "192.168.178.71",
        "30010"
      );
    }
    return oReqCtrlInstances[sUserId];
  };

  // simple route
  app.get("/", (req, res) => {
    res.json({ message: "NodeJS LovApi" });
  });
  app.get("/getUserId", (req, res) => {
    //it also register the object(s) for that userid
    const sUserId = "1";
    _getSetUser(sUserId);
    res.json({ userId: sUserId });
  });
  app.get("/getConfig", (req, res) => {
    const oConfig = getUserObject(req, res).getConfig();
    res.send(oConfig);
  });
  app.get("/getDevices", (req, res) => {
    const oUserObj = getUserObject(req, res);
    oUserObj.getDevice().then((response) => res.send(response));
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

  app.post("/setConfig", (req, res) => {
    const oUserObj = getUserObject(req, res);
    const oData = req.body;

    if (oData.ip) {
      oUserObj.setIp(oData.ip);
    }

    if (oData.port) {
      oUserObj.setIp(oData.port);
    }

    res.send("POST");
  });
  app.post("/startDevice", (req, res) => {
    const oUserObj = getUserObject(req, res);
    res.send("POST");
  });
  app.post("/stopDevice", (req, res) => {
    const oUserObj = getUserObject(req, res);
    res.send("POST");
  });
  app.post("/checkConnection", (req, res) => {
    const oUserObj = getUserObject(req, res);
    res.send("POST");
  });

  // set port, listen for requests
  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
