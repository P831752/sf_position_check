sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	var hscController = Controller.extend("sfpositioncheck.SharedBlocks.HSC", {
		onParentBlockModeChange: function (sMode) {
			// this.oParentBlock is available here
		}
	});

	return hscController;
});
