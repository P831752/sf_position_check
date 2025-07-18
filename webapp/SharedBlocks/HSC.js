sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var HSC = BlockBase.extend("sfpositioncheck.SharedBlocks.HSC", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "sfpositioncheck.SharedBlocks.HSC",
						type: "XML"
					},
					Expanded: {
						viewName: "sfpositioncheck.SharedBlocks.HSC",
						type: "XML"
					}
				}
			}
		});

		return HSC;

	});
