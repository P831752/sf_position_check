sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/format/DateFormat"
], (Controller, JSONModel, exportLibrary, Spreadsheet, DateFormat) => {
    "use strict";

    var EdmType = exportLibrary.EdmType;

    return Controller.extend("sfpositioncheck.controller.position_check", {
        onInit() {

            var complete_url = window.location.href;
            var pieces = complete_url.split("/");
            console.log("complete_url:" +complete_url);
            console.log("pieces:" +pieces[5]+"-"+pieces[6]);

            var oLoggedUserData = this.getLoggedUserData(pieces[6]);

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Routeposition_check",{
				userid : pieces[6]
			});


            var oBusyDialog1 = new sap.m.BusyDialog({
                title: "Loading all filters data",
                text: "Please wait..."
            });
            oBusyDialog1.open();
            setTimeout(function(){
                oBusyDialog1.close();
            }, 20000);                     
        },

        _dateFormatter: function(oDate) {
			return DateFormat.getDateTimeInstance({pattern: "dd-MM-yyyy, hh:mm:ss"}).format(oDate);
		},

        //**************************** Read oData operation - Ajax call ****************************
        onSearch: function () {   

            var aFilters = [];
            aFilters.push(new sap.ui.model.Filter("vacant", sap.ui.model.FilterOperator.EQ, 'true')); 
            
            let isEmpty = "YES";

            let oCompany = this.getView().byId('idCompany').getSelectedItem();
            if (oCompany !== null) {
                oCompany = this.getView().byId('idCompany').getSelectedItem().getText();
                aFilters.push(new sap.ui.model.Filter("company", sap.ui.model.FilterOperator.EQ, oCompany)); 
                isEmpty = "NO";
            }

            let oStrategic = this.getView().byId('idStrategicBusiness').getSelectedItem();
            if (oStrategic !== null) { //WS04
                oStrategic = this.getView().byId('idStrategicBusiness').getSelectedItem().getText();
                //oParam = oParam + "division eq '" + oStrategic + "' and ";
                aFilters.push(new sap.ui.model.Filter("division", sap.ui.model.FilterOperator.EQ, oStrategic)); 
                isEmpty = "NO";
            }

            let oIC = this.getView().byId('idIC').getSelectedItem();
            if (oIC !== null) { //WS04
                oIC = this.getView().byId('idIC').getSelectedItem().getText();
                //oParam = oParam + "businessUnit eq '" + oIC  + "' and ";
                aFilters.push(new sap.ui.model.Filter("businessUnit", sap.ui.model.FilterOperator.EQ, oIC)); 
                isEmpty = "NO";
            }

            let oBusinessUnit = this.getView().byId('idBusinessUnit').getSelectedItem();
            if (oBusinessUnit !== null) {
                oBusinessUnit = this.getView().byId('idBusinessUnit').getSelectedItem().getText();
                //oParam = oParam + "department eq '" + oBusinessUnit  + "' and ";
                aFilters.push(new sap.ui.model.Filter("department", sap.ui.model.FilterOperator.EQ, oBusinessUnit));
                isEmpty = "NO";
            }

            let oDepartment = this.getView().byId('idDepartment').getSelectedItem();
            if (oDepartment !== null) {
                oDepartment = this.getView().byId('idDepartment').getSelectedItem().getText();
                //oParam = oParam + "cust_Departmentprojects eq '" + oDepartment  + "' and ";
                aFilters.push(new sap.ui.model.Filter("cust_Departmentprojects", sap.ui.model.FilterOperator.EQ, oDepartment));
                isEmpty = "NO";
            }

            let oEmpGroup = this.getView().byId('idEmpGroup').getSelectedItem();
            if (oEmpGroup !== null) {
                oEmpGroup = this.getView().byId('idEmpGroup').getSelectedItem().getText();
                //oParam = oParam + "cust_EmployeeGroup eq '" + oEmpGroup  + "' and ";
                aFilters.push(new sap.ui.model.Filter("cust_EmployeeGroup", sap.ui.model.FilterOperator.EQ, oEmpGroup));
                isEmpty = "NO";
            }

            let oBand = this.getView().byId('idBand').getSelectedItem();
            if (oBand !== null) {
                oBand = this.getView().byId('idBand').getSelectedItem().getText();
                //oParam = oParam + "cust_Band eq '" + oBand  + "' and ";
                aFilters.push(new sap.ui.model.Filter("cust_Band", sap.ui.model.FilterOperator.EQ, oBand));
                isEmpty = "NO";
            }

            let oPayGrade = this.getView().byId('idPayGrade').getSelectedItem();
            if (oPayGrade !== null) {
                oPayGrade = this.getView().byId('idPayGrade').getSelectedItem().getText();
                //oParam = oParam + "payGrade eq '" + oPayGrade  + "' and ";
                aFilters.push(new sap.ui.model.Filter("payGrade", sap.ui.model.FilterOperator.EQ, oPayGrade));
                isEmpty = "NO";
            }

            let oLocation = this.getView().byId('idLocation').getSelectedItem();
            if (oLocation !== null) {
                oLocation = this.getView().byId('idLocation').getSelectedItem().getText();
                //oParam = oParam + "location eq '" + oLocation  + "' and ";
                aFilters.push(new sap.ui.model.Filter("location", sap.ui.model.FilterOperator.EQ, oLocation));
                isEmpty = "NO";
            }

            let oCostCenter = this.getView().byId('idCostCenter').getSelectedItem();
            if (oCostCenter !== null) {
                oCostCenter = this.getView().byId('idCostCenter').getSelectedItem().getText();
                //oParam = oParam + "costCenter eq '" + oCostCenter + "'";
                aFilters.push(new sap.ui.model.Filter("costCenter", sap.ui.model.FilterOperator.EQ, oCostCenter));
                isEmpty = "NO";
            }

            var oBusyDialog = new sap.m.BusyDialog({
                title: "Loading Data",
                text: "Please wait..."
            });
            oBusyDialog.open();

            if (isEmpty === "YES") {
                
                var oModel = this.getOwnerComponent().getModel();//define empty model name in Manifest
                var oJSONModel = new JSONModel();

                var aAllData = [];
                var iSkip = 0;
                var iPageSize = 1000;
                var that = this
                
                function fetchData() {
                    oModel.read("/Position", {
                        urlParameters: {
                            "$top": iPageSize,
                            "$skip": iSkip
                        },
                        success: function (resp) {
                            aAllData = aAllData.concat(resp.results);
                            if (resp.results.length === iPageSize) {
                                iSkip += iPageSize;
                                fetchData(); // Fetch next page
                            } else {
                                oBusyDialog.close();
                                console.log(aAllData);
                                oJSONModel.setData(aAllData);
                                that.getView().setModel(oJSONModel, "PositionDataModel");
                            }
                        }.bind(this),
                        error: function (err) {
                            oBusyDialog.close();
                            console.error("Error fetching data", err);
                        }
                    });
                }

                fetchData();

            } else {

                var oModel = this.getOwnerComponent().getModel();//define empty model name in Manifest
                var oJSONModel = new JSONModel();

                var aAllData = [];
                var iSkip = 0;
                var iPageSize = 1000;
                var that = this
                
                function fetchFilterData() {
                    oModel.read("/Position", {
                        filters: aFilters,
                        urlParameters: {
                            "$top": iPageSize,
                            "$skip": iSkip
                        },
                        success: function (resp) {
                            aAllData = aAllData.concat(resp.results);
                            if (resp.results.length === iPageSize) {
                                iSkip += iPageSize;
                                fetchFilterData(); // Fetch next page
                            } else {
                                oBusyDialog.close();
                                console.log(aAllData);
                                oJSONModel.setData(aAllData);
                                that.getView().setModel(oJSONModel, "PositionDataModel");
                            }
                        }.bind(this),
                        error: function (err) {
                            oBusyDialog.close();
                            console.error("Error fetching data", err);
                        }
                    });
                }
                fetchFilterData();
            }
        },

        onExport: function() {
            var aCols, oRowBinding, oSettings, oSheet, oTable;

            if (!this._oTable) {
                this._oTable = this.byId('idPostionTable');
            }

            oTable = this._oTable;
            oRowBinding = oTable.getBinding('items');
            aCols = this.createColumnConfig();
            
            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                
                dataSource: oRowBinding,
                //dataSource: oData,
                fileName: 'Vacant_List.xlsx',
                worker: false // We need to disable worker because we are using a MockServer as OData Service
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function() {
                oSheet.destroy();
            });
        },


        createColumnConfig: function() {
            var aCols = [];

            aCols.push({
                label: 'Position Code',
                property: 'code',
                type: EdmType.String                    
            });
            
            aCols.push({
                label: 'Position Title',
                property: 'externalName_defaultValue',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'Last Modify Date',
                property: 'lastModifiedDateTime',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'Company',
                property: 'company',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'Strategic Business Group',
                property: 'division',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'IC',
                property: 'businessUnit',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'Business Unit',
                property: 'department',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'Department/Projects',
                property: 'cust_Departmentprojects',
                type: EdmType.String                    
            });
            aCols.push({
                label: 'Employee Group',
                property: 'cust_EmployeeGroup',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'Band',
                property: 'cust_Band',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'Pay Grade',
                property: 'payGrade',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'Location',
                property: 'location',
                type: EdmType.String                    
            });

            aCols.push({
                label: 'Cost Center',
                property: 'costCenter',
                type: EdmType.String                    
            });
            
            return aCols;
        },

        // ************** Read oData operation ****************************
