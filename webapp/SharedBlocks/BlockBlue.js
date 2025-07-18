sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlue = BlockBase.extend("sfpositioncheck.SharedBlocks.BlockBlue", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "sfpositioncheck.SharedBlocks.BlockBlue",
						type: "XML"
					},
					Expanded: {
						viewName: "sfpositioncheck.SharedBlocks.BlockBlue",
						type: "XML"
					}
				}
			}
		});

		return BlockBlue;

	});
