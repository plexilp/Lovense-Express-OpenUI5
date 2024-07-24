sap.ui.define(
	["../BaseController", "sap/m/MessageBox", "sap/ui/model/json/JSONModel"],
	function (BaseController, MessageBox, JSONModel) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.modes.Sound", {
			onBeforeRendering() {
				this.getView().setModel(new JSONModel({}), "viewModel");
			},
		});
	}
);
