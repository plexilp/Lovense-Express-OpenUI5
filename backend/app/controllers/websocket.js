class WebSocketHandler {
  constructor(oWebSocketServer, oApiFunctions) {
    this.wss = oWebSocketServer;
    this.oApiFunctions = oApiFunctions;
    this.oUserObj = undefined;
    this.clients = [];
  }

  setupWebSocketHandler() {
    // WebSocket-Verbindungs-Handler
    this.wss.on("connection", (ws) => {
      this.oUserObj = this.oApiFunctions.getSetUser("1"); //TEMP If another Idea how to to
      console.log("Client connected");
      this.clients.push(ws);
      this.sendStatus(ws);
      this.addHistory("Client connected", "Client connected", "Low");
      // ws.send(`Server received: `);

      // Nachricht vom Client empfangen
      ws.on("message", (message) => {
        this.onReceiveMessage(ws, message);
      });

      // Client-Verbindung geschlossen
      ws.on("close", () => {
        this.onConnectionClosed(ws);
        this.clients = this.clients.filter((client) => client !== ws);
        clearInterval(oIntervalConnections);
      });

      const oIntervalConnections = setInterval(() => {
        this.sendStatus(ws);
        this.addHistory("Client connected", "Client connected", "Low");
      }, 20000);
    });
  }

  onReceiveMessage(ws, sMessage) {
    console.log(`Received message: ${sMessage}`);
    this.sendResponse(ws, "message", "Server Received " + sMessage);
  }

  onConnectionClosed(ws) {
    console.log("Client disconnected");
  }

  sendRefreshConnections(ws) {
    ws.send(this.sendResponse(ws, "refreshConnection"));
  }

  sendStatus(ws) {
    try {
      this.oUserObj.getDevice().then((response) => {
        this.sendResponse(ws, "connectionStatus", response);
      });
    } catch (error) {
      console.error(error);
    }
  }

  addHistory(sTitle, sDescription, sPriority) {
    this.clients.forEach((client) => {
      const oData = {
        title: sTitle,
        description: sDescription,
        priority: sPriority,
      };

      this.sendResponse(client, "addHistory", oData);
    });
  }

  /**
   *
   * @param {*} ws WebSocket object
   * @param {*} sFunction Functionname
   * @param {*} [oData] Data to send
   */
  sendResponse(ws, sFunction, oData = {}) {
    ws.send(JSON.stringify({ function: sFunction, oData: oData }));
  }
}

module.exports = WebSocketHandler;
