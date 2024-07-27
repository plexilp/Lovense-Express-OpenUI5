const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");
const WebSocket = require("ws");
const WebSocketHandler = require("./app/controllers/websocket");
const configFile = require("../config.json");

// Den Eintrag ändern, wenn der Server über HTTPS erreichbar sein soll
const bHttps = false;

const dbConfiguration = {
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

  const {
    ApiFunctions,
    Express_GET,
    Express_POST,
  } = require("./app/controllers/apiHandler");
  const ApiGet = new Express_GET();
  const ApiPost = new Express_POST();

  // Redirect to app page
  if (configFile["baseConfig"]["redirect-to-app-on-no-route"]) {
    app.get("/", (req, res) => {
      res.redirect("/app");
    });
  }

  // simple route
  app.get("/api/", (req, res) => {
    res.status(200).json({ code: "Route /help for more informations" });
  });
  app.get("/api/test", ApiGet.getTest.bind(ApiGet));
  app.get("/api/help", ApiGet.getHelp.bind(ApiGet));
  app.get("/api/getUserId", ApiGet.getUserId.bind(ApiGet));
  app.get("/api/getConfig", ApiGet.getConfig.bind(ApiGet));
  app.get("/api/getConnection", ApiGet.getConnection.bind(ApiGet));
  app.get("/api/getDevices", ApiGet.getDevices.bind(ApiGet));
  app.get("/api/getHistory", ApiGet.getHistory.bind(ApiGet));

  app.get("/api/F4Actions", ApiGet.F4Actions.bind(ApiGet));
  app.get("/api/F4Rules", ApiGet.F4Rules.bind(ApiGet));
  app.get("/api/F4Modes", ApiGet.F4Modes.bind(ApiGet));

  // Posts

  app.post("/api/setConfig", ApiPost.setConfig.bind(ApiPost));
  app.post("/api/sendFunction", ApiPost.sendFunction.bind(ApiPost));
  app.post("/api/sendPattern", ApiPost.sendPattern.bind(ApiPost));
  app.post("/api/sendSpecialPattern", ApiPost.sendSpecialPattern.bind(ApiPost));
  app.post("/api/stopDevice", ApiPost.stopDevice.bind(ApiPost));

  // app.post("/api/checkConnection", (req, res) => {
  //   const oUserObj = getUserObject(req, res);
  //   if (oUserObj === false) {
  //     return;
  //   }
  //   res.send("POST");
  // });

  let server;
  if (configFile["baseConfig"]["use-https"]) {
    const sslOptions = {
      key: fs.readFileSync(path.resolve(__dirname, "private.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "certificate.crt")),
    };
    server = https.createServer(sslOptions, app);
    console.log("Server configured for HTTPS");
  } else {
    server = http.createServer(app);
    console.log("Server configured for HTTP");
  }

  const wss = new WebSocket.Server({ server });
  const oWebSocketHandler = new WebSocketHandler(wss, new ApiFunctions());
  oWebSocketHandler.setupWebSocketHandler();

  // set port, listen for requests
  const PORT = process.env.PORT || 8081;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
