const RequestController = require("./requests.controller");
const oReqCtrlInstances = {};
const constants = require("../constants/constants");

class ExpressFunctions {
  constructor() {}
  getUserObject = (req, res) => {
    const sUserId = req.query.userId;
    if (!sUserId) {
      res
        .status(400)
        .json({ error: "userId is required: Example: /getConfig?userId=1" });
      return false;
    }

    return this.getSetUser(sUserId);
  };

  getSetUser = (sUserId) => {
    if (!oReqCtrlInstances[sUserId]) {
      oReqCtrlInstances[sUserId] = new RequestController(
        sUserId,
        "192.168.178.71",
        "30010"
      );
    }
    return oReqCtrlInstances[sUserId];
  };

  getResponseFormat = (oReq, oRes) => {
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
}

module.exports.Express_GET = class Express_GET {
  oFuncs = new ExpressFunctions();
  constructor() {}
  getTest(req, res) {
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
  }
  getHelp(req, res) {
    const getStruct = (sName, aQuery, aBody) => {
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
  }
  getUserId(req, res) {
    //it also register the object(s) for that userid
    const sUserId = "1";
    this.oFuncs.getSetUser(sUserId);
    res.json({ userId: sUserId });
  }
  getConfig(req, res) {
    const oUserObj = this.oFuncs.getUserObject(req, res);
    if (oUserObj === false) {
      return;
    }
    const oConfig = oUserObj.getConfig();
    res.send(oConfig);
  }
  getConnection(req, res) {
    const oUserObj = this.oFuncs.getUserObject(req, res);
    if (oUserObj === false) {
      return;
    }
    oUserObj.getDevice().then((response) => res.send(response));
  }
  getDevices(req, res) {
    const oUserObj = this.oFuncs.getUserObject(req, res);
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
  }
  F4Actions(req, res) {
    let oDetails = constants.ARR_ACTIONS;
    if (req.query.action) {
      oDetails = constants.ARR_ACTIONS.filter(
        (x) => req.query.action === x.key
      );
    }
    res.send(oDetails);
  }
  F4Rules(req, res) {
    res.send(constants.ARR_RULES);
  }
  F4Modes(req, res) {
    res.send(constants.ARR_MODES);
  }
};

module.exports.Express_POST = class Express_POST {
  oFuncs = new ExpressFunctions();
  constructor() {}

  setConfig(req, res) {
    const oUserObj = this.oFuncs.getUserObject(req, res);
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

    res.send(this.oFuncs.getResponseFormat(req.body, "Data setted"));
  }
  sendFunction(req, res) {
    const oUserObj = this.oFuncs.getUserObject(req, res);
    if (oUserObj === false) {
      return;
    }

    const oPostData = oUserObj.getPostData(req.body);
    const sUrl = oUserObj.getUrl();

    oPostData.command = constants.COMMANDS.Function;

    oUserObj
      .postData(sUrl, oPostData)
      .then((response) =>
        res.send(this.oFuncs.getResponseFormat(oPostData, response))
      );
    // res.send("POST");
  }
  sendPattern(req, res) {
    const oUserObj = this.oFuncs.getUserObject(req, res);
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
        .then((response) =>
          res.send(this.oFuncs.getResponseFormat(oPostData, response))
        );
    } catch (error) {
      res.status(400).json({ error });
    }
    // res.send("POST");
  }
  sendSpecialPattern(req, res) {
    const oUserObj = this.oFuncs.getUserObject(req, res);
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

      res.send(this.oFuncs.getResponseFormat(aPostData, aResponse));
    } catch (error) {
      res.status(400).send({ error: error });
    }
    // res.send("POST");
  }
  stopDevice(req, res) {
    const oUserObj = this.oFuncs.getUserObject(req, res);
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
      .then((response) =>
        res.send(this.oFuncs.getResponseFormat(oPostData, response))
      )
      .catch((error) => errorHandler(req, res, error));
  }
};
