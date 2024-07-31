sap.ui.define(
	[
		"de/plexdev/lovapp/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
	],
	function (BaseController, JSONModel, MessageToast) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.others.Shake", {
			onInit() {},

			onBeforeRendering() {
				this.getView().setModel(new JSONModel({ test: [] }), "viewModel");
			},

			async onAfterRendering() {
				// const oViewModel = this.getModel("viewModel");

				// await this.getMotion();
				// addEventListener("devicemotion", (event) => {
				// 	console.log(event);
				// });

				// window.ondevicemotion = (event) => {
				// 	console.log(event);
				// 	// const aNewArr = oViewModel.getProperty("/test");
				// 	// const oEntry = {
				// 	// 	value: event,
				// 	// };
				// 	// aNewArr.push(oEntry);
				// 	// oViewModel.setProperty("/test", aNewArr);
				// };

				this.requestMotionPermission();
			},

			handleMotionEvent(event) {
				const oViewModel = this.getModel("viewModel");
				const x = event.accelerationIncludingGravity.x;
				const y = event.accelerationIncludingGravity.y;
				const z = event.accelerationIncludingGravity.z;

				oViewModel.setProperty("/test", `${x}, ${y}, ${z}`);
			},

			requestMotionPermission() {
				if (typeof DeviceMotionEvent.requestPermission === "function") {
					// iOS 13+
					DeviceMotionEvent.requestPermission()
						.then((permissionState) => {
							if (permissionState === "granted") {
								window.addEventListener(
									"devicemotion",
									this.handleMotionEvent.bind(this),
									true
								);
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
					window.addEventListener(
						"devicemotion",
						this.handleMotionEvent.bind(this),
						true
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
	}
);
