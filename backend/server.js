const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const constants = require("./app/constants/constants");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

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
  app.get("/api/test", (req, res) => {
    const data = { message: "Data retrieved successfully" };
    res.send(data);
    // res.set({
    //   "Content-Type": "text/plain",
    //   "Content-Length": "123",
    //   ETag: "12345",
    // });
    // res.type(".html");
    // res.json({});

    // res.status(200).json({ code: "Route /help for more informations" });
  });
  app.get("/api/help", (req, res) => {
    getStruct = (sName, aQuery, aBody) => {
      const obj = {
        path: sName,
        querys: aQuery,
        bodyParameter: aBody,
      };

      return obj;
    };

    const aPaths = [
      getStruct("/getUserId", [], []),
      getStruct("/getConfig", ["userId"], []),
      getStruct("/getConnection", ["userId"], []),
      getStruct("/getDevices", ["userId"], []),
      getStruct("/F4Actions", ["action"], []),
      getStruct("/F4Rules", [], []),
      getStruct("/F4Modes", [], []),
      getStruct("/setConfig", ["userId"], ["ip", "port"]),
      getStruct(
        "/sendFunction",
        ["userId"],
        [
          "toy",
          "action",
          "timeSec",
          "loopRunningSec",
          "loopPauseSec",
          "stopPrevious",
        ]
      ),
      getStruct(
        "/sendPattern",
        ["userId"],
        ["toy", "strengths", "interval", "features", "timeSec"]
      ),
      getStruct(
        "/sendSpecialPattern",
        ["userId"],
        [
          "toy",
          "type",
          "minStrength",
          "maxStrength",
          "minInterval",
          "maxInterval",
          "features",
          "minTimeSec",
          "maxTimeSec",
          "patternLength",
          "possibleDifference",
        ]
      ),
      getStruct("/stopDevice", ["userId"], ["toy"]),
    ];
    res.status(200).json({ response: aPaths });
  });

  app.get("/api/getUserId", (req, res) => {
    //it also register the object(s) for that userid
    const sUserId = "1";
    _getSetUser(sUserId);
    res.json({ userId: sUserId });
  });
  app.get("/api/getConfig", (req, res) => {
    const oUserObj = getUserObject(req, res);
    if (oUserObj === false) {
      return;
    }
    const oConfig = oUserObj.getConfig();
    res.send(oConfig);
  });
  app.get("/api/getConnection", (req, res) => {
    const oUserObj = getUserObject(req, res);
    if (oUserObj === false) {
      return;
    }
    oUserObj.getDevice().then((response) => res.send(response));
  });
  app.get("/api/getDevices", (req, res) => {
    const oUserObj = getUserObject(req, res);
    if (oUserObj === false) {
      return;
    }
    oUserObj.getDevice().then((response) => {
      try {
        const oToys = response.data.toys;
        let aToys = Object.keys(oToys).map(function (key) {
          return oToys[key];
        });
        aToys.push({ id: "", name: "Alle" });
        res.send(aToys);
      } catch (error) {
        res.send(error);
      }
    });
  });

  // ValueHelps
  // app.get("/api/listActions", (req, res) => {
  //   res.send(constants.ACTIONS);
  // });
  app.get("/api/F4Actions", (req, res) => {
    let oDetails = constants.ARR_ACTIONS;
    if (req.query.action) {
      oDetails = constants.ARR_ACTIONS.filter(
        (x) => req.query.action === x.key
      );
    }
    res.send(oDetails);
  });
  app.get("/api/F4Rules", (req, res) => {
    res.send(constants.ARR_RULES);
  });
  app.get("/api/F4Modes", (req, res) => {
    res.send(constants.ARR_MODES);
  });

  // Posts

  app.post("/api/setConfig", (req, res) => {
    const oUserObj = getUserObject(req, res);
    if (oUserObj === false) {
      return;
    }
    const oData = req.body;

    if (oData.ip) {
      oUserObj.setIp(oData.ip);
    }

    if (oData.port) {
      oUserObj.setPort(oData.port);
    }

    res.send(_getResponseFormat(req.body, "Data setted"));
  });

  app.post("/api/sendFunction", (req, res) => {
    const oUserObj = getUserObject(req, res);
    if (oUserObj === false) {
      return;
    }

    const oPostData = oUserObj.getPostData(req.body);
    const sUrl = oUserObj.getUrl();

    oPostData.command = constants.COMMANDS.Function;

    oUserObj
      .postData(sUrl, oPostData)
      .then((response) => res.send(_getResponseFormat(oPostData, response)));
    // res.send("POST");
  });

  app.post("/api/sendPattern", (req, res) => {
    const oUserObj = getUserObject(req, res);
    const oBody = req.body;
    if (oUserObj === false) {
      return;
    }
    try {
      const oPostData = oUserObj.getPostData(oBody);
      const sUrl = oUserObj.getUrl();

      oPostData.command = constants.COMMANDS.Pattern;
      oPostData.apiVer = 2;
      oPostData.rule = oUserObj.getRule(oBody.features, oBody.interval);
      oPostData.strength = oBody.strengths.slice(0, 50).join(";") || "0";

      oUserObj
        .postData(sUrl, oPostData)
        .then((response) => res.send(_getResponseFormat(oPostData, response)));
    } catch (error) {
      res.status(400).json({ error });
    }
    // res.send("POST");
  });

  app.post("/api/sendSpecialPattern", (req, res) => {
    const oUserObj = getUserObject(req, res);
    const oBody = req.body;
    if (oUserObj === false) {
      return;
    }
    try {
      const sUrl = oUserObj.getUrl();
      const aPostData = oUserObj.getSpecialPatternObj(oBody);
      const aResponse = [];

      aPostData.forEach(async (oPostData) => {
        oPostData.command = constants.COMMANDS.Pattern;
        oPostData.apiVer = 2;

        const oResponse = await oUserObj.postData(sUrl, oPostData);
        aResponse.push(oResponse);
      });

      res.send(_getResponseFormat(aPostData, aResponse));
    } catch (error) {
      res.status(400).send({ error: error });
    }
    // res.send("POST");
  });

  app.post("/api/stopDevice", (req, res) => {
    const oUserObj = getUserObject(req, res);
    if (oUserObj === false) {
      return;
    }

    const oPostData = oUserObj.getPostData(req.body);
    const sUrl = oUserObj.getUrl();

    oPostData.action = constants.ACTIONS.Stop;
    oPostData.timeSec = 0;
    oPostData.command = constants.COMMANDS.Function;

    oUserObj
      .postData(sUrl, oPostData)
      .then((response) => res.send(_getResponseFormat(oPostData, response)))
      .catch((error) => errorHandler(req, res, error));
  });

  // app.post("/api/checkConnection", (req, res) => {
  //   const oUserObj = getUserObject(req, res);
  //   if (oUserObj === false) {
  //     return;
  //   }
  //   res.send("POST");
  // });

  const server = http.createServer(app);

  const wss = new WebSocket.Server({ server });

  // WebSocket-Verbindungs-Handler
  wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.send(`Server received: `);

    // Nachricht vom Client empfangen
    ws.on("message", (message) => {
      console.log(`Received message: ${message}`);
      // Nachricht zurück an den Client senden
      ws.send(`Server received: ${message}`);
    });

    // Client-Verbindung geschlossen
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  // set port, listen for requests
  const PORT = process.env.PORT || 8081;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
