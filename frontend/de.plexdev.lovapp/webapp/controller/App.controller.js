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
			},
			onMenuButtonPress(oEvent) {
				const appBar = oEvent.getSource().getParent();

				appBar.setSideExpanded(!appBar.getSideExpanded());
			},

			onItemSelect: function (oEvent) {
				const item = oEvent.getParameter("item");
				this.byId("pageContainer").to(this.getView().createId(item.getKey()));
			},
		});
	}
);
