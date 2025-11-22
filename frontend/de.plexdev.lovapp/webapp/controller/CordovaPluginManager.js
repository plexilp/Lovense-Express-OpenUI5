/**
 * Cordova Plugin Manager
 * Wrapper für Cordova-Plugins mit Fallback für Web-Umgebung
 */
sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Prüft, ob die App in Cordova läuft
		 * @returns {boolean}
		 */
		isCordova: function () {
			return typeof window.cordova !== "undefined";
		},

		/**
		 * Wartet auf das Cordova deviceready Event
		 * @returns {Promise}
		 */
		deviceReady: function () {
			return new Promise((resolve) => {
				if (this.isCordova()) {
					document.addEventListener("deviceready", resolve, false);
				} else {
					// In Web-Umgebung sofort resolven
					resolve();
				}
			});
		},

		/**
		 * Vibration-Funktion mit Cordova-Plugin oder Web API
		 * @param {number|Array} pattern - Vibrationsmuster in ms
		 */
		vibrate: function (pattern) {
			if (this.isCordova() && window.navigator.vibrate) {
				window.navigator.vibrate(pattern);
			} else if (window.navigator.vibrate) {
				// Fallback auf Web Vibration API
				window.navigator.vibrate(pattern);
			} else {
				console.warn("Vibration API not available");
			}
		},

		/**
		 * Stoppt die Vibration
		 */
		cancelVibration: function () {
			if (window.navigator.vibrate) {
				window.navigator.vibrate(0);
			}
		},

		/**
		 * Startet die Beschleunigungssensor-Überwachung (Shake-Detection)
		 * @param {Function} callback - Wird bei Shake-Erkennung aufgerufen
		 * @param {number} threshold - Schwellenwert für Shake-Erkennung (Standard: 15)
		 * @returns {Object} watchID zum Stoppen
		 */
		watchAcceleration: function (callback, threshold = 15) {
			if (this.isCordova() && window.navigator.accelerometer) {
				let lastX, lastY, lastZ;
				let lastTime = 0;

				const watchID = window.navigator.accelerometer.watchAcceleration(
					(acceleration) => {
						const currentTime = new Date().getTime();

						if (currentTime - lastTime > 100) {
							const deltaX = Math.abs(lastX - acceleration.x);
							const deltaY = Math.abs(lastY - acceleration.y);
							const deltaZ = Math.abs(lastZ - acceleration.z);

							if (
								(deltaX > threshold && deltaY > threshold) ||
								(deltaX > threshold && deltaZ > threshold) ||
								(deltaY > threshold && deltaZ > threshold)
							) {
								callback({
									x: acceleration.x,
									y: acceleration.y,
									z: acceleration.z,
									deltaX: deltaX,
									deltaY: deltaY,
									deltaZ: deltaZ,
								});
							}

							lastX = acceleration.x;
							lastY = acceleration.y;
							lastZ = acceleration.z;
							lastTime = currentTime;
						}
					},
					(error) => {
						console.error("Accelerometer error:", error);
					},
					{ frequency: 100 },
				);

				return {
					id: watchID,
					clear: () => window.navigator.accelerometer.clearWatch(watchID),
				};
			} else {
				// Fallback auf Web DeviceMotion API
				return this._watchDeviceMotion(callback, threshold);
			}
		},

		/**
		 * Fallback für Beschleunigungssensor über Web API
		 * @private
		 */
		_watchDeviceMotion: function (callback, threshold) {
			let lastX = 0,
				lastY = 0,
				lastZ = 0;
			let lastTime = 0;

			const handler = (event) => {
				const acc = event.accelerationIncludingGravity;
				const currentTime = new Date().getTime();

				if (currentTime - lastTime > 100) {
					const deltaX = Math.abs(lastX - acc.x);
					const deltaY = Math.abs(lastY - acc.y);
					const deltaZ = Math.abs(lastZ - acc.z);

					if (
						(deltaX > threshold && deltaY > threshold) ||
						(deltaX > threshold && deltaZ > threshold) ||
						(deltaY > threshold && deltaZ > threshold)
					) {
						callback({
							x: acc.x,
							y: acc.y,
							z: acc.z,
							deltaX: deltaX,
							deltaY: deltaY,
							deltaZ: deltaZ,
						});
					}

					lastX = acc.x;
					lastY = acc.y;
					lastZ = acc.z;
					lastTime = currentTime;
				}
			};

			window.addEventListener("devicemotion", handler, false);

			return {
				handler: handler,
				clear: () => window.removeEventListener("devicemotion", handler),
			};
		},

		/**
		 * Spielt einen Sound ab
		 * @param {string} src - Pfad zur Audio-Datei
		 * @returns {Object} Media-Objekt
		 */
		playSound: function (src) {
			if (this.isCordova() && window.Media) {
				const media = new window.Media(
					src,
					() => console.log("Sound playback success"),
					(err) => console.error("Sound playback error:", err),
				);
				media.play();
				return media;
			} else {
				// Fallback auf HTML5 Audio
				const audio = new Audio(src);
				audio.play().catch((err) => console.error("Audio play error:", err));
				return audio;
			}
		},

		/**
		 * Gibt Geräte-Informationen zurück
		 * @returns {Object}
		 */
		getDeviceInfo: function () {
			if (this.isCordova() && window.device) {
				return {
					platform: window.device.platform,
					version: window.device.version,
					uuid: window.device.uuid,
					model: window.device.model,
					manufacturer: window.device.manufacturer,
					isCordova: true,
				};
			} else {
				return {
					platform: "Web",
					version: navigator.userAgent,
					isCordova: false,
				};
			}
		},

		/**
		 * Prüft die Netzwerkverbindung
		 * @returns {Object}
		 */
		getNetworkInfo: function () {
			if (this.isCordova() && window.navigator.connection) {
				return {
					type: window.navigator.connection.type,
					isOnline: window.navigator.connection.type !== "none",
				};
			} else {
				return {
					type: navigator.onLine ? "wifi" : "none",
					isOnline: navigator.onLine,
				};
			}
		},

		/**
		 * Setzt die Statusbar-Farbe (nur iOS/Android)
		 * @param {string} color - Hex-Farbcode
		 */
		setStatusBarColor: function (color) {
			if (this.isCordova() && window.StatusBar) {
				window.StatusBar.backgroundColorByHexString(color);
			}
		},

		/**
		 * Versteckt den Splashscreen
		 */
		hideSplashScreen: function () {
			if (this.isCordova() && window.navigator.splashscreen) {
				window.navigator.splashscreen.hide();
			}
		},
	};
});
