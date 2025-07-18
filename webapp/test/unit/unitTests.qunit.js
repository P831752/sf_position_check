/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"sf_position_check/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});