sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	var CController = Controller.extend("sfpositioncheck.SharedBlocks.BlockBlue", {
		onParentBlockModeChange: function (sMode) {
			// this.oParentBlock is available here
		}
	});

	return CController;
});
