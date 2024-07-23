sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
	"use strict";

	return ManagedObject.extend("de.plexdev.lovapp.controller.WebSocketHandler", {
		init() {},
		start(sPath, oBaseController) {
			//ws://localhost:8080
			const socket = new WebSocket(sPath);
			// on Open Connection
			socket.addEventListener("open", (event) => {
				socket.send("Hello Server!");
			});

			// on receive new message
			socket.addEventListener("message", (oEvent) => {
				this.onMessageReceive(oEvent);
				console.log("Message from server ", oEvent.data);
			});

			this.oBaseController = oBaseController;
			this.oSocket = socket;
			this.oEventBus = oBaseController.getOwnerComponent().getEventBus();
		},

		onMessageReceive(oEvent) {
			this.oEventBus.publish(
				"App",
				"setConnectionStatus",
				this.oBaseController
			);
		},
	});
});
