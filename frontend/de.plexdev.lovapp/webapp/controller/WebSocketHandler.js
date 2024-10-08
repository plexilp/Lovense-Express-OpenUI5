sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
	"use strict";

	return ManagedObject.extend("de.plexdev.lovapp.controller.WebSocketHandler", {
		init() {},
		start(sPath, oBaseController) {
			try {
				//ws://localhost:8080
				const socket = new WebSocket(sPath);
				// on Open Connection
				socket.addEventListener("open", (event) => {
					socket.send(`Connection test from: ${window.location.origin}`);
				});

				// on receive new message
				socket.addEventListener("message", (oEvent) => {
					this.onMessageReceive(oEvent);
					console.log("Message from server ", oEvent.data);
				});

				this.oBaseController = oBaseController;
				this.oSocket = socket;
				this.oEventBus = oBaseController.getOwnerComponent().getEventBus();
			} catch (error) {
				console.log(error);
				sap.m.MessageToast.show("Websocket not connected!");
			}
		},

		onMessageReceive(oEvent) {
			try {
				const oData = JSON.parse(oEvent.data);
				this.oFunctionManager(oData);
			} catch (error) {
				console.error(error);
			}
		},

		oFunctionManager(oData) {
			switch (oData.function) {
				case "refreshConnection":
					this.oEventBus.publish(
						"App",
						"refreshConnection",
						oData,
						// this.oBaseController
					);
					break;
				case "connectionStatus":
					this.oEventBus.publish(
						"App",
						"setConnectionStatus",
						oData.oData,
						// this.oBaseController
					);
					break;
				case "addHistory":
					this.oEventBus.publish(
						"App",
						"addHistory",
						oData.oData,
						// this.oBaseController
					);
					break;
				default:
					break;
			}
		},
	});
});
