#!/usr/bin/env node

/**
 * Script zum automatischen Kopieren der UI5-Build-Dateien nach www/
 * Wird von Cordova-Hooks aufgerufen
 */

const fs = require("fs-extra");
const path = require("path");

const distPath = path.join(__dirname, "..", "dist");
const wwwPath = path.join(__dirname, "..", "www");

console.log("Copying UI5 build to www directory...");
console.log("Source:", distPath);
console.log("Target:", wwwPath);

if (fs.existsSync(distPath)) {
	// Erstelle www-Verzeichnis falls nicht vorhanden
	fs.ensureDirSync(wwwPath);

	// Kopiere alle Dateien
	fs.copySync(distPath, wwwPath, {
		overwrite: true,
		filter: (src) => {
			// Filtere bestimmte Dateien aus
			const filename = path.basename(src);
			return !filename.startsWith(".") && filename !== "node_modules";
		},
	});

	// Stelle sicher dass index-cordova.html als index.html kopiert wird
	const cordovaIndexSrc = path.join(distPath, "index-cordova.html");
	const cordovaIndexDest = path.join(wwwPath, "index.html");

	if (fs.existsSync(cordovaIndexSrc)) {
		fs.copySync(cordovaIndexSrc, cordovaIndexDest, { overwrite: true });
		console.log("Copied index-cordova.html as index.html");
	} else {
		console.warn(
			"Warning: index-cordova.html not found, using regular index.html",
		);
	}

	// Kopiere config-mobile.json
	const mobileConfigSrc = path.join(distPath, "config-mobile.json");
	const mobileConfigDest = path.join(wwwPath, "config-mobile.json");

	if (fs.existsSync(mobileConfigSrc)) {
		fs.copySync(mobileConfigSrc, mobileConfigDest, { overwrite: true });
		console.log("Copied config-mobile.json");
	}

	console.log("✓ Copy completed successfully!");
} else {
	console.error("Error: dist directory not found at", distPath);
	console.error('Please run "npm run build:prod" first');
	process.exit(1);
}
