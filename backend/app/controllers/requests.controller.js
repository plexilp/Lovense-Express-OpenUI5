const db = require("../models");
const https = require("https");

getUrl = (ip, port) => {
  url = `https://${ip}:${port}/command`;
  return url;
};

getPostData = ({
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
}) => {
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

  oReturn;
};

getRequest = (sUrl) => {
  // Use the fetch API to make the GET request
  fetch(sUrl)
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
};

postData = (url, data) => {
  // Return a new promise
  return new Promise((resolve, reject) => {
    // Use the fetch API to make the POST request

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    fetch(url, {
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
};

exports.getDevice = async (req, res) => {
  const sUrl = getUrl("192.168.178.71", "30010");
  const oBody = getPostData({ command: "GetToys" });
  const result = await postData(sUrl, oBody);
  return result;
};
