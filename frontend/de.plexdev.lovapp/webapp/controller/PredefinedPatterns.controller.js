sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
	function (Controller, JSONModel) {
		"use strict";

		return Controller.extend(
			"de.plexdev.lovapp.controller.PredefinedPatterns",
			{
				/**
				 * @override
				 */
				onInit: function () {},

				/**
				 * @override
				 */
				onBeforeRendering: function () {
					this.getView().setModel(
						new JSONModel({
							cards: [{ patternName: "Firework" }, { patternName: "Stairs" }],
						}),
						"viewModel"
					);
				},
			}
		);
	}
);
