sap.ui.define(
	[
		"sap/ui/base/ManagedObject",
		"de/plexdev/lovapp/controller/CordovaPluginManager",
	],
	function (ManagedObject, CordovaPluginManager) {
		"use strict";

		return ManagedObject.extend(
			"de.plexdev.lovapp.controller.WebSocketHandler",
			{
				init() {},

				/**
				 * Ermittelt die korrekte WebSocket-URL basierend auf Umgebung (Web/Cordova)
				 * @param {string} sPath - Original WebSocket-Pfad
				 * @returns {string} - Angepasste WebSocket-URL
				 */
				_getWebSocketUrl(sPath) {
					// Wenn Cordova-App läuft, nutze Backend-URL aus config
					if (CordovaPluginManager.isCordova()) {
						// Lade mobile config
						return fetch("./config-mobile.json")
							.then((response) => response.json())
							.then((config) => {
								const protocol = config.mobile["use-ssl"] ? "wss://" : "ws://";
								const host = config.mobile["backend-url"].replace(
									/^https?:\/\//,
									"",
								);
								const port = config.mobile["backend-port"];
								return `${protocol}${host}:${port}`;
							})
							.catch((err) => {
								console.warn(
									"Could not load mobile config, using default:",
									err,
								);
								// Fallback auf übergebenen Pfad
								return sPath;
							});
					} else {
						// Web-Umgebung: nutze relativen Pfad oder localhost
						return Promise.resolve(sPath);
					}
				},

				async start(sPath, oBaseController) {
					try {
						// Warte auf Cordova deviceready
						await CordovaPluginManager.deviceReady();

						// Hole korrekte WebSocket-URL
						const wsUrl = await this._getWebSocketUrl(sPath);

						console.log("Connecting to WebSocket:", wsUrl);

						//ws://localhost:8080
						const socket = new WebSocket(wsUrl);

						// on Open Connection
						socket.addEventListener("open", (event) => {
							const deviceInfo = CordovaPluginManager.getDeviceInfo();
							socket.send(
								JSON.stringify({
									type: "connection",
									message: `Connection from: ${window.location.origin}`,
									device: deviceInfo,
								}),
							);

							console.log("WebSocket connected successfully");
							sap.m.MessageToast.show("Verbunden mit Backend");
						});

						// on receive new message
						socket.addEventListener("message", (oEvent) => {
							this.onMessageReceive(oEvent);
							console.log("Message from server ", oEvent.data);
						});

						// on Error
						socket.addEventListener("error", (error) => {
							console.error("WebSocket error:", error);
							sap.m.MessageToast.show("WebSocket Verbindungsfehler");
						});

						// on Close
						socket.addEventListener("close", (event) => {
							console.log("WebSocket closed:", event.code, event.reason);
							sap.m.MessageToast.show("WebSocket Verbindung geschlossen");
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
			},
		);
	},
);
