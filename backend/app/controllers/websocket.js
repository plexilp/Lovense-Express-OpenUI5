class WebSocketHandler {
  constructor(oWebSocketServer, oApiFunctions) {
    this.wss = oWebSocketServer;
    this.oApiFunctions = oApiFunctions;
    this.oUserObj = undefined;
  }

  setupWebSocketHandler() {
    // WebSocket-Verbindungs-Handler
    this.wss.on("connection", (ws) => {
      this.oUserObj = this.oApiFunctions.getSetUser("1"); //TEMP If another Idea how to to
      console.log("Client connected");
      // ws.send(`Server received: `);

      // Nachricht vom Client empfangen
      ws.on("message", (message) => {
        this.onReceiveMessage(ws, message);
      });

      // Client-Verbindung geschlossen
      ws.on("close", () => {
        this.onConnectionClosed(ws);
        clearInterval(oIntervalConnections);
      });

      this.sendStatus(ws);
      const oIntervalConnections = setInterval(() => {
        this.sendRefreshConnections(ws);
      }, 20000);
    });
  }

  onReceiveMessage(ws, sMessage) {
    console.log(`Received message: ${sMessage}`);
    this.sendMessage(ws, `Server received: ${sMessage}`);
  }

  onConnectionClosed(ws) {
    console.log("Client disconnected");
  }

  sendRefreshConnections(ws) {
    ws.send(JSON.stringify({ function: "refreshConnection" }));
  }

  sendStatus(ws) {
    try {
      this.oUserObj.getDevice().then((response) => {
        ws.send(JSON.stringify(response));
      });
    } catch (error) {
      console.error(error);
    }
  }

  sendMessage(ws, message) {
    const oData = { message: message };
    ws.send(JSON.stringify(oData));
  }
}

module.exports = WebSocketHandler;
