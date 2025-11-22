#!/usr/bin/env node

/**
 * Cordova Hook: after_prepare
 * Kopiert die gebaute UI5-App ins www-Verzeichnis nach dem Prepare
 */

const fs = require("fs-extra");
const path = require("path");

module.exports = function (context) {
	console.log("Running after_prepare hook...");

	const projectRoot = context.opts.projectRoot;
	const distPath = path.join(projectRoot, "dist");
	const wwwPath = path.join(projectRoot, "www");

	if (fs.existsSync(distPath)) {
		console.log(`Copying UI5 build from ${distPath} to ${wwwPath}`);
		fs.copySync(distPath, wwwPath, { overwrite: true });
		console.log("Copy completed successfully!");
	} else {
		console.warn(`Warning: dist directory not found at ${distPath}`);
		console.warn('Please run "npm run build:prod" first');
	}
};
