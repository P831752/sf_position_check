/*global QUnit*/

sap.ui.define([
	"sf_position_check/controller/position_check.controller"
], function (Controller) {
	"use strict";

	QUnit.module("position_check Controller");

	QUnit.test("I should test the position_check controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
