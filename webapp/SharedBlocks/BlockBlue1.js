sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlue = BlockBase.extend("sfpositioncheck.SharedBlocks.BlockBlue1", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "sfpositioncheck.SharedBlocks.BlockBlue1",
						type: "XML"
					},
					Expanded: {
						viewName: "sfpositioncheck.SharedBlocks.BlockBlue1",
						type: "XML"
					}
				}
			}
		});

		return BlockBlue;

	});
