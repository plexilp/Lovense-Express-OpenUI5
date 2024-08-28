sap.ui.define(function () {
	"use strict";

	return {
		formatValue(value) {
			return value && value.toUpperCase();
		},

		getVisualProcentBar(percentage) {
			const symbols = ["▎", "▍", "▌ ", "▋", "▊", "▉"];
			const barLength = 5;
			const totalBlocks = barLength * symbols.length;

			const filledBlocks = Math.floor((percentage / 100) * totalBlocks);
			const fullSymbols = Math.floor(filledBlocks / symbols.length);
			const partialSymbolIndex = filledBlocks % symbols.length;

			let bar = "▉".repeat(fullSymbols);
			if (fullSymbols < barLength) {
				bar += symbols[partialSymbolIndex];
				bar += "--".repeat(barLength - fullSymbols - 1);
			} else {
				bar += "  ".repeat(barLength - fullSymbols);
			}

			const display = `[${bar}] ${percentage}%`;
			return display;
		},
	};
});
