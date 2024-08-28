sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
		"sap/ui/core/routing/History",
		"de/plexdev/lovapp/controller/WebSocketHandler",
	],
	function (Controller, UIComponent, History, WebSocketHandler) {
		"use strict";

		return Controller.extend("de.plexdev.lovapp.controller.BaseController", {
			/**
			 * @override
			 */
			// onInit: function () {
			// 	// Controller.prototype.onInit.apply(this, arguments);
			// 	// new WebSocketHandler().start("ws://localhost:8081", this);
			// },

			/**
			 * @override
			 */
			// onBeforeRendering: function () {
			// 	// Controller.prototype.onBeforeRendering.apply(this, arguments);
			// 	// new WebSocketHandler().init("ws://localhost:8081", this);
			// },

			/**
			 * Convenience method for accessing the component of the controller's view.
			 * @returns {sap.ui.core.Component} The component of the controller's view
			 */
			getOwnerComponent: function () {
				return Controller.prototype.getOwnerComponent.call(this);
			},

			/**
			 * Convenience method to get the components' router instance.
			 * @returns {sap.m.routing.Router} The router instance
			 */
			getRouter: function () {
				return UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the i18n resource bundle of the component.
			 * @returns {sap.base.i18n.ResourceBundle} The i18n resource bundle of the component
			 */
			getResourceBundle: function () {
				const oModel = this.getOwnerComponent().getModel("i18n");
				return oModel.getResourceBundle();
			},

			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @param {string} [sName] The model name
			 * @returns {sap.ui.model.Model} The model instance
			 */
			getModel: function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @param {sap.ui.model.Model} oModel The model instance
			 * @param {string} [sName] The model name
			 * @returns {sap.ui.core.mvc.Controller} The current base controller instance
			 */
			setModel: function (oModel, sName) {
				this.getView().setModel(oModel, sName);
				return this;
			},

			/**
			 * Returns Eventbus
			 * @returns {object} oEventBus
			 */
			getEventBus() {
				return this.getOwnerComponent().getEventBus();
			},

			/**
			 * Convenience method for triggering the navigation to a specific target.
			 * @public
			 * @param {string} sName Target name
			 * @param {object} [oParameters] Navigation parameters
			 * @param {boolean} [bReplace] Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
			 */
			navTo: function (sName, oParameters, bReplace) {
				this.getRouter().navTo(sName, oParameters, undefined, bReplace);
			},

			/**
			 * Convenience event handler for navigating back.
			 * It there is a history entry we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the main route.
			 */
			onNavBack: function () {
				const sPreviousHash = History.getInstance().getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("main", {}, undefined, true);
				}
			},

			getBackendUrl() {
				return `/api`;
			},

			async sendPost(sPath, oData = {}) {
				const requestOptions = {
					method: "POST",
					headers: {
						"Content-Type": "application/json", // Der Content-Type muss auf application/json gesetzt werden
					},
					body: JSON.stringify(oData),
				};
				const sUrl = this.getBackendUrl() + sPath;
				try {
					const response = await fetch(sUrl, requestOptions);
					const result = await response.text();
					try {
						return JSON.parse(result);
					} catch (error) {
						return result;
					}
				} catch (error) {
					console.log("error", error);
					throw error;
				}
			},

			async sendGet(sPath) {
				const requestOptions = {
					method: "GET",
					// body: JSON.stringify(oData),
				};
				const sUrl = this.getBackendUrl() + sPath;
				try {
					const response = await fetch(sUrl, requestOptions);
					const result = await response.text();
					try {
						return JSON.parse(result);
					} catch (error) {
						return result;
					}
				} catch (error) {
					console.log("error", error);
					throw error;
				}
			},

			getUserId() {
				const oModel = this.getModel("runtimeModel");
				return oModel.getProperty("/userId");
			},

			/**
			 *
			 * @param {string} sPath
			 * @param {*} oModel
			 * @param {*} sAltPropName
			 */
			async bindPropertyToModel(
				sPath,
				oModel = this.getModel("backend"),
				sAltPropName = "",
			) {
				const oData = await this.sendGet(sPath);
				let sPropName = sPath;
				if (sAltPropName) {
					sPropName = sAltPropName;
				}
				oModel.setProperty(sPropName, oData);
			},

			async getModelProperty(oModel, sPropertyPath, bRefresh) {
				if (oModel.getProperty(sPropertyPath) && !bRefresh) {
					return oModel.getProperty(sPropertyPath);
				} else {
					const oData = await this.sendGet(sPropertyPath);
					oModel.setProperty(sPropertyPath, oData);
					return oModel.getProperty(sPropertyPath);
				}
			},

			/**
			 * .
			 * @param {string} sName  Name of the fragment
			 * @param {object} [oContext=this]  Default value
			 * @returns {object}  The fragment
			 */
			getPopover(sName, oContext = this) {
				if (!this["fragments"]) {
					this["fragments"] = {};
				}

				if (!this["fragments"][sName]) {
					this["fragments"][sName] = sap.ui.xmlfragment(
						"de.plexdev.lovapp.view.fragments.popover." + sName,
						oContext,
					);
					this.getView().addDependent(this["fragments"][sName]);
				}
				return this["fragments"][sName];
			},

			async refreshHistory() {
				const oModel = this.getModel("backend");
				await this.getModelProperty(oModel, "/getHistory");
			},
		});
	},
);
