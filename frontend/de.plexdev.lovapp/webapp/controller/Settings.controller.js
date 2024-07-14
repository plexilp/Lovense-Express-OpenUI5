sap.ui.define(
	["./BaseController", "sap/m/MessageBox", "sap/ui/model/json/JSONModel"],
	function (BaseController, MessageBox, JSONModel) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.Settings", {
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
		});
	}
);
