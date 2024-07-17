sap.ui.define(
	["./BaseController", "sap/m/MessageBox", "sap/ui/model/json/JSONModel"],
	function (BaseController, MessageBox, JSONModel) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.Main", {
			onInit() {},

			onBeforeRendering() {
				this.getView().setModel(
					new JSONModel({ selectedActions: ["Vibrate"] }),
					"viewModel"
				);
			},

			onAfterRendering() {},
			sayHello: function () {
				MessageBox.show("Hello World!");
			},

			async onPressStop() {
				const oResult = await this.sendPost("/stopDevice?userId=1", {});
				console.log(oResult);
			},

			async onPressTest() {
				const oResult = await this.sendGet("/test");
				// const oData = { command: "GetToys" };
				// const oResult = await this.sendPost("/command", oData).then((x) =>
				// 	console.log(x)
				// );

				console.log(oResult);
			},

			setSelection(oEvent) {
				oEvent.getSource().setSelectedIndex(0);
			},

			async onSliderLiveChange(oEvent) {
				const vValue = oEvent.getSource().getValue();
				const aTypes = this.byId("idSelectAction").getSelectedKeys();
				const sId = this.byId("idSelectDevice").getSelectedKey();
				const aActions = [];
				aTypes.forEach((type) => {
					aActions.push(`${type}:${vValue}`);
				});
				const oData = {
					toy: sId,
					action: aActions.join(","),

					timeSec: 0,
					loopRunningSec: 0,
					loopPauseSec: 0,
				};
				const oResult = await this.sendPost("/sendFunction?userId=1", oData);
			},

			onDevicesSelectChange(oEvent) {},
		});
	}
);
