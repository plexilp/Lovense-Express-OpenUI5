sap.ui.define(
	["./BaseController", "sap/m/MessageBox", "sap/ui/model/json/JSONModel"],
	function (BaseController, MessageBox, JSONModel) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.Settings", {
			/**
			 * @override
			 */
			onBeforeRendering: function () {
				const oModel = this.getModel("backend");
				this.getModelProperty(oModel, `/getConfig?userId=${this.getUserId()}`);
			},

			async onSaveButtonPress(oEvent) {
				// Ja, ich hasste mich selber für das Konstrukt
				const sPath = oEvent
					.getSource()
					.getParent()
					.getParent()
					.getParent()
					.getObjectBinding("backend")
					.getPath();
				const oModel = this.getModel("backend");
				const oData = oModel.getProperty(sPath);
				oData.ip = oData.ip.replaceAll("_", "").replaceAll(" ", "");
				oData.port = oData.port.replaceAll("_", "").replaceAll(" ", "");
				const oResult = await this.sendPost(
					"/setConfig?userId=" + this.getUserId(),
					oData
				);
				this.getModelProperty(
					oModel,
					`/getConfig?userId=${this.getUserId()}`,
					true
				);
			},
		});
	}
);
