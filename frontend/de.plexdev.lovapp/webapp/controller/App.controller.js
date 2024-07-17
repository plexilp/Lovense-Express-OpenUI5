sap.ui.define(
	["./BaseController", "de/plexdev/lovapp/model/models"],
	function (BaseController, models) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.App", {
			onInit: function () {
				// apply content density mode to root view
				this.getView().addStyleClass(
					this.getOwnerComponent().getContentDensityClass()
				);

				this.getModel("appModel").setData(models.getInitAppModel());
				this.getModel("runtimeModel").setProperty("/userId", "1");
			},
			/**
			 * @override
			 */
			onBeforeRendering() {
				//First Request for initial loading
				this.setConnectionStatus();
				//And that runs every x Seconds
				//Geht momentan nicht, weil multithreading und JS keine Freund sind. #Follow4Follo
				// this.intervalIdConnectionStatus = setInterval(
				// 	this.setConnectionStatus.bind(this),
				// 	10000
				// );
			},
			async setConnectionStatus() {
				const oModel = this.getModel("runtimeModel");
				const oResponse = await this.sendGet(
					`/getConnection?userId=${this.getUserId()}`
				);

				if (oResponse.code === 200) {
					// IF erst, wenn die Funktion alle x Sekunden aufgerufen wird
					// if (oModel.getProperty("/connected") !== "Success") {
					this.loadValueHelps();
					// }
					oModel.setProperty("/connected", "Success");
				} else {
					oModel.setProperty("/connected", "Negative");
				}
			},

			onMenuButtonPress(oEvent) {
				const appBar = oEvent.getSource().getParent();

				appBar.setSideExpanded(!appBar.getSideExpanded());
			},

			onItemSelect: function (oEvent) {
				const item = oEvent.getParameter("item");
				this.byId("pageContainer").to(this.getView().createId(item.getKey()));
			},

			async onOverflowToolbarButtonStopPress() {
				const oResult = await this.sendPost("/stopDevice?userId=1", {});
				console.log(oResult);
			},

			async onOverflowToolbarButtonConnectPress() {
				await this.setConnectionStatus();
			},

			async loadValueHelps() {
				const oModel = this.getModel("backend");
				await this.getModelProperty(oModel, "/F4Modes");
				await this.getModelProperty(oModel, "/F4Rules");
				await this.getModelProperty(oModel, "/F4Actions");
				await this.getModelProperty(oModel, "/getUserId");
				await this.getModelProperty(oModel, "/getDevices?userId=1", true);
			},
		});
	}
);
