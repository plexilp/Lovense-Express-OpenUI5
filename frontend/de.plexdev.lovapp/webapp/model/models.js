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
							title: "Home",
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
									title: "Custom Pattern",
									key: "mode-custom-pattern",
								},
								{
									title: "Sound",
									key: "mode-sound",
								},
								{
									title: "Predefined Patterns (WIP)",
									key: "mode-predef-patterns",
								},
							],
						},
						{
							title: "Others",
							icon: "sap-icon://e-learning",
							expanded: true,
							items: [
								{
									title: "Alarm Clock",
									key: "others-alarm",
								},
								{
									title: "Shake Phone",
									key: "others-shake",
								},
							],
						},
						{
							title: "Idle Game",
							icon: "sap-icon://e-learning",
							expanded: false,
							items: [
								{
									title: "Home",
									key: "game-idle-home",
								},
							],
						},
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
							title: "Save Options",
							icon: "sap-icon://save",
						},
						{
							title: "Settings",
							icon: "sap-icon://settings",
							key: "settings",
						},
						{
							title: "Help",
							icon: "sap-icon://sys-help",
							key: "help",
						},
						// {
						// 	title: "Fixed Item 3",
						// 	icon: "sap-icon://card",
						// },
					],
				};

				return oData;
			},
		};
	},
);
