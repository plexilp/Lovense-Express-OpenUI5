sap.ui.define(
	[
		"./BaseController",
		"de/plexdev/lovapp/model/models",
		"de/plexdev/lovapp/controller/WebSocketHandler",
		"de/plexdev/lovapp/model/formatter",
	],
	function (BaseController, models, WebSocketHandler, formatter) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.App", {
			clFormatter: formatter,
			onInit: function () {
				// apply content density mode to root view
				this.getView().addStyleClass(
					this.getOwnerComponent().getContentDensityClass(),
				);
				this._setEventBus();

				this.getModel("appModel").setData(models.getInitAppModel());
				this.getModel("runtimeModel").setProperty("/userId", "1");
			},
			/**
			 * @override
			 */
			onBeforeRendering() {
				const hostname = window.location.hostname;
				const protocol = window.location.protocol;
				let sWebsocketProtocol = "ws";
				if (protocol === "https:") {
					sWebsocketProtocol = "wss";
				}
				new WebSocketHandler().start(
					`${sWebsocketProtocol}://${hostname}:8081`,
					this,
				);
				//First Request for initial loading
				this.loadValueHelps();
				this.refreshHistory();
				this.getSetConnectionStatus(false);
				//And that runs every x Seconds
				//Geht momentan nicht, weil multithreading und JS keine Freund sind. #Follow4Follo
				// this.intervalIdConnectionStatus = setInterval(
				// 	this.getSetConnectionStatus.bind(this),
				// 	10000
				// );
			},

			async _setEventBus() {
				await this.getEventBus().subscribe(
					"App",
					"setConnectionStatus",
					this.setConnectionStatus.bind(this),
				);
				await this.getEventBus().subscribe(
					"App",
					"refreshConnection",
					this.getSetConnectionStatus.bind(this),
				);
				await this.getEventBus().subscribe(
					"App",
					"addHistory",
					this.addHistory.bind(this),
				);
			},

			/**
			 *
			 * @param {boolean} [bLoadValueHelps] .
			 */
			async getSetConnectionStatus(bLoadValueHelps = true) {
				const oModel = this.getModel("runtimeModel");
				const oBackendModel = this.getModel("backend");
				const oResponse = await this.getModelProperty(
					oBackendModel,
					`/getConnection?userId=${this.getUserId()}`,
				);

				if (oResponse.code === 200) {
					// IF erst, wenn die Funktion alle x Sekunden aufgerufen wird
					// if (oModel.getProperty("/connected") !== "Success") {
					this.loadDevices();
					if (bLoadValueHelps) {
						this.loadValueHelps();
					}
					// }
					oModel.setProperty("/connected", "Success");
				} else {
					oModel.setProperty("/connected", "Negative");
				}
			},

			async setConnectionStatus(oCaller, oApp, oData) {
				const oModel = this.getModel("runtimeModel");
				if (oData.code === 200) {
					// IF erst, wenn die Funktion alle x Sekunden aufgerufen wird
					// if (oModel.getProperty("/connected") !== "Success") {
					const aDevices = this.convertObjectIntoArray(oData?.data.toys);
					this.setConnectionStatusSubTitle(aDevices);
					// }
					oModel.setProperty("/connected", "Success");
				} else {
					oModel.setProperty("/connected", "Negative");
				}
			},

			onMenuButtonPressed(oEvent) {
				const appBar = oEvent.getSource().getParent();

				appBar.setSideExpanded(!appBar.getSideExpanded());
			},

			onItemSelect: function (oEvent) {
				const item = oEvent.getParameter("item");
				// this.byId("pageContainer").to(this.getView().createId(item.getKey()));
				this.navTo(item.getKey());
			},

			async onOverflowToolbarButtonStopPress() {
				const oResult = await this.sendPost("/stopDevice?userId=1", {});
				console.log(oResult);
			},

			async onOverflowToolbarButtonConnectPress() {
				await this.getSetConnectionStatus();
			},

			/**
			 *
			 * @param {Array} [aDevices] .
			 */
			async loadDevices(aDevices = []) {
				const oModel = this.getModel("backend");
				if (!aDevices.length) {
					aDevices = await this.getModelProperty(
						oModel,
						"/getDevices?userId=1",
						true,
					);
				}

				this.setConnectionStatusSubTitle(aDevices);
			},

			setConnectionStatusSubTitle(aDevices) {
				const aSecTitleConnToys = [];
				if (aDevices.length) {
					aDevices.forEach((oDevice) => {
						if (oDevice.id) {
							const sName = oDevice.nickName || oDevice.name;
							const sBattery = oDevice.battery.toString();
							const strVisualBattery = this.clFormatter.getVisualProcentBar(
								parseInt(sBattery, 10),
							);
							aSecTitleConnToys.push(`${sName}: ${strVisualBattery}`);
						}
					});
				}

				const oRuntimeModel = this.getModel("runtimeModel");
				oRuntimeModel.setProperty(
					"/secTitleConnToys",
					aSecTitleConnToys.join(", "),
				);
			},

			async loadValueHelps() {
				const oModel = this.getModel("backend");
				await this.getModelProperty(oModel, "/F4Modes");
				await this.getModelProperty(oModel, "/F4Rules");
				await this.getModelProperty(oModel, "/F4Actions");
				await this.getModelProperty(oModel, "/getUserId");
				// await this.getModelProperty(oModel, "/getDevices?userId=1", true);
			},

			onOverflowToolbarButtonHistoryPress(oEvent) {
				const oPopover = this.getPopover("HistoryPopover");

				if (oPopover.isOpen()) {
					oPopover.close();
				} else {
					oPopover.openBy(oEvent.getSource());
				}
			},

			onCloseHistoryPopover() {
				this.getPopover("HistoryPopover").close();
			},

			addHistory(oCaller, oApp, oData) {
				const oModel = this.getModel("runtimeModel");
				const aHistory = oModel.getProperty("/history") || [];
				aHistory.unshift(oData);
				oModel.setProperty("/history", aHistory);
			},
		});
	},
);
