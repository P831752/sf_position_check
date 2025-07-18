sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent"
], (Controller, JSONModel, UIComponent) => {
    "use strict";

    return Controller.extend("sfpositioncheck.controller.DownloadView", {
        onInit() {
			this.oRouter = UIComponent.getRouterFor(this)
            var oModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/supplier.json"))
			this.getView().setModel(oModel)
			this.getView().bindElement("/EmployeeEducationDetails/0")
        },
		onNavBack(){
			this.oRouter.navTo("View1")
		},
        onPressDownload(){
            var win = window.open("PrintWindow", "");
				var print_Url = $.sap.getModulePath("sfpositioncheck", "/Templates/");
				var printCssUrl = print_Url + "Print.view.html";

				//Read the HTML content Dynamically 
				var hContent = '<html><head><link rel="stylesheet" href=' + printCssUrl +
					' type="text/css" /></head><body class="sapUiSizeCompact displayCSS" >';

				var bodyContent = "";

				bodyContent = $(".outerGrid").html();
				var closeContent = "</body></html>";
				var htmlpage = hContent + bodyContent + closeContent;

				win.document.write(htmlpage);
				var cssLinks = "";
				$.each(document.styleSheets, function(index, oStyleSheet) {
					if (oStyleSheet.href) {
						var link = document.createElement("link");
						link.type = oStyleSheet.type;
						link.rel = "stylesheet";
						link.href = oStyleSheet.href;
						win.document.head.appendChild(link);
					}
				});
				setTimeout(function() {
					win.print();
					win.stop();
				}, 1000);
        }
    });
});