/*        getLoggedUserData: function(userId) { 
            var mBaseurl = this.getOwnerComponent().getManifestObject().resolveUri("odata/v2/EmpJob");
            //var mBaseurl = this.getOwnerComponent().getManifestObject().resolveUri("odata/v2/EmpJob(seqNumber=1L,startDate=datetime'2023-08-10T00:00:00',userId='20340714')");
            //let oParam = "?$filter=";
            var posturl = mBaseurl + "?$filter=userId eq '"+userId+"'";
            console.log(posturl);
            //console.log(mBaseurl);
            var that = this;
            var oJSONModel = new JSONModel();
        
            $.ajax({
                url: posturl,
                type: "GET",
                async: true,
                dataType: "json",
                success: function (ndata) {
                    //oBusyDialog.close();
                    console.log(ndata.d.results);
                    oJSONModel.setData(ndata.d.results);
                    that.getView().setModel(oJSONModel, "LoggedUserModel");
                },
                error: function (err) {
                    console.log("Error while get user data");
                    console.log(err);
                    //oBusyDialog.close();
                }
            });            
        }*/

            getLoggedUserData: function (userId) {
                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();

                var aFilters = [];
                aFilters.push(new sap.ui.model.Filter("userId", sap.ui.model.FilterOperator.EQ, userId));
 
                oModel.read("/EmpJob", {
                    filters: aFilters,
                    success: function (resp) {
                        oJSONModel.setData(resp.results);
                        console.log(resp.results);
                        this.getView().setModel(oJSONModel, "LoggedUserModel");
                    }.bind(this),
                    error: function (err) {
                        oBusyDialog.close();
                        console.error("Error fetching data", err);
                    }
                });
            }
    });

    // ************** Read oData operation using AJAX with multilple filter values****************************
