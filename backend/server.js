const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const constants = require("./app/constants/constants");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const WebSocketHandler = require("./app/controllers/websocket");

const config = {
  bRebuildDatabase: false,
};

start();

async function start() {
  const app = express();

  var corsOptions = {
    origin: "*",
  };

  app.use(cors(corsOptions));

  // parse requests of content-type - application/json
  app.use(bodyParser.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  // add App connection
  const appPath = path.join(
    __dirname,
    "..",
    "frontend",
    "de.plexdev.lovapp",
    "dist"
  );
  app.use("/app", express.static(appPath));

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
  const { Express_GET, Express_POST } = require("./app/controllers/express");
  const ExpressGet = new Express_GET();
  const ExpressPost = new Express_POST();

  getUserObject = (req, res) => {
    const sUserId = req.query.userId;
    if (!sUserId) {
      res
        .status(400)
        .json({ error: "userId is required: Example: /getConfig?userId=1" });
      return false;
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

  _getResponseFormat = (oReq, oRes) => {
    return { request: oReq, response: oRes };
  };

  errorHandler = (req, res, error) => {
    console.log(error);
    res.status(200).json("success");

    try {
      const result = {
        code: error.code,
        message: error.message,
      };
      res.status(parseInt(error.code) || 500).json({ error: result });
    } catch (error) {
      res.send(error);
    }
  };

  // Redirect to app page
  app.get("/", (req, res) => {
    res.redirect("/app");
  });

  // simple route
  app.get("/api/", (req, res) => {
    res.status(200).json({ code: "Route /help for more informations" });
  });
  app.get("/api/test", ExpressGet.getTest.bind(ExpressGet));
  app.get("/api/help", ExpressGet.getHelp.bind(ExpressGet));
  app.get("/api/getUserId", ExpressGet.getUserId.bind(ExpressGet));
  app.get("/api/getConfig", ExpressGet.getConfig.bind(ExpressGet));
  app.get("/api/getConnection", ExpressGet.getConnection.bind(ExpressGet));
  app.get("/api/getDevices", ExpressGet.getDevices.bind(ExpressGet));

  app.get("/api/F4Actions", ExpressGet.F4Actions.bind(ExpressGet));
  app.get("/api/F4Rules", ExpressGet.F4Rules.bind(ExpressGet));
  app.get("/api/F4Modes", ExpressGet.F4Modes.bind(ExpressGet));

  // Posts

  app.post("/api/setConfig", ExpressPost.setConfig.bind(ExpressGet));
  app.post("/api/sendFunction", ExpressPost.sendFunction.bind(ExpressGet));
  app.post("/api/sendPattern", ExpressPost.sendPattern.bind(ExpressGet));
  app.post(
    "/api/sendSpecialPattern",
    ExpressPost.sendSpecialPattern.bind(ExpressGet)
  );
  app.post("/api/stopDevice", ExpressPost.stopDevice.bind(ExpressGet));

  // app.post("/api/checkConnection", (req, res) => {
  //   const oUserObj = getUserObject(req, res);
  //   if (oUserObj === false) {
  //     return;
  //   }
  //   res.send("POST");
  // });

  const server = http.createServer(app);

  const wss = new WebSocket.Server({ server });
  const oWebSocketHandler = new WebSocketHandler(wss, this);
  oWebSocketHandler.setupWebSocketHandler();

  // set port, listen for requests
  const PORT = process.env.PORT || 8081;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
