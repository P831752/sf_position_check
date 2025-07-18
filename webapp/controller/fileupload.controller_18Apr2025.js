sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, JSONModel, exportLibrary, Spreadsheet, DateFormat, MessageToast, MessageBox) => {
    "use strict";
    var globalData;
    return Controller.extend("sfpositioncheck.controller.fileupload", {
        onInit() {
            this.getView().byId("idVacantTable").getColumns()[1].setVisible(false);
            this.getView().byId("idVacantTable").getColumns()[2].setVisible(false);
            this.getView().byId("idVacantTable").getColumns()[3].setVisible(false);  
            
            // var sText = 'ColumnHeaders',
            // oTable = this.byId("idVacantTable"),
            // aSticky = oTable.getSticky() || [];
            // aSticky.push(sText);
            // oTable.setSticky(aSticky);

        },

        /*	Method: clearTableData
        *	Description/Usage: Clear Table data
        **/
        clearTableData: function (oEvent) {
            this.getOwnerComponent().getModel("localModel").setData({
                items: []
            });
            sap.ui.getCore().getMessageManager().removeAllMessages();
            this.getView().getModel("message").setData([]);
        },

        handleUploadPress: function(oEvent) { 
            this._readExcelData(oEvent.getParameter("files") && oEvent.getParameter("files")[0]);
            //console.log("outputt-"+globalData);
        },

        _readExcelData: function(file) { 
            //var that = this;
            //that.clearTableData();
            var excelData = {};
            var excelRowValues = [];
            //var oResourceBundle = that.getView().getModel("i18n").getResourceBundle();
            var oFileUploader = this.getView().byId("fileUploader");
            //check file has been entered
            var sFile = oFileUploader.getValue();
            // to hanlde different template upload.
            //this.getView().byId("btnpost").setEnabled(false);
            if (!sFile) {
                //MessageToast.show(oResourceBundle.getText("fileMissingMsg"));
                MessageToast.show("No File");
                return;
            }
            //var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
            if (file && window.FileReader) {
                var reader = new FileReader();

                 //reader.onload = function (e) {
                    reader.onload = e => {
                    var data = e.target.result;
                    
                    var workbook = XLSX.read(data, {
                        type: 'binary',
                        cellDates: false
                    });
                    workbook.SheetNames.forEach(function (sheetName) {
                        excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    });
                    /*var sheet = workbook.Sheets[firstSheet];
                    for (var i = sheet['!ref'].split(':')[0]; i <= sheet['!ref'].split(':')[1]; i++) 
                    {
                        var cell = sheet[i];
                        if (cell && cell.t === 'n' && cell.w) cell.t = 's';
                    }
                    excelData = XLSX.utils.sheet_to_row_object_array(sheet);*/
                        if (excelData.values.length > 0) {
                        
                        var oPositionCodes="";
                        var i=0;
                        for (let obj of excelData.values) {
                             i++;
                            var oData = {
                                "Index":i,
                                "PostionCodes": oPositionCodes,
                                "UserID":obj["UserID"],
                                "Status":obj["Status"],
                                "PersonId_External":obj["PersonId_External"],
                                "regionOfBirth":obj["regionOfBirth"],
                                "placeOfBirth":obj["placeOfBirth"],
                                "PerPerson_MotherTounge":obj["PerPerson_MotherTounge"],                                
                                "countryOfBirth":obj["countryOfBirth"],
                                "dateOfBirth":obj["dateOfBirth"],
                                "StartDate":"08-01-2024",
                                "CandidateName": obj["Candidate Name (As per AADHAR)"],
                                "POP": obj["POP"],
                                "MobileNo": obj["Mobile No"],
                                "EmailID": obj["Email ID"],
                                "Gender": obj["Gender (M/F)"],
                                "DOJ": obj["DOJ"],
                                "CurrentLocation": obj["Current Location"],
                                "PEMCLocation": obj["Preferred PEMC Location"],
                                "PEMCDate": obj["Preferred PEMC Date"],
                                "EmploymentType": obj["Employment_Type"],
                                "EmploymentGroup": obj["Employment Group"],
                                "AppointmentType": obj["Appointment Type"],
                                "CovNonCov": obj["Cov / Non Cov"],
                                "CadreCode": obj["Cadre_Code"],
                                "Designation": obj["Designation / Title"],
                                "ContractEndDate": obj["Contract End Date (in case of FTC)"],
                                "CadreforFTC": obj["Eq. Cadre for FTC / Unclassified"],
                                "ISPSNo": obj["IS PS No"],
                                "NSPSNo": obj["NS PS No."],
                                "HRPSNo": obj["HR PS No"],
                                "TIMEADMINPSNo": obj["TIME ADMIN PS No"],
                                "DHPSNo": obj["DH PS No."],
                                "DHName": obj["DH Name"],
                                "OfficeSite": obj["Office / Site"],
                                "JobFunctionCode": obj["Job Function_Code"],
                                "JobSubFunctionCode": obj["Job Sub Function_Code"],
                                "LegalEntityCode": obj["Legal_Entity_Code"],
                                "ICCode": obj["IC Code"],
                                "DepartmentProject": obj["Department/Project Code"],
                                "CostCenter": obj["Cost Centre Code"],
                                "SBGCode": obj["SBG Code"],
                                "BUCode": obj["BU Code"],
                                "SegmentCode": obj["Segment Code"],
                                "ClusterCode": obj["Cluster Code"],
                                "BaseLocation": obj["Base Location Code"],
                                "Location": obj["Location"],
                                "PayGrade": obj["Pay Grade"],
                                "Department": obj["Department"],
                                "StraBusinessGroup": obj["Strategic Business Group"],
                                "Company": obj["Company"],
                                "JobCode": obj["Job Code"],
                                "Vacant": obj["Vacant"],
                                "Band": obj["Band"],
                                "EmployeeGroup": obj["Employee Group"],
                                "PositionTitle": obj["Position Title"],
                                "PositionName": obj["Position Name"],
                                "employeeClass": obj["Appointment Type"],
                                "employeeType": obj["Employee Type"],
                                "eventReason": obj["Event Reason"],
                                "managerId": obj["Immediate Supervisor"],
                                "customString5": obj["L&T Group of Companies"],
                                "trackId": obj["Office/Site"],
                            };
                            excelRowValues.push(oData);
                        }

                        var oJSONModel = new JSONModel();
                        oJSONModel.setData(excelRowValues);
                        this.getView().setModel(oJSONModel, "VacantPositionModel");
                    } else {
                        //MessageBox.error(oResourceBundle.getText("emptyFileMsg"));
                        MessageBox.error("Empty File Message");
                    }
                };
                reader.onerror = function (ex) {
                    console.log(ex);
                };
                reader.readAsBinaryString(file);
            } 
        },

        _import: function (file) {
            var that = this;
			var excelData = {};
			if (file && window.FileReader) {
                var reader = new FileReader();
				reader.onload = function (e) {
					var data = e.target.result;
					var workbook = XLSX.read(data, {
						type: 'binary'
					});
            }
          }
        },

        getSFData: function (aFilters) {

            var oModel = this.getOwnerComponent().getModel();

            var oPositionCodes = "";
            var aAllData = [];
            var iSkip = 0;
            var iPageSize = 1000;

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
                        //fetchFilterData(); //Fetch next page
                    } else {                                        
                        console.log("aAllData:" +aAllData);
                        //let oPositionCodes = 'Vacant positions exist for the parameters - Position Codes ';
                        if (aAllData.length > 0) {
                            for (let i = 0; i < aAllData.length; i++) {
                                oPositionCodes += aAllData[i].code+";";
                            }
                            console.log("PositionCodes:" +oPositionCodes); 
                            aAllData = [];
                        }                                        
                    }
                }.bind(this),
                error: function (err) {
                    console.error("Error fetching data", err);
                }
            }); 
            return oPositionCodes;
        },

