sap.ui.define(
	["../BaseController", "sap/ui/model/json/JSONModel"],
	function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend(
			"de.plexdev.lovapp.controller.modes.PredefinedPatterns",
			{
				/**
				 * @override
				 */
				onInit: function () {},

				/**
				 * @override
				 */
				onBeforeRendering: function () {
					this.getView().setModel(new JSONModel({}), "viewModel");
				},

				async onStartPatternButtonPress(oEvent) {
					const oSelectedData = oEvent
						.getSource()
						.getBindingContext("backend")
						.getObject();

					// const oModel = this.getModel("viewModel");
					// const aSelectedToys = this.byId("idSelectDevice").getSelectedKeys();
					// const aFeatures = this.byId("idSelectAction").getSelectedKeys();
					const oData = {
						toy: [oSelectedData.settedToy],
						type: oSelectedData.key,
						minStrength: oSelectedData.settedMinStrength,
						maxStrength: oSelectedData.settedMaxStrength,
						minInterval: oSelectedData.settedInterval,
						maxInterval: oSelectedData.settedInterval,
						features: oSelectedData.settedFeatures,
						minTimeSec: oSelectedData.settedTime,
						maxTimeSec: oSelectedData.settedTime,
						patternLength: "",
						possibleDifference: oSelectedData.stepSize,
						newForEachToy: false,
						newForEachFeature: false,
					};

					const oResult = await this.sendPost(
						"/sendSpecialPattern?userId=" + this.getUserId(),
						oData
					);
					try {
						const oResultJson = oResult;
						const oRequest = oResultJson.request;
						oSelectedData.latestPattern = oRequest[0].strength;
						this.getModel("backend").refresh();
					} catch (error) {
						console.error(error);
					}
				},
			}
		);
	}
);
