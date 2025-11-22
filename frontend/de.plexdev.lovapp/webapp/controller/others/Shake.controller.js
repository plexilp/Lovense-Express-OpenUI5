sap.ui.define(
	[
		"de/plexdev/lovapp/controller/BaseController",
		"de/plexdev/lovapp/controller/CordovaPluginManager",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
	],
	function (BaseController, CordovaPluginManager, JSONModel, MessageToast) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.others.Shake", {
			_shakeWatcher: null,

			onInit() {},

			onBeforeRendering() {
				this.getView().setModel(
					new JSONModel({
						test: [],
						isShaking: false,
						deviceInfo: CordovaPluginManager.getDeviceInfo(),
					}),
					"viewModel",
				);
			},

			async onAfterRendering() {
				// Warte auf Cordova deviceready
				await CordovaPluginManager.deviceReady();

				// Verstecke Splashscreen falls noch sichtbar
				CordovaPluginManager.hideSplashScreen();

				// Starte Shake-Detection
				this.requestMotionPermission();
			},

			onExit() {
				// Cleanup: Stoppe Shake-Überwachung beim Verlassen
				if (this._shakeWatcher) {
					this._shakeWatcher.clear();
					this._shakeWatcher = null;
				}
			},

			handleMotionEvent(event) {
				const oViewModel = this.getModel("viewModel");
				const x = event.accelerationIncludingGravity.x;
				const y = event.accelerationIncludingGravity.y;
				const z = event.accelerationIncludingGravity.z;

				oViewModel.setProperty("/test", `${x}, ${y}, ${z}`);
			},

			requestMotionPermission() {
				const oViewModel = this.getModel("viewModel");

				// Wenn Cordova verfügbar ist, nutze den CordovaPluginManager
				if (CordovaPluginManager.isCordova()) {
					this._shakeWatcher = CordovaPluginManager.watchAcceleration(
						(acceleration) => {
							console.log("Shake detected!", acceleration);
							oViewModel.setProperty("/isShaking", true);
							oViewModel.setProperty(
								"/test",
								`Shake! X:${acceleration.x.toFixed(2)}, Y:${acceleration.y.toFixed(2)}, Z:${acceleration.z.toFixed(2)}`,
							);

							// Vibriere bei Shake-Erkennung
							CordovaPluginManager.vibrate([100, 50, 100]);

							// Sende Shake-Event ans Backend (falls gewünscht)
							this.onShakeDetected(acceleration);

							// Reset isShaking nach kurzer Zeit
							setTimeout(() => {
								oViewModel.setProperty("/isShaking", false);
							}, 500);
						},
						15,
					); // Threshold für Shake-Erkennung

					MessageToast.show("Shake-Detection mit Cordova aktiviert");
				} else {
					// Fallback auf Web API (wie bisher)
					if (typeof DeviceMotionEvent.requestPermission === "function") {
						// iOS 13+
						DeviceMotionEvent.requestPermission()
							.then((permissionState) => {
								if (permissionState === "granted") {
									this._startWebShakeDetection();
								} else {
									alert("Permission not granted for DeviceMotion");
								}
							})
							.catch((error) => {
								console.error(error.message);
								MessageToast.show(error.message);
							});
					} else {
						// Handle regular non iOS 13+ devices
						this._startWebShakeDetection();
					}
				}
			},

			_startWebShakeDetection() {
				window.addEventListener(
					"devicemotion",
					this.handleMotionEvent.bind(this),
					true,
				);
				MessageToast.show("Shake-Detection mit Web API aktiviert");
			},

			onShakeDetected(acceleration) {
				// Hier kannst du das Shake-Event ans Backend senden
				// Beispiel: WebSocket-Nachricht
				const ws = this.getWebSocket();
				if (ws && ws.readyState === WebSocket.OPEN) {
					ws.send(
						JSON.stringify({
							type: "shake",
							data: {
								x: acceleration.x,
								y: acceleration.y,
								z: acceleration.z,
								deltaX: acceleration.deltaX,
								deltaY: acceleration.deltaY,
								deltaZ: acceleration.deltaZ,
								timestamp: new Date().toISOString(),
							},
						}),
					);
				}
			},

			// async getMotion() {
			// 	if (
			// !window.DeviceMotionEvent ||
			// 		!window.DeviceMotionEvent.requestPermission
			// 	) {
			// 		return alert(
			// 			"Your current device does not have access to the DeviceMotion event"
			// 		);
			// 	}

			// 	const permission = await window.DeviceMotionEvent.requestPermission();
			// 	if (permission !== "granted") {
			// 		return alert(
			// 			"You must grant access to the device's sensor for this demo"
			// 		);
			// 	}
			// },

			// _addEvents() {
			// 	window.addEventListener("devicemotion", function (e) {
			// 		let requestBtn = document.querySelector("#get-motion");
			// 		if (requestBtn) {
			// 			requestBtn.remove();
			// 		}

			// 		document.getElementById("acceleration-x").innerHTML =
			// 			e.acceleration.x.toFixed(2) + "m/s²";
			// 		document.getElementById("acceleration-y").innerHTML =
			// 			e.acceleration.y.toFixed(2) + "m/s²";
			// 		document.getElementById("acceleration-z").innerHTML =
			// 			e.acceleration.z.toFixed(2) + "m/s²";

			// 		document.getElementById("acceleration-gravity-x").innerHTML =
			// 			e.accelerationIncludingGravity.x.toFixed(2) + "m/s²";
			// 		document.getElementById("acceleration-gravity-y").innerHTML =
			// 			e.accelerationIncludingGravity.y.toFixed(2) + "m/s²";
			// 		document.getElementById("acceleration-gravity-z").innerHTML =
			// 			e.accelerationIncludingGravity.z.toFixed(2) + "m/s²";

			// 		document.getElementById("rotation-alpha").innerHTML =
			// 			e.rotationRate.alpha.toFixed(2) + "°/s";
			// 		document.getElementById("rotation-beta").innerHTML =
			// 			e.rotationRate.beta.toFixed(2) + "°/s";
			// 		document.getElementById("rotation-gamma").innerHTML =
			// 			e.rotationRate.gamma.toFixed(2) + "°/s";
			// 	});
			// },
		});
	},
);