//         callGetOData: function (aFilters) {
//             return new Promise((resolve, reject) => {
// // ***** Read operation START *******
//                 var oModel = this.getOwnerComponent().getModel();

//                 var oPositionCodes = "";
//                 var aAllData = [];
//                 var iSkip = 0;
//                 var iPageSize = 1000;

//                 oModel.read("/Position", {
//                     filters: aFilters,
//                     urlParameters: {
//                         "$top": iPageSize,
//                         "$skip": iSkip
//                     },
//                     success: function (data) {
//                         aAllData = aAllData.concat(data.results);
//                         if (data.results.length === iPageSize) {
//                             iSkip += iPageSize;
//                             //fetchFilterData(); //Fetch next page
//                         } else {                                        
//                             console.log("aAllData:" +aAllData);
//                             //let oPositionCodes = 'Vacant positions exist for the parameters - Position Codes ';
//                             if (aAllData.length > 0) {
//                                 for (let i = 0; i < aAllData.length; i++) {
//                                     oPositionCodes += aAllData[i].code+";";
//                                 }
//                                 resolve(oPositionCodes);
//                                 console.log("PositionCodes:" +oPositionCodes); 
//                                 //oPositionCodes = "";
//                                 //aAllData = [];
//                             }                                        
//                         }
//                     }.bind(this),
//                     error: function (err) {
//                         reject(err);
//                         console.error("Error fetching data", err);
//                     }
//                 }); 
//                 // ***** Read operation END *******
//             })
//         },
        
        callGetOData: function (aFilters) {
            return new Promise((resolve, reject) => {
                var oModel = this.getOwnerComponent().getModel();
                var oPositionCodes = "";
                //var oPositionCodes = [];
                var aAllData = [];
                var iSkip = 0;
                var iPageSize = 1000;

                var fetchData = () => {
                    oModel.read("/Position", {
                        filters: aFilters,
                        urlParameters: {
                            "$top": iPageSize,
                            "$skip": iSkip
                        },
                        success: function (data) {
                            aAllData = aAllData.concat(data.results);
                            if (data.results.length === iPageSize) {
                                iSkip += iPageSize;
                                fetchData(); // Fetch next page
                            } else {
                                if (aAllData.length > 0) {
                                    for (let i = 0; i < aAllData.length; i++) {
                                        oPositionCodes += aAllData[i].code + ";";
                                        //oPositionCodes.push({codes:aAllData[i].code});
                                    }
                                    console.log("oPositionCodes:"+oPositionCodes);
                                }
                                resolve(oPositionCodes);
                            }
                        }.bind(this),
                        error: function (err) {
                            console.error("Error fetching data", err);
                            reject(err);
                        }
                    });
                };

                fetchData();
            });
        },

        getVacantList: async function () {

            var items = this.getView().byId("idVacantTable").getItems();
            if (items.length == 0) {
                MessageToast.show("Table data should not be empty, please upload proper details");
                return;
            }
            var aFilters = [];
            var excelRowValues = [];
            var that = this;
            var oLocalDataModel = that.getView().getModel("VacantPositionModel");
        
            var oBusyDialog = new sap.m.BusyDialog({
                title: "Fetching vacancy list",
                text: "Please wait..."
            });

            oBusyDialog.open();

            for (var i = 0; i < oLocalDataModel.oData.length; i++) {

                let oBusinessUnit = oLocalDataModel.oData[i].ICCode;
                aFilters.push(new sap.ui.model.Filter("businessUnit", sap.ui.model.FilterOperator.EQ, oBusinessUnit));

                let oJobFunctionCode = oLocalDataModel.oData[i].JobFunctionCode;
                aFilters.push(new sap.ui.model.Filter("cust_jobfunction", sap.ui.model.FilterOperator.EQ, oJobFunctionCode));
        
                let oCostCenter = oLocalDataModel.oData[i].CostCenter;
                aFilters.push(new sap.ui.model.Filter("costCenter", sap.ui.model.FilterOperator.EQ, oCostCenter));
        
                try {
                    var oPositionCodes = await that.callGetOData(aFilters);
                //before:500001;500005;500007;500009;500024;80001180;80001181;500000;500010;80001423;        
                    if (oPositionCodes != ''){
                         oPositionCodes = oPositionCodes.replace(/\;$/, '');
                    }
                //after:'500001;500005;500007;500009;500024;80001180;80001181;500000;500010;80001423'
                    var oData = {
                        "Index":i,
                        "PostionCodes": oPositionCodes,
                        "PostionCodeLength": oPositionCodes.length,
                        "UserID":oLocalDataModel.oData[i].UserID,
                        "Status":oLocalDataModel.oData[i].Status,
                        "PersonId_External":oLocalDataModel.oData[i].PersonId_External,
                        "regionOfBirth":oLocalDataModel.oData[i].regionOfBirth,
                        "placeOfBirth":oLocalDataModel.oData[i].placeOfBirth,
                        "dateOfBirth":oLocalDataModel.oData[i].dateOfBirth,
                        "PerPerson_MotherTounge":oLocalDataModel.oData[i].PerPerson_MotherTounge,
                        "StartDate":oLocalDataModel.oData[i].StartDate,
                        "countryOfBirth":oLocalDataModel.oData[i].countryOfBirth,
                        "CandidateName": oLocalDataModel.oData[i].CandidateName,
                        "POP": oLocalDataModel.oData[i].MobileNo,
                        "MobileNo": oLocalDataModel.oData[i].POP,
                        "EmailID": oLocalDataModel.oData[i].POP,
                        "Gender": oLocalDataModel.oData[i].POP,
                        "DOJ": oLocalDataModel.oData[i].POP,
                        "CurrentLocation": oLocalDataModel.oData[i].POP,
                        "PEMCLocation": oLocalDataModel.oData[i].POP,
                        "PEMCDate": oLocalDataModel.oData[i].POP,
                        "EmploymentType": oLocalDataModel.oData[i].POP,
                        "EmploymentGroup": oLocalDataModel.oData[i].POP,
                        "AppointmentType": oLocalDataModel.oData[i].POP,
                        "CovNonCov": oLocalDataModel.oData[i].POP,
                        "CadreCode": oLocalDataModel.oData[i].POP,
                        "Designation": oLocalDataModel.oData[i].POP,
                        "ContractEndDate": oLocalDataModel.oData[i].POP,
                        "CadreforFTC": oLocalDataModel.oData[i].POP,
                        "ISPSNo": oLocalDataModel.oData[i].POP,
                        "NSPSNo": oLocalDataModel.oData[i].POP,
                        "HRPSNo": oLocalDataModel.oData[i].POP,
                        "TIMEADMINPSNo": oLocalDataModel.oData[i].POP,
                        "DHPSNo": oLocalDataModel.oData[i].POP,
                        "DHName": oLocalDataModel.oData[i].POP,
                        "OfficeSite": oLocalDataModel.oData[i].POP,
                        "JobFunctionCode": oLocalDataModel.oData[i].JobFunctionCode,
                        "JobSubFunctionCode": oLocalDataModel.oData[i].POP,
                        "LegalEntityCode": oLocalDataModel.oData[i].LegalEntityCode,
                        "ICCode": oLocalDataModel.oData[i].ICCode,
                        "DepartmentProject": oLocalDataModel.oData[i].POP,
                        "CostCenter": oLocalDataModel.oData[i].CostCenter,
                        "SBGCode": oLocalDataModel.oData[i].POP,
                        "BUCode": oLocalDataModel.oData[i].POP,
                        "SegmentCode": oLocalDataModel.oData[i].POP,
                        "ClusterCode": oLocalDataModel.oData[i].POP,
                        "BaseLocation": oLocalDataModel.oData[i].POP,
                        "ICCode": oLocalDataModel.oData[i].ICCode,
                        "SegmentCode": oLocalDataModel.oData[i].SegmentCode,
                        "ClusterCode": oLocalDataModel.oData[i].ClusterCode,
                        "DepartmentProject": oLocalDataModel.oData[i].DepartmentProject,
                        "Location": oLocalDataModel.oData[i].Location,
                        "PayGrade": oLocalDataModel.oData[i].PayGrade,
                        "StraBusinessGroup": oLocalDataModel.oData[i].StraBusinessGroup,
                        "Department": oLocalDataModel.oData[i].Department,
                        "Company": oLocalDataModel.oData[i].Company,
                        "JobCode": oLocalDataModel.oData[i].JobCode,
                        "Vacant": oLocalDataModel.oData[i].Vacant,                        
                        "Band": oLocalDataModel.oData[i].Band,
                        "EmployeeGroup": oLocalDataModel.oData[i].EmployeeGroup,
                        "PositionTitle": oLocalDataModel.oData[i].PositionTitle,
                        "PositionName": oLocalDataModel.oData[i].PositionName,
                        "employeeClass": oLocalDataModel.oData[i].employeeClass,
                        "employeeType": oLocalDataModel.oData[i].employeeType,
                        "eventReason": oLocalDataModel.oData[i].eventReason,
                        "managerId": oLocalDataModel.oData[i].managerId,
                        "customString5": oLocalDataModel.oData[i].customString5,
                        "trackId": oLocalDataModel.oData[i].trackId                  
                    };
                    excelRowValues.push(oData);
                } catch (err) {
                    console.error("Error in getVacantList", err);
                }
        
                aFilters = [];
            }
        
            var oJSONModel1 = new sap.ui.model.json.JSONModel();
            oJSONModel1.setData(excelRowValues);
            this.getView().setModel(oJSONModel1, "VacantPositionModel");

            this.getView().byId("idVacantTable").getColumns()[1].setVisible(true);
            this.getView().byId("idVacantTable").getColumns()[2].setVisible(true);
            this.getView().byId("idVacantTable").getColumns()[3].setVisible(true);

            oBusyDialog.close();
        },

        // getVacantList: function () {

        //     /*var items = this.getView().byId("idVacantTable").getItems();
        //     for (var i = 0, len = items.length; i < len; i++) { 
        //     }*/
        //     var aFilters = [];
        //     var excelRowValues = [];
        //     var oPositionCodes="";
        //     var that = this;
            
        //     var oLocalDataModel = that.getView().getModel("VacantPositionModel");
        //     for (var i = 0; i < oLocalDataModel.oData.length; i++) { 
               
        //         let oJobFunctionCode = oLocalDataModel.oData[i].JobFunctionCode;
        //         aFilters.push(new sap.ui.model.Filter("jobCode", sap.ui.model.FilterOperator.EQ, oJobFunctionCode)); 

        //         let oLegalEntityCode = oLocalDataModel.oData[i].LegalEntityCode;
        //         aFilters.push(new sap.ui.model.Filter("costCenter", sap.ui.model.FilterOperator.EQ, oLegalEntityCode)); 
                
        //         async function main() { 
        //             oPositionCodes = await that.callGetOData(aFilters);
        //         // .then(function (data) {  
        //         //     console.log("Promise Return:" +oData);                  
        //         // })
        //         // .catch(function(oError){
        //         //     MessageToast.show("oData Read Error");
        //         // })
        //         return oPositionCodes;
        //         }

        //         var finalData = main();
                
        //         aFilters=[];

        //         var oData = {
        //             "PostionCodes": finalData,
        //             "CandidateName": oLocalDataModel.oData[i].CandidateName,
        //             "POP": oLocalDataModel.oData[i].MobileNo,
        //             "MobileNo": oLocalDataModel.oData[i].POP,
        //             "EmailID": oLocalDataModel.oData[i].POP,
        //             "Gender": oLocalDataModel.oData[i].POP,
        //             "DOJ": oLocalDataModel.oData[i].POP,
        //             "CurrentLocation": oLocalDataModel.oData[i].POP,
        //             "PEMCLocation": oLocalDataModel.oData[i].POP,
        //             "PEMCDate": oLocalDataModel.oData[i].POP,
        //             "EmploymentType": oLocalDataModel.oData[i].POP,
        //             "EmploymentGroup": oLocalDataModel.oData[i].POP,
        //             "AppointmentType": oLocalDataModel.oData[i].POP,
        //             "CovNonCov": oLocalDataModel.oData[i].POP,
        //             "CadreCode": oLocalDataModel.oData[i].POP,
        //             "Designation": oLocalDataModel.oData[i].POP,
        //             "ContractEndDate": oLocalDataModel.oData[i].POP,
        //             "CadreforFTC": oLocalDataModel.oData[i].POP,
        //             "ISPSNo": oLocalDataModel.oData[i].POP,
        //             "NSPSNo": oLocalDataModel.oData[i].POP,
        //             "HRPSNo": oLocalDataModel.oData[i].POP,
        //             "TIMEADMINPSNo": oLocalDataModel.oData[i].POP,
        //             "DHPSNo": oLocalDataModel.oData[i].POP,
        //             "DHName": oLocalDataModel.oData[i].POP,
        //             "OfficeSite": oLocalDataModel.oData[i].POP,
        //             "JobFunctionCode": oLocalDataModel.oData[i].JobFunctionCode,
        //             "JobSubFunctionCode": oLocalDataModel.oData[i].POP,
        //             "LegalEntityCode": oLocalDataModel.oData[i].LegalEntityCode,
        //             "ICCode": oLocalDataModel.oData[i].POP,
        //             "DepartmentProject": oLocalDataModel.oData[i].POP,
        //             "CostCenter": oLocalDataModel.oData[i].POP,
        //             "SBGCode": oLocalDataModel.oData[i].POP,
        //             "BUCode": oLocalDataModel.oData[i].POP,
        //             "SegmentCode": oLocalDataModel.oData[i].POP,
        //             "ClusterCode": oLocalDataModel.oData[i].POP,
        //             "BaseLocation": oLocalDataModel.oData[i].POP
        //         };
        //         excelRowValues.push(oData);
        //     }
        //     var oJSONModel1 = new JSONModel();
        //     oJSONModel1.setData(excelRowValues);
        //     this.getView().setModel(oJSONModel1, "VacantPositionModel");
        // },

