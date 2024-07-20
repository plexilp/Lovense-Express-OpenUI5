sap.ui.define(
	[
		"./BaseController",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
	],
	function (BaseController, MessageBox, JSONModel, MessageToast) {
		"use strict";

		return BaseController.extend("de.plexdev.lovapp.controller.Random", {
			onInit() {},
			onBeforeRendering() {
				this.getView().setModel(new JSONModel({}), "viewModel");
				this.setInitDataViewModel();
			},
			setInitDataViewModel() {
				const oData = {
					strengthMin: 1,
					strengthMax: 5,
					intervalMin: 100,
					intervalMax: 1000,
					timeMin: 0,
					timeMax: 0,
					patternLength: 40,
					possibleDifference: 10,
					selectedDevice: [""],
					selectedAction: [""],
					newForEachToy: true,
					newForEachFeature: false,
				};
				const oModel = this.getView().getModel("viewModel");
				oModel.setData(oData);
			},
			onRangeSliderLiveChange(oEvent, vProperty1, vProperty2) {
				const oSlider = oEvent.getSource();
				const value1 = oSlider.getValue();
				const value2 = oSlider.getValue2();
				const oModel = this.getModel("viewModel");
				oModel.setProperty(vProperty1, value1);
				oModel.setProperty(vProperty2, value2);
			},

			async onPressSendRandom() {
				const oModel = this.getModel("viewModel");
				const aSelectedToys = this.byId("idSelectDevice").getSelectedKeys();
				const aFeatures = this.byId("idSelectAction").getSelectedKeys();
				const oData = {
					toy: aSelectedToys,
					type: "random",
					minStrength: oModel.getProperty("/strengthMin"),
					maxStrength: oModel.getProperty("/strengthMax"),
					minInterval: oModel.getProperty("/intervalMin"),
					maxInterval: oModel.getProperty("/intervalMax"),
					features: aFeatures,
					minTimeSec: oModel.getProperty("/timeMin"),
					maxTimeSec: oModel.getProperty("/timeMax"),
					patternLength: oModel.getProperty("/patternLength"),
					possibleDifference: oModel.getProperty("/possibleDifference"),
					newForEachToy: oModel.getProperty("/newForEachToy"),
					newForEachFeature: oModel.getProperty("/newForEachFeature"),
				};

				const oResult = await this.sendPost(
					"/sendSpecialPattern?userId=" + this.getUserId(),
					oData
				);
				try {
					const oResultJson = oResult;
					const oRequest = oResultJson.request;
					console.log(oRequest);
					MessageToast.show(`Pattern: ${oRequest[0]["strength"]}`);
				} catch (error) {
					console.error(error);
				}
			},
		});
	}
);
