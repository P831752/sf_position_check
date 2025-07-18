sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	var sscController = Controller.extend("sfpositioncheck.SharedBlocks.SSC", {
		onParentBlockModeChange: function (sMode) {
			this.byId("tQuaSubtype1").setVisible(false);
		}
	});

	return sscController;
});
