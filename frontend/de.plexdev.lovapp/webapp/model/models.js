sap.ui.define(
	["sap/ui/model/json/JSONModel", "sap/ui/model/BindingMode", "sap/ui/Device"],
	function (JSONModel, BindingMode, Device) {
		"use strict";

		return {
			createDeviceModel: function () {
				const oModel = new JSONModel(Device);
				oModel.setDefaultBindingMode(BindingMode.OneWay);
				return oModel;
			},

			getInitAppModel() {
				const oData = {
					selectedKey: "main",
					navigation: [
						{
							title: "Main",
							icon: "sap-icon://home",
							key: "main",
						},
						{
							title: "Modes",
							icon: "sap-icon://employee",
							expanded: true,
							items: [
								{
									title: "Random",
									key: "mode-random",
								},
								{
									title: "Sound",
									key: "mode-sound",
								},
							],
						},
						// {
						// 	title: "Root Item",
						// 	icon: "sap-icon://card",
						// 	expanded: false,
						// 	items: [
						// 		{
						// 			title: "Child Item",
						// 		},
						// 		{
						// 			title: "Child Item",
						// 		},
						// 		{
						// 			title: "Child Item",
						// 		},
						// 		{
						// 			title: "Child Item",
						// 		},
						// 		{
						// 			title: "Child Item",
						// 		},
						// 		{
						// 			title: "Child Item",
						// 		},
						// 		{
						// 			title: "Child Item",
						// 		},
						// 	],
						// },
						// {
						// 	title: "Root Item",
						// 	icon: "sap-icon://action",
						// 	expanded: false,
						// 	items: [
						// 		{
						// 			title: "Child Item 1",
						// 		},
						// 		{
						// 			title: "Child Item 2",
						// 		},
						// 		{
						// 			title: "Child Item 3",
						// 		},
						// 	],
						// },
					],
					fixedNavigation: [
						{
							title: "Settings",
							icon: "sap-icon://settings",
							key: "settings",
						},
						// {
						// 	title: "Fixed Item 2",
						// 	icon: "sap-icon://building",
						// },
						// {
						// 	title: "Fixed Item 3",
						// 	icon: "sap-icon://card",
						// },
					],
				};

				return oData;
			},
		};
	}
);
