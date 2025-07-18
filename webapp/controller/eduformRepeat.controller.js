sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/date/UI5Date",
    "sap/m/library",
    "sap/m/upload/Uploader",
    "sap/ui/core/Item"
],
    function (Controller, Fragment, JSONModel, History, ODataModel, UI5Date, MobileLibrary, Uploader, Item) {
        "use strict";
                return Controller.extend("sfpositioncheck.controller.eduform", {

            _date : {
                "date" : UI5Date.getInstance()
            },

            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel({
                    Sections: [
                      { Title: "Subsection 1", Content: "Details for 1" },
                      { Title: "Subsection 2", Content: "Details for 2" }
                    ]
                  });
                  //this.getView().setModel(oModel);
                  var dynamicData = this.getOwnerComponent().getModel("DynamicData");
                  //this.getView().setModel(dynamicData, "DynamicData");
      
                  var oViewTemplate = sap.ui.view({
                                        preprocessors: {

                        xml: {
                            models: {
                                tmpl: oModel // we are assigning model to template with the name "tmpl"
                            }
                        }
                    },
                    type: sap.ui.core.mvc.ViewType.XML,
                    viewName: 'sfpositioncheck.view.eduform' // path to xml template  file.
                });

                this.getView().byId('someContentIt').addContent(oViewTemplate);

                // let oView = this.getView();
                // //buttons visibility
                // //oView.byId("submit").setVisible(false);

                // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // //oRouter.getRoute("OverView").attachPatternMatched(this._onRouteMatched, this);
                // this._formFragments = {};
                
                // // Set the initial form to be the display one
			    // //this._showFormFragment("Display");

                // var oModelDate = new JSONModel(this._date);
                // this.getView().setModel(oModelDate,"oModelDate");

                // var instnameModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/Institutionname.json"));
                // this.getView().setModel(instnameModel, "instnameModel");

                // var educerModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/educer.json"));
                // this.getView().setModel(educerModel, "educerModel");

                // var sscboardModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/sscboard.json"));
                // this.getView().setModel(sscboardModel, "sscboardModel");

                // var quasubtypeModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/quasubtype.json"));
                // this.getView().setModel(quasubtypeModel, "quasubtypeModel");

                // var branch2Model = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/branch2.json"));
                // this.getView().setModel(branch2Model, "branch2Model");

                // var branch1Model = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/branch1.json"));
                // this.getView().setModel(branch1Model, "branch1Model");

                // var univModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/universities.json"));
                // this.getView().setModel(univModel, "univModel");

                // var coursetypeModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/coursetype.json"));
                // this.getView().setModel(coursetypeModel, "coursetypeModel");

                // //repeat education
                // var oDiplomaModel = new sap.ui.model.json.JSONModel({
                //     Diploma: [
                //         { id: "idDiploma1", title: "Diploma 1", qualification: "Diploma Certificate", certificate: "VIII STD", institution: "National Public School", year: "2000" },
                //         { id: "idDiploma2", title: "Diploma 2", qualification: "Diploma", certificate: "XII STD", institution: "Technical College", year: "2005" }
                //     ]
                // });
                // this.getView().setModel(oDiplomaModel, "oDiplomaModel");

                // //Attachements
                // var sPath = sap.ui.require.toUrl("sfpositioncheck/model/items.json");
                // var oUploadSet = this.getView().byId("UploadSet");
                // this.getView().setModel(new JSONModel(sPath));
                
                // // Modify "add file" button
                // oUploadSet.getDefaultFileUploader().setButtonOnly(false);
                // oUploadSet.getDefaultFileUploader().setTooltip("");
                // oUploadSet.getDefaultFileUploader().setIconOnly(true);
                // oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
                // oUploadSet.attachUploadCompleted(this.onUploadCompleted.bind(this));
            },

            onUploadSelectedButton: function () {
                var oUploadSet = this.byId("UploadSet");
    
                oUploadSet.getItems().forEach(function (oItem) {
                    if (oItem.getListItem().getSelected()) {
                        oUploadSet.uploadItem(oItem);
                    }
                });
            },

            onDownloadSelectedButton: function () {
                var oUploadSet = this.byId("UploadSet");
    
                oUploadSet.getItems().forEach(function (oItem) {
                    if (oItem.getListItem().getSelected()) {
                        oItem.download(true);
                    }
                });
            },

            onSelectionChange: function() {
                var oUploadSet = this.byId("UploadSet");
                // If there's any item selected, sets version button enabled
                if (oUploadSet.getSelectedItems().length > 0) {
                    if (oUploadSet.getSelectedItems().length === 1) {
                        this.byId("versionButton").setEnabled(true);
                    } else {
                        this.byId("versionButton").setEnabled(false);
                    }
                } else {
                    this.byId("versionButton").setEnabled(false);
                }
            },
            onVersionUpload: function(oEvent) {
                var oUploadSet = this.byId("UploadSet");
                this.oItemToUpdate = oUploadSet.getSelectedItem()[0];
                oUploadSet.openFileDialog(this.oItemToUpdate);
            },
            onUploadCompleted: function(oEvent) {
                this.oItemToUpdate = null;
                this.byId("versionButton").setEnabled(false);
                // add item to the model
                var oItem = oEvent.getParameter("item");
                var oModel = this.getView().getModel();
                var aItems = oModel.getProperty("/items");
                var oItemData = this._getItemData(oItem);
                aItems.unshift(oItemData);
                oModel.setProperty("/items", aItems);
                oModel.refresh();
            },
            onAfterItemRemoved: function(oEvent) {
                // remove item from the model
                var oItem = oEvent.getParameter("item");
                var oModel = this.getView().getModel();
                var aItems = oModel.getProperty("/items");
                var oItemData = oItem?.getBindingContext()?.getObject();
                var iIndex = aItems.findIndex((item) => {
                    return item.id == oItemData?.id;
                });
                if (iIndex > -1) {
                    aItems.splice(iIndex, 1);
                    oModel.setProperty("/items", aItems);
                }
            },
            _getItemData: function(oItem) {
                // generate a 6 digit random number as id
                const iId = Math.floor(Math.random() * 1000000);
                const oFileObject = oItem.getFileObject();
                return {
                    id: iId,
                    fileName: oItem?.getFileName(),
                    uploaded: new Date(),
                    uploadedBy: "John Doe",
                    mediaType: oFileObject.type,
                    // URL to the uploaded file from blob.
                    url: oItem?.getUrl() ? oItem?.getUrl() : URL.createObjectURL(oFileObject),
                    statuses: [
                        {
                            "title": "Uploaded By",
                            "text": "Jane Burns",
                            "active": true
                        },
                        {
                            "title": "Uploaded On",
                            "text": "Today",
                            "active": false
                        }
                    ]
                };
            },
            _showFormFragment : function (sFragmentName) {
                var oPage = this.byId("ObjectPageLayout");
    
                this._getFormFragment(sFragmentName).then(function(oSection){
                    oPage.addSection(oSection);
                });
            },
            _getFormFragment: function (sFragmentName) {
                var pFormFragment = this._formFragments[sFragmentName],
                    oView = this.getView();
    
                if (!pFormFragment) {
                    pFormFragment = Fragment.load({
                        id: oView.getId(),
                        name: "sfpositioncheck.view." + sFragmentName
                    });
                    this._formFragments[sFragmentName] = pFormFragment;
                }
    
                return pFormFragment;
            },
            
            onAddEducation : function () {
                let oView = this.getView();

                oView.byId("opsother").setVisible(true);
            }, 

            onFileChange: function(oEvent) {
                const oFileUploader = oEvent.getSource();
                const file = oEvent.getParameter("files")[0];
          
                if (file) {
                  this._file = file;
                }
              },
          
              onUploadPress: function() {
                // const oFileUploader = this.byId("fileUploader");
          
                // if (!this._file) {
                //   MessageToast.show("Please select a file first.");
                //   return;
                // }
          
                // // Simulate upload and add to file list
                // const oList = this.byId("fileList");
                // const oModel = oList.getModel();
          
                // const fileEntry = {
                //   fileName: this._file.name,
                //   fileSize: (this._file.size / 1024).toFixed(2) + " KB"
                // };
          
                // const data = oModel ? oModel.getData() : { items: [] };
                // data.items.push(fileEntry);
                // oList.setModel(new sap.ui.model.json.JSONModel(data));
                // oList.bindItems("/items", oList.getBindingInfo("items").template);
          
                // this._file = null;
                // oFileUploader.clear();
              },
          
              onFileItemPress: function(oEvent) {
                const fileName = oEvent.getSource().getTitle();
                MessageToast.show("Download or view: " + fileName);
              },
              
            onAddTrade: function () { 
                let oView = this.getView();

                oView.byId("opsSubTradeCertificate1").setVisible(true);
            },
            onDeleteTrade: function () { 
                let oView = this.getView();

                oView.byId("opsSubTradeCertificate1").setVisible(false);
            },
            onEdit: function () {
                let oView = this.getView();

                var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
			    oObjectPage.setShowFooter(!bCurrentShowFooterState);

                oView.byId("opsTradeAttachements").setVisible(true);
                //oView.byId("opsSubTradeCertificate").setTitle("");

                //buttons visibility
                oView.byId("submit").setVisible(true);
                oView.byId("cancel").setVisible(true);
                oView.byId("addTrade").setVisible(true);
                oView.byId("save").setVisible(true);
                oView.byId("edit").setVisible(false);

                //SSC - field type changes
                // let oFormSSC = this.byId("idSimpleFormSSC");
                // oFormSSC.setEditable(true);
                
                oView.byId("tQuaSubtype1").setVisible(false);
                oView.byId("tEduCer1").setVisible(false);
                oView.byId("tBranch11").setVisible(false);
                oView.byId("tBranch21").setVisible(false);
                oView.byId("tInsName1").setVisible(false);
                oView.byId("tUnivName1").setVisible(false);
                oView.byId("tCourseType1").setVisible(false);
                oView.byId("tYear1").setVisible(false);
                oView.byId("tStartDate1").setVisible(false);
                oView.byId("tEndDate1").setVisible(false);
                oView.byId("tDuration1").setVisible(false);
                oView.byId("tPercentage1").setVisible(false);
                oView.byId("tCGPA1").setVisible(false);
                oView.byId("tDivision1").setVisible(false);
                oView.byId("tGrade1").setVisible(false);
                              
                oView.byId("iQuaSubtype1").setVisible(true);
                oView.byId("iEduCer1").setVisible(true);
                oView.byId("iBranch11").setVisible(true);
                oView.byId("iBranch21").setVisible(true);
                oView.byId("iInsName1").setVisible(true);
                oView.byId("iUnivName1").setVisible(true);
                oView.byId("iCourseType1").setVisible(true);
                oView.byId("tYear1").setVisible(true);
                oView.byId("iStartDate1").setVisible(true);
                oView.byId("iEndDate1").setVisible(true);
                oView.byId("iDuration1").setVisible(true);
                oView.byId("iPercentage1").setVisible(true);
                oView.byId("iCGPA1").setVisible(true);
                oView.byId("iDivision1").setVisible(true);
                oView.byId("iGrade1").setVisible(true);

                //set existing values in drop-down list
                oView.byId("iQuaSubtype1").setValue("Standard or Class 10 and less");
                oView.byId("iEduCer1").setValue("None");
                oView.byId("iBranch11").setValue("None"); 
                oView.byId("iBranch21").setValue("None");                
                oView.byId("iInsName1").setValue("Kendriya Vidyalaya");
                oView.byId("iUnivName1").setValue("Karnataka Board");
                oView.byId("iYear1").setValue("2000");
                oView.byId("iCourseType1").setValue("On Line");
                oView.byId("iDuration1").setValue("1");
                oView.byId("iPercentage1").setValue("70");
                oView.byId("iCGPA1").setValue("9");
                oView.byId("iDivision1").setValue("Science");
                oView.byId("iGrade1").setValue("A");
                
                //HSC - field type changes
                 oView.byId("tQuaSubtype2").setVisible(false);
                 oView.byId("tEduCer2").setVisible(false);
                 oView.byId("tBranch12").setVisible(false);
                 oView.byId("tBranch22").setVisible(false);
                 oView.byId("tInsName2").setVisible(false);
                 oView.byId("tUnivName2").setVisible(false);
                 oView.byId("tCourseType2").setVisible(false);
                 oView.byId("tYear2").setVisible(false);
                 oView.byId("tStartDate2").setVisible(false);
                 oView.byId("tEndDate2").setVisible(false);
                 oView.byId("tDuration2").setVisible(false);
                 oView.byId("tPercentage2").setVisible(false);
                 oView.byId("tCGPA2").setVisible(false);
                 oView.byId("tDivision2").setVisible(false);
                 oView.byId("tGrade2").setVisible(false);
                  
                oView.byId("iQuaSubtype2").setVisible(true);
                oView.byId("iEduCer2").setVisible(true);
                oView.byId("iBranch12").setVisible(true);
                oView.byId("iBranch22").setVisible(true);
                oView.byId("iInsName2").setVisible(true);
                oView.byId("iUnivName2").setVisible(true);
                oView.byId("iCourseType2").setVisible(true);
                oView.byId("tYear2").setVisible(true);
                oView.byId("iStartDate2").setVisible(true);
                oView.byId("iEndDate2").setVisible(true);
                oView.byId("iDuration2").setVisible(true);
                oView.byId("iPercentage2").setVisible(true);
                oView.byId("iCGPA2").setVisible(true);
                oView.byId("iDivision2").setVisible(true);
                oView.byId("iGrade2").setVisible(true);

                //set existing values in drop-down list
                oView.byId("iQuaSubtype2").setValue("Standard or Class 12 and 11 or SSLC");
                oView.byId("iEduCer2").setValue("None");
                oView.byId("iBranch12").setValue("Finance"); 
                oView.byId("iBranch22").setValue("Financial Analysis");                
                oView.byId("iInsName2").setValue("Kendriya Vidyalaya");
                oView.byId("iUnivName2").setValue("MAHARASHTRA STATE BOARD OF SECONDARY & HIGHER SECONDARY EDUCATION");
                oView.byId("iYear2").setValue("2000");
                oView.byId("iCourseType2").setValue("On Line");
                oView.byId("iDuration2").setValue("1");
                oView.byId("iPercentage2").setValue("70");
                oView.byId("iCGPA2").setValue("9");
                oView.byId("iDivision2").setValue("Science");
                oView.byId("iGrade2").setValue("A");
            },
            onCancel: function () {
                let oView = this.getView();

                oView.byId("opsTradeAttachements").setVisible(false);
                // oView.byId("opsDiplomaAttachements").setVisible(false);
                // oView.byId("opsTradeAttachements").setVisible(false);
                
                var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
			    oObjectPage.setShowFooter(!bCurrentShowFooterState);

                //buttons visibility
                oView.byId("edit").setVisible(true);
                oView.byId("submit").setVisible(false);
                oView.byId("save").setVisible(false);
                oView.byId("cancel").setVisible(false);
                oView.byId("addTrade").setVisible(false);
                
                //field type changes
                //let oForm = this.byId("idSimpleForm");
                //oForm.setEditable(true);
                oView.byId("tQuaSubtype2").setVisible(true);
                oView.byId("tEduCer2").setVisible(true);
                oView.byId("tBranch12").setVisible(true);
                oView.byId("tBranch22").setVisible(true);
                oView.byId("tInsName2").setVisible(true);
                oView.byId("tUnivName2").setVisible(true);
                oView.byId("tCourseType2").setVisible(true);
                oView.byId("tYear2").setVisible(true);
                oView.byId("tStartDate2").setVisible(true);
                oView.byId("tEndDate2").setVisible(true);
                oView.byId("tDuration2").setVisible(true);
                oView.byId("tPercentage2").setVisible(true);
                oView.byId("tCGPA2").setVisible(true);
                oView.byId("tDivision2").setVisible(true);
                oView.byId("tGrade2").setVisible(true);

                oView.byId("iQuaSubtype2").setVisible(false);
                oView.byId("iEduCer2").setVisible(false);
                oView.byId("iBranch12").setVisible(false);
                oView.byId("iBranch22").setVisible(false);
                oView.byId("iInsName2").setVisible(false);
                oView.byId("iUnivName2").setVisible(false);
                oView.byId("iCourseType2").setVisible(false);
                oView.byId("iYear2").setVisible(false);
                oView.byId("iStartDate2").setVisible(false);
                oView.byId("iEndDate2").setVisible(false);
                oView.byId("iDuration2").setVisible(false);
                oView.byId("iPercentage2").setVisible(false);
                oView.byId("iCGPA2").setVisible(false);
                oView.byId("iDivision2").setVisible(false);
                oView.byId("iGrade2").setVisible(false);

                //SSC
                oView.byId("tQuaSubtype1").setVisible(true);
                oView.byId("tEduCer1").setVisible(true);
                oView.byId("tBranch11").setVisible(true);
                oView.byId("tBranch21").setVisible(true);
                oView.byId("tInsName1").setVisible(true);
                oView.byId("tUnivName1").setVisible(true);
                oView.byId("tCourseType1").setVisible(true);
                oView.byId("tYear1").setVisible(true);
                oView.byId("tStartDate1").setVisible(true);
                oView.byId("tEndDate1").setVisible(true);
                oView.byId("tDuration1").setVisible(true);
                oView.byId("tPercentage1").setVisible(true);
                oView.byId("tCGPA1").setVisible(true);
                oView.byId("tDivision1").setVisible(true);
                oView.byId("tGrade1").setVisible(true);

                oView.byId("iQuaSubtype1").setVisible(false);
                oView.byId("iEduCer1").setVisible(false);
                oView.byId("iBranch11").setVisible(false);
                oView.byId("iBranch21").setVisible(false);
                oView.byId("iInsName1").setVisible(false);
                oView.byId("iUnivName1").setVisible(false);
                oView.byId("iCourseType1").setVisible(false);
                oView.byId("iYear1").setVisible(false);
                oView.byId("iStartDate1").setVisible(false);
                oView.byId("iEndDate1").setVisible(false);
                oView.byId("iDuration1").setVisible(false);
                oView.byId("iPercentage1").setVisible(false);
                oView.byId("iCGPA1").setVisible(false);
                oView.byId("iDivision1").setVisible(false);
                oView.byId("iGrade1").setVisible(false);
            },
            _onRouteMatched: function (oEvent) {
                var sCustomerId = parseInt(oEvent.getParameter("arguments").CustomerID);

                console.log(sCustomerId);

                var oModel = this.getOwnerComponent().getModel("cpmaster");
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading Data",
                    text: "Please wait..."
                });
                oBusyDialog.open();

                //var oFilter = new sap.ui.model.Filter("personalId", sap.ui.model.FilterOperator.EQ, sCustomerId);
                oModel.read("/Candidates_Details(personalId=" + sCustomerId + ")", {
                    //filters: [oFilter],
                    success: function (resp) {
                        oBusyDialog.close();
                        
                        var data = { 0: resp };
                        console.log(data);
                        oJSONModel.setData(data);
                        this.getView().setModel(oJSONModel, "UserDOdata");

                    }.bind(this),
                    error: function (err) {
                        oBusyDialog.close();
                        console.error("Error fetching data", err);
                    }
                });

                var NoModel = this.getOwnerComponent().getModel("CPMaster");
                console.log(typeof(sCustomerId));
                var posturl = this.getOwnerComponent().getManifestObject().resolveUri(
                    "v2/odata/v4/CPMaster/CompareCDwithSF(pid="+sCustomerId+")"
                );
                console.log(posturl);
             
                var that = this; 
                $.ajax({
                    url: posturl,
                    type: "GET",
                    async: false,
                    success: function (data) {
                        console.log("Before data:",data.d.value.results[0])
                        var odata = { 0: data.d.value.results[0].matching[0] };
                        //console.log(odata);
                        var NoJSONModel = new sap.ui.model.json.JSONModel();
                        NoJSONModel.setData(odata);
                        that.getView().setModel(NoJSONModel, "TData");
                    },
                    error: function (err) {
                        console.log("item status change failed");
                        console.log(err);

                    }
                });



            },
            
            OnNavBack: function () {

                console.log("Back button pressed");
                var oModel = this.getView().getModel("TData");
                if (oModel) {
                    console.log("Model found, clearing data");
                    oModel.setProperty("/", {}); // Clear the model data
                } else {
                    console.log("Model not found");
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CandidatePM");
            },
            navtoHP: function () {
                console.log("Back button pressed");
                var oModel = this.getView().getModel("TData");
                if (oModel) {
                    console.log("Model found, clearing data");
                    oModel.setProperty("/", {}); // Clear the model data
                } else {
                    console.log("Model not found");
                }
                var oModel = this.getView().getModel("TData");
                if (oModel) {
                    oModel.setData({});
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHomePage");

            },
            onNavToSFD: function (oEvent) {
                var oBindingContext = oEvent.getParameters().rowBindingContext;
                if (oBindingContext) {
                    // Get the value of the first column (Sid)
                    var sSid = oBindingContext.getProperty("Sid");
                    // Store the value in a variable
                    this._selectedSid = sSid;

                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    var sCustomerId = this._selectedSid;
                    oRouter.navTo("CustomSFD", { CustomerID: sCustomerId });

                }
            }
        });
    });