const db = require("../models");
const https = require("https");

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

  getUrl(ip, port) {
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
          resolve(data);
        })
        .catch((error) => {
          // Reject the promise if an error occurs
          reject(error);
        });
    });
  }

  async getDevice(req, res) {
    const sUrl = this.getUrl(this.ip, this.port);
    const oBody = this.getPostData({ command: "GetToys" });
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
}

module.exports = RequestController;