/*    
               let oParam = "?$filter=";
            let isEmpty = "YES";

            let oCompany = this.getView().byId('idCompany').getSelectedItem();
            if (oCompany !== null) {
                oCompany = this.getView().byId('idCompany').getSelectedItem().getText();
                oParam = oParam + "company eq '" + oCompany + "' and ";
                isEmpty = "NO";
            }

            let oStrategic = this.getView().byId('idStrategicBusiness').getSelectedItem();
            if (oStrategic !== null) { //WS04
                oStrategic = this.getView().byId('idStrategicBusiness').getSelectedItem().getText();
                oParam = oParam + "division eq '" + oStrategic + "' and ";
                isEmpty = "NO";
            }

            let oIC = this.getView().byId('idIC').getSelectedItem();
            if (oIC !== null) { //WS04
                oIC = this.getView().byId('idIC').getSelectedItem().getText();
                oParam = oParam + "businessUnit eq '" + oIC  + "' and ";
                isEmpty = "NO";
            }

            let oBusinessUnit = this.getView().byId('idBusinessUnit').getSelectedItem();
            if (oBusinessUnit !== null) {
                oBusinessUnit = this.getView().byId('idBusinessUnit').getSelectedItem().getText();
                oParam = oParam + "department eq '" + oBusinessUnit  + "' and ";
                isEmpty = "NO";
            }

            let oDepartment = this.getView().byId('idDepartment').getSelectedItem();
            if (oDepartment !== null) {
                oDepartment = this.getView().byId('idDepartment').getSelectedItem().getText();
                oParam = oParam + "cust_Departmentprojects eq '" + oDepartment  + "' and ";
                isEmpty = "NO";
            }

            let oEmpGroup = this.getView().byId('idEmpGroup').getSelectedItem();
            if (oEmpGroup !== null) {
                oEmpGroup = this.getView().byId('idEmpGroup').getSelectedItem().getText();
                oParam = oParam + "cust_EmployeeGroup eq '" + oEmpGroup  + "' and ";
                isEmpty = "NO";
            }

            let oBand = this.getView().byId('idBand').getSelectedItem();
            if (oBand !== null) {
                oBand = this.getView().byId('idBand').getSelectedItem().getText();
                oParam = oParam + "cust_Band eq '" + oBand  + "' and ";
                isEmpty = "NO";
            }

            let oPayGrade = this.getView().byId('idPayGrade').getSelectedItem();
            if (oPayGrade !== null) {
                oPayGrade = this.getView().byId('idPayGrade').getSelectedItem().getText();
                oParam = oParam + "payGrade eq '" + oPayGrade  + "' and ";
                isEmpty = "NO";
            }

            let oLocation = this.getView().byId('idLocation').getSelectedItem();
            if (oLocation !== null) {
                oLocation = this.getView().byId('idLocation').getSelectedItem().getText();
                oParam = oParam + "location eq '" + oLocation  + "' and ";
                isEmpty = "NO";
            }

            let oCostCenter = this.getView().byId('idCostCenter').getSelectedItem();
            if (oCostCenter !== null) {
                oCostCenter = this.getView().byId('idCostCenter').getSelectedItem().getText();
                oParam = oParam + "costCenter eq '" + oCostCenter + "'";
                isEmpty = "NO";
            }
    oParam = oParam.slice(0,-5);

    var mBaseurl = this.getOwnerComponent().getManifestObject().resolveUri("odata/v2/Position");
    //var posturl = mBaseurl + "?$filter=costCenter eq '89600'"
    var posturl = mBaseurl + oParam;
    console.log(posturl);
    var that = this;
    var oJSONModel = new JSONModel();

    $.ajax({
        url: posturl,
        type: "GET",
        async: true,
        dataType: "json",
        success: function (ndata) {
            oBusyDialog.close();
            console.log(ndata.d.value);
            oJSONModel.setData(ndata.d.results);
            that.getView().setModel(oJSONModel, "PositionDataModel");
        },
        error: function (err) {
            console.log("Error while adding data");
            console.log(err);
            oBusyDialog.close();
        }
    }); */

    // ************** Read oData operation ****************************
    /*        onSearch: function () {
                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading Data",
                    text: "Please wait..."
                });
                oBusyDialog.open();
    
                oModel.read("/Position", {
                    success: function (resp) {
                        oBusyDialog.close();
                        //oJSONModel.setData(resp.results);
                        //this.getView().setModel(oJSONModel, "SFCand");
                    }.bind(this),
                    error: function (err) {
                        oBusyDialog.close();
                        console.error("Error fetching data", err);
                    }
                });
            }
        });*/
});