const db = require("../models");
const https = require("https");
const constants = require("../constants/constants");

class RequestController {
  constructor(userId, ip, port) {
    this.userId = userId;
    this.ip = ip;
    this.port = port;
  }

  setIp(sIp) {
    this.ip = sIp;
  }

  setPort(sPort) {
    this.port = sPort;
  }

  getConfig() {
    return { userId: this.userId, ip: this.ip, port: this.port };
  }

  getUrl(ip = this.ip, port = this.port) {
    const url = `https://${ip}:${port}/command`;
    return url;
  }

  getPostData({
    apiVer = 1,
    toy,
    stopPrevious,
    command,
    action,
    rule, //Version 1, Function Vibrate, Länge pro Stärke in ms  || f"V:1;F:v;S:{random.randint(100,1000)}#"
    strength,
    timeSec,
    loopRunningSec,
    loopPauseSec,
  }) {
    const oReturn = {
      apiVer: apiVer,
      toy,
      stopPrevious,
      command,
      action,
      rule, //Version 1, Function Vibrate, Länge pro Stärke in ms  || f"V:1;F:v;S:{random.randint(100,1000)}#"
      strength,
      timeSec,
      loopRunningSec,
      loopPauseSec,
    };

    return oReturn;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRule(aFeatures = [], iInterval = 1000) {
    const sFeatures = aFeatures.join(",");
    const sRule = `V:1;F:${sFeatures};S:${iInterval}#`;
    return sRule;
  }

  _getRandomPatternObj(oBody) {
    const oPostData = this.getPostData(oBody);
    try {
      const iInterval = this.getRandomInt(oBody.minInterval, oBody.maxInterval);
      const iTimeSec = this.getRandomInt(oBody.minTimeSec, oBody.maxTimeSec);

      let aStrenghts = [];
      for (let i = 0; i < oBody.patternLength; i++) {
        let previousStrength = i > 0 ? aStrenghts[i - 1] : null;
        let randomStrength = this.getRandomInt(
          oBody.minStrength,
          oBody.maxStrength
        );

        // Überprüfen, ob die Differenz zum vorherigen Wert größer als 5 ist
        while (
          previousStrength !== null &&
          Math.abs(randomStrength - previousStrength) > oBody.possibleDifference
        ) {
          randomStrength = this.getRandomInt(
            oBody.minStrength,
            oBody.maxStrength
          );
        }

        aStrenghts.push(randomStrength);
      }

      oPostData.rule = this.getRule(oBody.features, iInterval);
      oPostData.timeSec = iTimeSec;
      oPostData.strength = aStrenghts.slice(0, 50).join(";") || "0";
    } catch (error) {
      return error;
    }

    return oPostData;
  }

  getSpecialPatternObj(oBody) {
    let oReturnData = {};
    switch (oBody.type) {
      case "random":
        oReturnData = this._getRandomPatternObj(oBody);
        break;

      default:
        break;
    }
    return oReturnData;
  }

  async getDevice() {
    const sUrl = this.getUrl(this.ip, this.port);
    const oBody = this.getPostData({ command: constants.COMMANDS.GetToys });
    let result = {};
    try {
      result = await this.postData(sUrl, oBody);
      try {
        result.data.toys = JSON.parse(result.data.toys);
      } catch (error) {}
      console.log("Data received:", result);
    } catch (error) {
      console.error("Error calling postData:", error);
      result = { error };
      // Optional: zusätzliche Fehlerbehandlung, z.B. Logging oder spezifische Aktionen
    }
    return result;
  }

  async getRequest(sUrl) {
    // Use the fetch API to make the GET request
    const nodeFetch = (await import("node-fetch")).default;

    nodeFetch(sUrl)
      .then((response) => {
        // Check if the response status is OK (status code 200-299)
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        // Parse the response as JSON
        return response.json();
      })
      .then((data) => {
        // Handle the parsed data here
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  postData(url, data) {
    // Return a new promise
    return new Promise(async (resolve, reject) => {
      // Use the fetch API to make the POST request

      const nodeFetch = (await import("node-fetch")).default;
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      nodeFetch(url, {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        agent: agent,
        body: JSON.stringify(data), // Convert the data to a JSON string
      })
        .then((response) => {
          // Check if the response status is OK (status code 200-299)
          if (!response.ok) {
            reject(
              new Error("Network response was not ok " + response.statusText)
            );
          }
          // Parse the response as JSON
          return response.json();
        })
        .then((data) => {
          // Resolve the promise with the parsed data
          try {
            data.codeText = constants.RESPONSE_CODES[data.code];
          } catch (error) {}
          resolve(data);
        })
        .catch((error) => {
          // Reject the promise if an error occurs
          reject(error);
        });
    });
  }
}

module.exports = RequestController;