//         getVacantList: function () {

//             /*var items = this.getView().byId("idVacantTable").getItems();
//             for (var i = 0, len = items.length; i < len; i++) { 
//             }*/
//             var aFilters = [];
//             var excelRowValues = [];
//             var oPositionCodes="";
            
//             var oLocalDataModel = this.getView().getModel("VacantPositionModel");
//             for (var i = 0; i < oLocalDataModel.oData.length; i++) { 
               
//                 let oJobFunctionCode = oLocalDataModel.oData[i].JobFunctionCode;
//                 aFilters.push(new sap.ui.model.Filter("jobCode", sap.ui.model.FilterOperator.EQ, oJobFunctionCode)); 

//                 let oLegalEntityCode = oLocalDataModel.oData[i].LegalEntityCode;
//                 aFilters.push(new sap.ui.model.Filter("costCenter", sap.ui.model.FilterOperator.EQ, oLegalEntityCode)); 
                
//                 //oPositionCodes = this.getSFData(aFilters);
// //******************************************                
//                 var aAllData = [];
//                 var iSkip = 0;
//                 var iPageSize = 1000;
//                 var that = this;
//                 var oModel = that.getOwnerComponent().getModel();

//                 oModel.read("/Position", {
//                     filters: aFilters,
//                     urlParameters: {
//                         "$top": iPageSize,
//                         "$skip": iSkip
//                     },
//                     success: function (resp) {
//                         aAllData = aAllData.concat(resp.results);
//                         if (resp.results.length === iPageSize) {
//                             iSkip += iPageSize;
//                             //fetchFilterData(); //Fetch next page
//                         } else {                                        
//                             console.log("aAllData:" +aAllData);
//                             //let oPositionCodes = 'Vacant positions exist for the parameters - Position Codes ';
//                             if (aAllData.length > 0) {
//                                 for (let i = 0; i < aAllData.length; i++) {
//                                     oPositionCodes += aAllData[i].code+";";
//                                 }
//                                 console.log("PositionCodes:" +oPositionCodes); 
//                                 oPositionCodes = "";
//                                 aAllData = [];
//                             }                                        
//                         }
//                     }.bind(that),
//                     error: function (err) {
//                         console.error("Error fetching data", err);
//                     }
//                 });
// //****************************************** END **************************              
//                 var oData = {
//                     "PostionCodes": oPositionCodes,
//                     "CandidateName": oLocalDataModel.oData[i].CandidateName,
//                     "POP": oLocalDataModel.oData[i].MobileNo,
//                     "MobileNo": oLocalDataModel.oData[i].POP,
//                     "EmailID": oLocalDataModel.oData[i].POP,
//                     "Gender": oLocalDataModel.oData[i].POP,
//                     "DOJ": oLocalDataModel.oData[i].POP,
//                     "CurrentLocation": oLocalDataModel.oData[i].POP,
//                     "PEMCLocation": oLocalDataModel.oData[i].POP,
//                     "PEMCDate": oLocalDataModel.oData[i].POP,
//                     "EmploymentType": oLocalDataModel.oData[i].POP,
//                     "EmploymentGroup": oLocalDataModel.oData[i].POP,
//                     "AppointmentType": oLocalDataModel.oData[i].POP,
//                     "CovNonCov": oLocalDataModel.oData[i].POP,
//                     "CadreCode": oLocalDataModel.oData[i].POP,
//                     "Designation": oLocalDataModel.oData[i].POP,
//                     "ContractEndDate": oLocalDataModel.oData[i].POP,
//                     "CadreforFTC": oLocalDataModel.oData[i].POP,
//                     "ISPSNo": oLocalDataModel.oData[i].POP,
//                     "NSPSNo": oLocalDataModel.oData[i].POP,
//                     "HRPSNo": oLocalDataModel.oData[i].POP,
//                     "TIMEADMINPSNo": oLocalDataModel.oData[i].POP,
//                     "DHPSNo": oLocalDataModel.oData[i].POP,
//                     "DHName": oLocalDataModel.oData[i].POP,
//                     "OfficeSite": oLocalDataModel.oData[i].POP,
//                     "JobFunctionCode": oLocalDataModel.oData[i].JobFunctionCode,
//                     "JobSubFunctionCode": oLocalDataModel.oData[i].POP,
//                     "LegalEntityCode": oLocalDataModel.oData[i].LegalEntityCode,
//                     "ICCode": oLocalDataModel.oData[i].POP,
//                     "DepartmentProject": oLocalDataModel.oData[i].POP,
//                     "CostCenter": oLocalDataModel.oData[i].POP,
//                     "SBGCode": oLocalDataModel.oData[i].POP,
//                     "BUCode": oLocalDataModel.oData[i].POP,
//                     "SegmentCode": oLocalDataModel.oData[i].POP,
//                     "ClusterCode": oLocalDataModel.oData[i].POP,
//                     "BaseLocation": oLocalDataModel.oData[i].POP
//                 };
//                 excelRowValues.push(oData);
//             }
//             var oJSONModel1 = new JSONModel();
//             oJSONModel1.setData(excelRowValues);
//             this.getView().setModel(oJSONModel1, "VacantPositionModel");
//         },

            applyPosition: async function (oEvent) {
                var that = this;
                var oSelectedRow = oEvent.getSource().getBindingContext("VacantPositionModel").getObject().Index;
                var oTable = this.getView().byId("idVacantTable");
                let oPositionCreationData={};

                if (oTable.getItems()[oSelectedRow].getCells()[3].getText() != "Hire Emp") {
                    oPositionCreationData.effectiveStatus = oTable.getItems()[oSelectedRow].getCells()[5].getText();
                    oPositionCreationData.cust_jobfunction = oTable.getItems()[oSelectedRow].getCells()[15].getText();
                    oPositionCreationData.businessUnit = oTable.getItems()[oSelectedRow].getCells()[17].getText();  
                    oPositionCreationData.cust_Segment = oTable.getItems()[oSelectedRow].getCells()[18].getText();
                    oPositionCreationData.cust_Cluster = oTable.getItems()[oSelectedRow].getCells()[19].getText();  
                    oPositionCreationData.cust_Departmentprojects = oTable.getItems()[oSelectedRow].getCells()[20].getText();                
                    oPositionCreationData.location = oTable.getItems()[oSelectedRow].getCells()[21].getText();
                    oPositionCreationData.payGrade = oTable.getItems()[oSelectedRow].getCells()[22].getText();
                    oPositionCreationData.division = oTable.getItems()[oSelectedRow].getCells()[23].getText();
                    oPositionCreationData.department = oTable.getItems()[oSelectedRow].getCells()[24].getText();                    
                    oPositionCreationData.company = oTable.getItems()[oSelectedRow].getCells()[25].getText();
                    oPositionCreationData.jobCode = oTable.getItems()[oSelectedRow].getCells()[26].getText();
                    oPositionCreationData.vacant = false;//oTable.getItems()[oSelectedRow].getCells()[27].getText();                    
                    oPositionCreationData.cust_Band = oTable.getItems()[oSelectedRow].getCells()[28].getText();
                    oPositionCreationData.cust_EmployeeGroup = oTable.getItems()[oSelectedRow].getCells()[29].getText();                    
                    oPositionCreationData.positionTitle = oTable.getItems()[oSelectedRow].getCells()[30].getText();
                    oPositionCreationData.externalName_defaultValue = oTable.getItems()[oSelectedRow].getCells()[31].getText();
                    //oPositionCreationData.costCenter = oTable.getItems()[oSelectedRow].getCells()[32].getText();
                    
                    var oDate = that.convertStartDate(oTable.getItems()[oSelectedRow].getCells()[12].getText());
                    oPositionCreationData.effectiveStartDate = oDate;//oTable.getItems()[oSelectedRow].getCells()[12].getText();

                    oPositionCreationData.cust_ClusterNav = {
                                        "results" : [
                                                {
                                                    "externalCode" : oTable.getItems()[oSelectedRow].getCells()[19].getText(),
                                                    "effectiveStartDate": oDate
                                                }  
                                            ]
                                        };
                    oPositionCreationData.cust_BandNav = {
                                        "results" : [
                                                {
                                                    "externalCode" : oTable.getItems()[oSelectedRow].getCells()[28].getText(),
                                                    "effectiveStartDate": oDate
                                                }  
                                            ]
                                        }; 

                    oPositionCreationData.cust_EmployeeGroupNav = {
                                        "results" : [
                                                {
                                                    "externalCode" : oTable.getItems()[oSelectedRow].getCells()[29].getText(),
                                                    "effectiveStartDate": oDate
                                                }  
                                            ]
                                        }; 
                    oPositionCreationData.cust_DepartmentprojectsNav = {
                                            "results" : [
                                                    {
                                                        "externalCode" : oTable.getItems()[oSelectedRow].getCells()[20].getText(),
                                                        "effectiveStartDate": oDate
                                                    }  
                                                ]
                                            }; 
    
                    oPositionCreationData.cust_SegmentNav = {
                                            "results" : [
                                                    {
                                                        "externalCode" : oTable.getItems()[oSelectedRow].getCells()[18].getText(),
                                                        "effectiveStartDate": oDate
                                                    }  
                                                ]
                                            }; 
                    
                    var oBusyDialog = new sap.m.BusyDialog({
                                      title: "Position Creation Starts",
                                      text: "Please wait..."
                                    });                   
                    oBusyDialog.open();

                    console.log("**** oPositionCreationData Start*****");
                    console.log(oPositionCreationData);
                    console.log("**** oPositionCreationData End*****");
                    // New Position Creation
                    var createPositionRes = await that.createPosition(oPositionCreationData, oBusyDialog);  
                    if (createPositionRes.d.code != '') {
                        MessageBox.success("Position "+createPositionRes.d.code+" Created Successfully");
                    }
                    console.log("Position "+createPositionRes.d.code+" Created Successfully");
                    oBusyDialog.close();

                } else {
                    //fetching entered Position code
                    var oPositionInput = oTable.getItems()[oSelectedRow].getCells()[2].getValue();
                    if (oPositionInput == '') {
                        MessageToast.show("Position code not null");
                        return;
                    }

                    let oPositionCodes = oTable.getItems()[oSelectedRow].getCells()[1].getText();

                    if (oPositionCodes != '') {
                        oPositionCodes = oPositionCodes.split(";");

                        let isExist = "N";
                        var oUserData = {};
                        var oPerPersonData = {};
                        var oEmpEmployeeData = {};
                        var oEmpJobData = {};

                        var oBusyDialog = new sap.m.BusyDialog({
                            title: "Employee Creation Starts",
                            text: "Please wait..."
                        });                   
                        oBusyDialog.open();

                        for (let i=0; i < oPositionCodes.length; i++) {
                            if (oPositionCodes[i] === oPositionInput) {
                                //MessageToast.show("Successfully applied the Position code: " +oPositionInput);
                                
                                //************************************ User ***********************************
                                oUserData.__metadata = {
                                        "uri": "User('"+oTable.getItems()[oSelectedRow].getCells()[4].getText()+"')",
                                        "type": "SFOData.User"
                                    };
                                oUserData.userId = oTable.getItems()[oSelectedRow].getCells()[4].getText();
                                oUserData.status = oTable.getItems()[oSelectedRow].getCells()[5].getText();

                                var createUserRes = await that.createUser(oUserData);                            
                                if (createUserRes.d[0].status == "OK") {
                                    oBusyDialog.setText("1 User Update Success...");
                                    console.log("User Update Success");
                                    //MessageToast.show("User Update Success");
                                } else {
                                    console.log("User Update Error:" +createUserRes.d[0].message);
                                    //MessageToast.show("User Update Error:" +createUserRes.d[0].message);                                    
                                    MessageBox.error("User Update Error:" +createUserRes.d[0].message);
                                    oBusyDialog.close();
                                    return;
                                }
                                
                                //************************************ PerPerson ***********************************
                                oPerPersonData.__metadata = {
                                    "uri": "PerPerson('"+oTable.getItems()[oSelectedRow].getCells()[4].getText()+"')",
                                    "type": "SFOData.PerPerson"
                                };

                                oPerPersonData.personIdExternal = oTable.getItems()[oSelectedRow].getCells()[4].getText();
                                oPerPersonData.regionOfBirth = oTable.getItems()[oSelectedRow].getCells()[7].getText();
                                oPerPersonData.placeOfBirth = oTable.getItems()[oSelectedRow].getCells()[8].getText();
                                oPerPersonData.customLong1 = oTable.getItems()[oSelectedRow].getCells()[9].getText();
                                oPerPersonData.countryOfBirth = oTable.getItems()[oSelectedRow].getCells()[10].getText();
                                
                                var oDateOfBirth = oTable.getItems()[oSelectedRow].getCells()[11].getText();
                                var jsonDate;
                                if ( oDateOfBirth != null) {
                                    var parts = oDateOfBirth.split("/");
                                    var day = parseInt(parts[0], 10);
                                    var month = parseInt(parts[1], 10) - 1;
                                    var year = parseInt(parts[2], 10);                    
                                
                                    var date = new Date(year, month, day);
                                    var timestamp = date.getTime();
                                    jsonDate = "/Date(" + timestamp + ")/";
                                }
                                oPerPersonData.dateOfBirth = jsonDate;//oTable.getItems()[oSelectedRow].getCells()[11].getText();

                                var createPerPersonRes = await that.createPerPerson(oPerPersonData);

                                if (createPerPersonRes.d[0].status == "OK") {
                                    oBusyDialog.setText("2 PerPerson Update Success...");
                                    console.log("PerPerson Update Success");
                                    //MessageToast.show("PerPerson Update Success");
                                } else {
                                    MessageToast.show("PerPerson Update Error:" +createPerPersonRes.d[0].message);
                                    console.log("PerPerson Update Error:" +createPerPersonRes.d[0].message);
                                    oBusyDialog.close();
                                    return;
                                }

                                //************************************ EmpEmployee ***********************************
                                oEmpEmployeeData.__metadata = {
                                    "uri": "EmpEmployment",
                                    "type": "SFOData.EmpEmployment"
                                };

                                oEmpEmployeeData.personIdExternal = oTable.getItems()[oSelectedRow].getCells()[6].getText();
                                oEmpEmployeeData.userId = oTable.getItems()[oSelectedRow].getCells()[4].getText();
                                
                                var oStartDate = that.convertStartDate(oTable.getItems()[oSelectedRow].getCells()[12].getText());
                                oEmpEmployeeData.startDate = oStartDate;

                                var createEmpEmployeeRes = await that.createEmpEmployee(oEmpEmployeeData);
                                if (createEmpEmployeeRes.d[0].status == "OK") {
                                    console.log("EmpEmployee Update Success");
                                    oBusyDialog.setText("3 EmpEmployee Update Success...");
                                    //MessageToast.show("EmpEmployee Update Success");
                                } else {
                                    MessageToast.show("EmpEmployee Update Error:" +createEmpEmployeeRes.d[0].message);
                                    console.log("EmpEmployee Update Error:" +createEmpEmployeeRes.d[0].message);
                                    oBusyDialog.close();
                                    return;
                                }
                                //************************************ EmpJob ***********************************
                                
                                oEmpJobData.__metadata = {
                                    "uri": "EmpJob",
                                    "type": "SFOData.EmpJob"
                                };
                                oEmpJobData.userId = oTable.getItems()[oSelectedRow].getCells()[4].getText();
                                oEmpJobData.customString15 = oTable.getItems()[oSelectedRow].getCells()[15].getText();//job function

                                oEmpJobData.businessUnit = oTable.getItems()[oSelectedRow].getCells()[17].getText();
                                oEmpJobData.customString2 = oTable.getItems()[oSelectedRow].getCells()[18].getText();//segment
                                oEmpJobData.customString3 = oTable.getItems()[oSelectedRow].getCells()[19].getText();//cluster
                                oEmpJobData.customString6 = oTable.getItems()[oSelectedRow].getCells()[20].getText();//Department/Project
                                oEmpJobData.location = oTable.getItems()[oSelectedRow].getCells()[21].getText();
                                oEmpJobData.payGrade = oTable.getItems()[oSelectedRow].getCells()[22].getText();
                                oEmpJobData.division = oTable.getItems()[oSelectedRow].getCells()[23].getText();
                                oEmpJobData.department = oTable.getItems()[oSelectedRow].getCells()[24].getText();
                                oEmpJobData.company = oTable.getItems()[oSelectedRow].getCells()[25].getText();
                                oEmpJobData.jobCode = oTable.getItems()[oSelectedRow].getCells()[26].getText();                                
                                oEmpJobData.customString9 = oTable.getItems()[oSelectedRow].getCells()[28].getText();
                                oEmpJobData.customString8 = oTable.getItems()[oSelectedRow].getCells()[29].getText();//employee group
                                oEmpJobData.costCenter = oTable.getItems()[oSelectedRow].getCells()[32].getText();
                                oEmpJobData.employeeClass = oTable.getItems()[oSelectedRow].getCells()[33].getText();      
                                oEmpJobData.seqNumber = 1;
                                oEmpJobData.employeeType = oTable.getItems()[oSelectedRow].getCells()[34].getText();//Employment Type
                                oEmpJobData.eventReason = oTable.getItems()[oSelectedRow].getCells()[35].getText();                                
                                oEmpJobData.managerId = oTable.getItems()[oSelectedRow].getCells()[36].getText();
                                oEmpJobData.customString5 = oTable.getItems()[oSelectedRow].getCells()[37].getText();//L&T Group of Companies
                                oEmpJobData.trackId = oTable.getItems()[oSelectedRow].getCells()[38].getText();//Office /Site
                                oEmpJobData.position = oPositionInput;

                                oEmpJobData.startDate = that.convertStartDate(oTable.getItems()[oSelectedRow].getCells()[12].getText());  

                                console.log("****EmpJob Data starts ****");
                                console.log(oEmpJobData);
                                console.log("****EmpJob Data ends ****");
                                var createEmpJobRes = await that.createEmpJob(oEmpJobData);
                                if (createEmpJobRes.d[0].status == "OK") {
                                    console.log("EmpJob Update Success");
                                    MessageBox.success("4 EmpJob Update Success:" + createEmpJobRes.d[0].message);
                                    //MessageToast.show("EmpJob Update Success");
                                    oBusyDialog.setText("4 EmpJob Update Success...");
                                } else {
                                    //MessageToast.show("EmpJob Update Error:" +createEmpJobRes.d[0].message);
                                    MessageBox.error("4 EmpJob Update Error:" +createEmpJobRes.d[0].message);
                                    console.log("4 EmpJob Update Error:" +createEmpJobRes.d[0].message);
                                    oBusyDialog.close();
                                    return;
                                }

                                isExist = "Y";
                                break;    
                            }
                        }

                        if (isExist === "Y") {
                        } else {
                            MessageToast.show("Position code does not exist in list");
                            return;
                        }
                    }
                    oBusyDialog.close();
                    }


                //var oItem= this.getView().byId("idVacantTable").getSelectedItem();
                //var oSelectedRow = oItem.getBindingContext("VacantPositionModel").getObject();
                //console.log("seleted position:"+oSelectedRow.PostionCodes);
            },
            convertStartDate: function (oDate) { 
                var jsonDate;
                if ( oDate != null) {
                    var parts = oDate.split("-");
                    var day = parseInt(parts[0], 10);
                    var month = parseInt(parts[1], 10) - 1;
                    var year = parseInt(parts[2], 10);                    
                
                    var date = new Date(year, month, day);
                    var timestamp = date.getTime();
                    jsonDate = "/Date(" + timestamp + ")/";
                }
                return jsonDate;
            },
            convertDate: function (oDate) { 
                var jsonDate;
                if ( oDate != null) {
                    var parts = oDate.split("/");
                    var day = parseInt(parts[0], 10);
                    var month = parseInt(parts[1], 10) - 1;
                    var year = parseInt(parts[2], 10);                    
                
                    var date = new Date(year, month, day);
                    var timestamp = date.getTime();
                    jsonDate = "/Date(" + timestamp + ")/";
                }
                return jsonDate;
            },

            createUser: function (oUserData) {
                return new Promise((resolve, reject) => {
                    //var oModel = this.getOwnerComponent().getModel();
                    var oComponent = this.getOwnerComponent();
                    var sBaseUrl = oComponent.getManifestEntry("sap.app").dataSources.mainService.uri;
                    var posturl = sBaseUrl + "/upsert";

                    // const myHeaders = new Headers();
                    // myHeaders.append("Accept", "application/json");
                    // myHeaders.append("Content-Type", "application/json");

                    $.ajax({
                        url: posturl,
                        type: "POST",
                        headers: {
                            "Accept":"application/json",
                            "Content-Type" : "application/json"
                        },
                        data: JSON.stringify(oUserData),

                        // beforeSend: function(xhr) {
                        //     xhr.setRequestHeader("Authorization", "Basic " + btoa("LTIADMIN@larsento02T1:Ltiadmin@12345"));
                        // },
                        success: function(response) {
                            resolve(response);
                            console.log("User Success:", response);
                        },
                        error: function(error) {
                            console.log("User Error:", error);
                            console.log("User Response Text:", error.responseText);
                            reject(error);
                        }
                    });
                });
            },

            createPerPerson: function (oPerPersonData) {
                return new Promise((resolve, reject) => {
                    var oComponent = this.getOwnerComponent();
                    var sBaseUrl = oComponent.getManifestEntry("sap.app").dataSources.mainService.uri;
                    var posturl = sBaseUrl + "/upsert";

                    $.ajax({
                        url: posturl,
                        type: "POST",
                        headers: {
                            "Accept":"application/json",
                            "Content-Type" : "application/json"
                        },
                        data: JSON.stringify(oPerPersonData),

                        success: function(response) {
                            resolve(response);
                            console.log("PerPerson Success:", response);
                        },
                        error: function(error) {
                            console.log("PerPerson Error:", error);
                            console.log("PerPerson Response Text:", error.responseText);
                            reject(error);
                        }
                    });
                });
            },

            createEmpJob: function (oEmpJobData) {
                return new Promise((resolve, reject) => {
                    var oComponent = this.getOwnerComponent();
                    var sBaseUrl = oComponent.getManifestEntry("sap.app").dataSources.mainService.uri;
                    var posturl = sBaseUrl + "/upsert";

                    $.ajax({
                        url: posturl,
                        type: "POST",
                        headers: {
                            "Accept":"application/json",
                            "Content-Type" : "application/json"
                        },
                        data: JSON.stringify(oEmpJobData),

                        success: function(response) {
                            resolve(response);
                            console.log("EmpJob Success:", response);
                        },
                        error: function(error) {
                            console.log("EmpJob Error:", error);
                            console.log("EmpJob Response Text:", error.responseText);
                            reject(error);
                        }
                    });
                });
            },

            createEmpEmployee: function (oEmpEmployeeData) {
                return new Promise((resolve, reject) => {
                    var oComponent = this.getOwnerComponent();
                    var sBaseUrl = oComponent.getManifestEntry("sap.app").dataSources.mainService.uri;
                    var posturl = sBaseUrl + "/upsert";

                    $.ajax({
                        url: posturl,
                        type: "POST",
                        headers: {
                            "Accept":"application/json",
                            "Content-Type" : "application/json"
                        },
                        data: JSON.stringify(oEmpEmployeeData),

                        success: function(response) {
                            resolve(response);
                            console.log("EmpEmployee Success:", response);
                        },
                        error: function(error) {
                            console.log("EmpEmployee Error:", error);
                            console.log("EmpEmployee Response Text:", error.responseText);
                            reject(error);
                        }
                    });
                });
            },

            createPosition: function (oPositionCreationData, oBusyDialog) {
                return new Promise((resolve, reject) => {
                    var oComponent = this.getOwnerComponent();
                    var sBaseUrl = oComponent.getManifestEntry("sap.app").dataSources.mainService.uri;
                    var posturl = sBaseUrl + "/Position";

                    $.ajax({
                        url: posturl,
                        type: "POST",
                        headers: {
                            "Accept":"application/json",
                            "Content-Type" : "application/json"
                        },
                        data: JSON.stringify(oPositionCreationData),

                        success: function(response) {
                            resolve(response);
                            console.log("PositionCreation Success:", response);
                        },
                        error: function(error) {
                            console.log("PositionCreation Error:", error);
                            MessageBox.error("PositionCreation Error:" +error.responseJSON.error.message.value);
                            //MessageToast.show("PositionCreation Error:" +error.responseJSON.error.message.value);
                            oBusyDialog.close();
                            reject(error);
                        }
                    });
                });
            },

            handleDownloadTemplate: function (oEvent) {
                var oModel = new JSONModel();
                var _data = [{
                    "Candidate Name (As per AADHAR)": "",
                    "POP": "",
                    "Mobile No": "",
                    "Email ID": "",
                    "Gender (M/F)": "",
                    "DOJ": "",
                    "Current Location": "",
                    "Preferred PEMC Location": "",
                    "Preferred PEMC Date": "",
                    "Employment_Type": "",
                    "Employment Group": "",
                    "Appointment Type": "",
                    "Cov / Non Cov": "",
                    "Cadre_Code": "",
                    "Designation / Title": "",
                    "Contract End Date (in case of FTC)": "",
                    "Eq. Cadre for FTC / Unclassified": "",
                    "IS PS No": "",
                    "NS PS No.": "",
                    "HR PS No": "",
                    "TIME ADMIN PS No": "",
                    "DH PS No.": "",
                    "DH Name": "",
                    "Office / Site": "",
                    "Job Function_Code": "",
                    "Job Sub Function_Code": "",
                    "Legal_Entity_Code": "",
                    "IC Code": "",
                    "Department/Project Code": "",
                    "Cost Centre Code": "",
                    "SBG Code": "",
                    "BU Code": "",
                    "Segment Code": "",
                    "Cluster Code.": "",
                    "Base Location Code": "",
                }];
                oModel.setData(_data);
                this.getView().setModel(oModel, "docTemplateModel");
                var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var aCols, aObjects, oSettings;
                aCols = this.createColumnConfig();
                aObjects = this.getView().getModel("docTemplateModel").getProperty('/');
                oSettings = {
                    workbook: {
                        columns: aCols,
                        context: {
                            sheetName: 'Planed Orders'
                        }
                    },
                    dataSource: aObjects,
                    fileName: 'Planned Orders Template'
                };
                this.oSheet = new Spreadsheet(oSettings);
                this.oSheet.build()
                    .then(function () {
                        MessageToast.show(oResourceBundle.getText("TemplateDownload"));
                    })
                    .finally(this.oSheet.destroy);
            },
            onReset: function () {
                MessageToast.show("work in-progress......");
            },
            onExport: function () {
                MessageToast.show("work in-progress......");
            },
        // ************** Read oData operation ****************************
            onSearch: function() {
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
    });
});