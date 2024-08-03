sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"./model/models",
		"sap/ui/model/json/JSONModel",
	],
	function (UIComponent, Device, models, JSONModel) {
		"use strict";

		return UIComponent.extend("de.plexdev.lovapp.Component", {
			metadata: {
				manifest: "json",
			},
			init: function () {
				// call the base component's init function
				UIComponent.prototype.init.call(this); // create the views based on the url/hash

				// create the device model
				const oDeviceModel = models.createDeviceModel();
				this.setModel(oDeviceModel, "device");

				// create the views based on the url/hash
				this.getRouter().initialize();

				Device.orientation.attachHandler(function () {
					oDeviceModel.setData(Device);
				});

				Device.resize.attachHandler(function () {
					oDeviceModel.setData(Device);
				});

				// const oModel = new JSONModel();
				// const sConfigPath = sap.ui.require.toUrl("./config.json");

				// // Laden der Konfigurationsdatei
				// oModel.loadData(sConfigPath);

				// this.getView().setModel(oModel, "config");
			},
			/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
			 * design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @returns {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
			 */
			getContentDensityClass: function () {
				if (this.contentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (
						document.body.classList.contains("sapUiSizeCozy") ||
						document.body.classList.contains("sapUiSizeCompact")
					) {
						this.contentDensityClass = "";
					} else if (!Device.support.touch) {
						// apply "compact" mode if touch is not supported
						this.contentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
						this.contentDensityClass = "sapUiSizeCozy";
					}
				}
				return this.contentDensityClass;
			},
		});
	}
);
