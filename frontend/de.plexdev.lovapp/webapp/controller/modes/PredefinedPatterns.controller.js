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
					this.getView().setModel(
						new JSONModel({ showInputs: true, sliderEnabled: false }),
						"viewModel",
					);
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
						oData,
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

				onButtonShowInputsPress() {
					const oModel = this.getModel("viewModel");
					if (oModel.getProperty("/showInputs")) {
						oModel.setProperty("/showInputs", false);
						oModel.setProperty("/sliderEnabled", true);
					} else {
						oModel.setProperty("/showInputs", true);
						oModel.setProperty("/sliderEnabled", false);
					}
				},

				onRangeSliderChange(oEvent, vProperty1, vProperty2) {
					const oModel = this.getModel("backend");
					const oSlider = oEvent.getSource();
					const value1 = oSlider.getValue();
					const value2 = oSlider.getValue2();

					if (value1 > value2) {
						oSlider.setValue2(value1);
						oSlider.setValue(value2);
						oModel.setProperty(vProperty1, value2);
						oModel.setProperty(vProperty2, value1);
					}
				},
			},
		);
	},
);
