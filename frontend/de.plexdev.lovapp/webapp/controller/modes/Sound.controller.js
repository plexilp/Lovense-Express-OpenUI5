sap.ui.define(
	[
		"../BaseController",
		"de/plexdev/lovapp/controller/CordovaPluginManager",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
	],
	function (BaseController, CordovaPluginManager, MessageBox, JSONModel) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.modes.Sound", {
			_currentMedia: null,

			onBeforeRendering() {
				this.getView().setModel(
					new JSONModel({
						isPlaying: false,
						isCordova: CordovaPluginManager.isCordova(),
					}),
					"viewModel",
				);
			},

			async onAfterRendering() {
				// Warte auf Cordova deviceready
				await CordovaPluginManager.deviceReady();
			},

			onExit() {
				// Cleanup: Stoppe Sound beim Verlassen
				if (this._currentMedia) {
					if (this._currentMedia.stop) {
						this._currentMedia.stop();
					} else if (this._currentMedia.pause) {
						this._currentMedia.pause();
					}
					this._currentMedia = null;
				}
			},

			onPlaySound(oEvent) {
				const sSoundPath = oEvent.getSource().data("soundPath");
				if (sSoundPath) {
					this.playSound(sSoundPath);
				}
			},

			playSound(soundPath) {
				const oViewModel = this.getModel("viewModel");

				// Stoppe aktuellen Sound falls vorhanden
				if (this._currentMedia) {
					if (this._currentMedia.stop) {
						this._currentMedia.stop();
					} else if (this._currentMedia.pause) {
						this._currentMedia.pause();
					}
				}

				// Spiele neuen Sound mit CordovaPluginManager
				this._currentMedia = CordovaPluginManager.playSound(soundPath);
				oViewModel.setProperty("/isPlaying", true);

				// Vibriere kurz beim Start
				CordovaPluginManager.vibrate(50);

				// Reset isPlaying nach 2 Sekunden (oder Sound-Dauer)
				setTimeout(() => {
					oViewModel.setProperty("/isPlaying", false);
				}, 2000);
			},

			onStopSound() {
				if (this._currentMedia) {
					if (this._currentMedia.stop) {
						this._currentMedia.stop();
					} else if (this._currentMedia.pause) {
						this._currentMedia.pause();
					}
					this._currentMedia = null;
					this.getModel("viewModel").setProperty("/isPlaying", false);
				}
			},
		});
	},
);
