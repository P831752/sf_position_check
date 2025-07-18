sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var SSC = BlockBase.extend("sfpositioncheck.SharedBlocks.SSC", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "sfpositioncheck.SharedBlocks.SSC",
						type: "XML"
					},
					Expanded: {
						viewName: "sfpositioncheck.SharedBlocks.SSC",
						type: "XML"
					}
				}
			}
		});

		return SSC;

	});
