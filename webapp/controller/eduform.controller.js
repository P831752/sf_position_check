sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/date/UI5Date",
    "sap/m/library",
    "sap/m/upload/Uploader",
    "sap/ui/core/Item",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/MenuItem"
],
    function (Controller, Fragment, JSONModel, History, ODataModel, UI5Date, MobileLibrary, Uploader, Item, MessageToast, MessageBox, MenuItem) {
        "use strict";
                return Controller.extend("sfpositioncheck.controller.eduform", {

            _date : {
                "date" : UI5Date.getInstance()
            },

            onInit: function () {
                var oView = this.getView();
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //footer
                let oBeforeEditAcknowledgement = "Acknowledgement: I hereby declare that the existing information is true and correct.";

                var oObjectPage = this.getView().byId("ObjectPageLayout"),
                bCurrentShowFooterState = oObjectPage.getShowFooter();
                oObjectPage.setShowFooter(!bCurrentShowFooterState);
                oView.byId("idAcknowledgment").setText(oBeforeEditAcknowledgement);
               
                //buttons visibility - text changes
                oView.byId("submit").setText("Submit");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //oRouter.getRoute("OverView").attachPatternMatched(this._onRouteMatched, this);
                this._formFragments = {};
                
                // Set the initial form to be the display one
			    //this._showFormFragment("Display");

                var oModelDate = new JSONModel(this._date);
                this.getView().setModel(oModelDate,"oModelDate");

                var instnameModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/Institutionname.json"));
                this.getView().setModel(instnameModel, "instnameModel");

                var instnameModelG = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/Institution_Graduate.json"));
                this.getView().setModel(instnameModelG, "instnameModelG");

                var educerModel = new JSONModel();
                this.getView().setModel(educerModel, "educerModel");
                var educerModelG = new JSONModel();
                this.getView().setModel(educerModelG, "educerModelG");

                var sscboardModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/sscboard.json"));
                this.getView().setModel(sscboardModel, "sscboardModel");

                var quasubtypeModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/quasubtype.json"));
                this.getView().setModel(quasubtypeModel, "quasubtypeModel");

                var branchModelG = new JSONModel();
                this.getView().setModel(branchModelG, "branchModelG");

                var branchModel = new JSONModel();
                this.getView().setModel(branchModel, "branchModel");

                var univModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/universities.json"));
                this.getView().setModel(univModel, "univModel");

                var coursetypeModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/coursetype.json"));
                this.getView().setModel(coursetypeModel, "coursetypeModel");

                var durationModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/duration.json"));
                
                // durationModel.sort(function(a, b) {
                //     return b.text.localeCompare(a.text);
                // });
                this.getView().setModel(durationModel, "durationModel");

                var divisionModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/divison.json"));
                this.getView().setModel(divisionModel, "divisionModel");

                var gradeModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/grade.json"));
                this.getView().setModel(gradeModel, "gradeModel");

                var yearsModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/years.json"));
                this.getView().setModel(yearsModel, "yearsModel");

                var masterModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/master.json"));
                this.getView().setModel(masterModel, "masterModel");

                var graduateModel = new JSONModel(sap.ui.require.toUrl("sfpositioncheck/model/graduate.json"));
                this.getView().setModel(graduateModel, "graduateModel");
                //this.getView().bindElement("masterModel>/QualificationType/0/QualificationSubType")

                //repeat education
                var oDiplomaModel = new sap.ui.model.json.JSONModel({
                    Diploma: [
                        { id: "idDiploma1", title: "Diploma 1", qualification: "Diploma Certificate", certificate: "VIII STD", institution: "National Public School", year: "2000" },
                        { id: "idDiploma2", title: "Diploma 2", qualification: "Diploma", certificate: "XII STD", institution: "Technical College", year: "2005" }
                    ]
                });
                this.getView().setModel(oDiplomaModel, "oDiplomaModel");

                //Attachements
                var sPath = sap.ui.require.toUrl("sfpositioncheck/model/items.json");
                var oUploadSet = this.getView().byId("UploadSet");
                this.getView().setModel(new JSONModel(sPath));
                
                // Modify "add file" button
                /*oUploadSet.getDefaultFileUploader().setButtonOnly(false);
                oUploadSet.getDefaultFileUploader().setTooltip("");
                oUploadSet.getDefaultFileUploader().setIconOnly(true);
                oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
                oUploadSet.attachUploadCompleted(this.onUploadCompleted.bind(this));*/

                //screen height adjustments
                //oView.byId("sscAboveUniversity").setWidth("");
                // SSC
                //oView.byId("spaceYearPassingSSC").setWidth("10px");

                // For Graduation
                this.getView().byId("idGraduationTitle").setVisible(true); 
                // For Diploma
                this.getView().byId("idDiplomaTitle").setVisible(true); 
                // For Trade
                this.getView().byId("tradeHeadingText").setWidth("950px"); //920px
                this.getView().byId("idTradeTitle").setVisible(true); 
            },

            instnameChange(oEvent){
                var selectedKey = oEvent.getParameter("selectedItem").getKey();
                if (selectedKey === "zadd") {
                    this._openAddDialog();
                }
            },

            _openAddDialog: function () {
                if (!this._oDialog) {
                    this._oDialog = new sap.m.Dialog({
                        title: "Add New Item",
                        content: [
                            new sap.m.Input("newItemInput", { placeholder: "Enter new item" })
                        ],
                        beginButton: new sap.m.Button({
                            text: "Add",
                            press: () => {
                                var newItem = sap.ui.getCore().byId("newItemInput").getValue();
                                var oModel = this.getView().getModel("instnameModel");
                                var aItems = oModel.getProperty("/");
     
                                var bExists = aItems.some(function (item) {
                                    return item.text.toLowerCase() === newItem.toLowerCase();
                                });
     
                                if (!bExists && newItem) {
                                    aItems.push(
                                        {
                                            key: newItem,
                                            text: newItem
                                        });
                                    oModel.setProperty("/", aItems);
                                    this.byId("iInsName6").setSelectedKey(newItem);
                                    this._oDialog.close();
                                    sap.ui.getCore().byId("newItemInput").setValue()
                                } else{
                                    var msg = 'The Institute Name already exist is the list';
                                    sap.m.MessageToast.show(msg);
                                }                          
                            }
                        }),
                        endButton: new sap.m.Button({
                            text: "Cancel",
                            press: () => {
                                this._oDialog.close()
                                sap.ui.getCore().byId("newItemInput").setValue()
                            }
                        })
                    });
                    this.getView().addDependent(this._oDialog);
                }
                this._oDialog.open();
            },
     
            onTradeDelete1: function () { 
                this.getView().byId("opsTradeCertificate1").setVisible(false); 
                this.getView().byId("idTradeTitle").setVisible(true); 
                this.getView().byId("tradeHeadingText").setWidth("950px");
            },

            onTradeDelete: function () { 
                var that = this;
                MessageBox.confirm("Are you sure you want to Delete the Trade Certificate ?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            //MessageToast.show("Action selected: " + sAction);
                            if (sAction != "OK") {
                                //oBusyDialog.close();
                                return;
                            } else {
                                that.getView().byId("opsTradeCertificate").setVisible(false); 
                            }
                        },                    
                });                    
            },

            onTradeReset: function () { 
                var oView = this.getView();

                oView.byId("idTradeAttachements").setVisible(false); 
                oView.byId("opsTradeCertificate1").setVisible(false); 

                oView.byId("idTradeTitle").setVisible(true); 

                oView.byId("opsSubTradeCertificate").setTitle("");
                oView.byId("tradeHeadingText").setWidth("950px");

                oView.byId("tQuaSubtype3").setVisible(true);
                oView.byId("tEduCer3").setVisible(true);
                oView.byId("tBranch13").setVisible(true);
                oView.byId("tBranch23").setVisible(true);
                oView.byId("tInsName3").setVisible(true);
                oView.byId("tUnivName3").setVisible(true);
                oView.byId("tCourseType3").setVisible(true);
                oView.byId("tYear3").setVisible(true);
                oView.byId("tStartDate3").setVisible(true);
                oView.byId("tEndDate3").setVisible(true);
                oView.byId("tDuration3").setVisible(true);
                oView.byId("tPercentage3").setVisible(true);
                oView.byId("tCGPA3").setVisible(true);
                oView.byId("tDivision3").setVisible(true);
                oView.byId("tGrade3").setVisible(true);

                oView.byId("iQuaSubtype3").setVisible(false);
                oView.byId("iEduCer3").setVisible(false);
                oView.byId("iBranch13").setVisible(false);
                oView.byId("iBranch23").setVisible(false);
                oView.byId("iInsName3").setVisible(false);
                oView.byId("iUnivName3").setVisible(false);
                oView.byId("iCourseType3").setVisible(false);
                oView.byId("iYear3").setVisible(false);
                oView.byId("iStartDate3").setVisible(false);
                oView.byId("iEndDate3").setVisible(false);
                oView.byId("iDuration3").setVisible(false);
                oView.byId("iPercentage3").setVisible(false);
                oView.byId("iCGPA3").setVisible(false);
                oView.byId("iDivision3").setVisible(false);
                oView.byId("iGrade3").setVisible(false);
            },

            onDiplomaReset: function () { 
                var oView = this.getView();

                oView.byId("opsDiplomaAttach").setVisible(false); 
                oView.byId("idDiplomaTitle").setVisible(true); 

                oView.byId("tQuaSubtype4").setVisible(true);
                oView.byId("tEduCer4").setVisible(true);
                oView.byId("tBranch14").setVisible(true);
                oView.byId("tBranch24").setVisible(true);
                oView.byId("tInsName4").setVisible(true);
                oView.byId("tUnivName4").setVisible(true);
                oView.byId("tCourseType4").setVisible(true);
                oView.byId("tYear4").setVisible(true);
                oView.byId("tStartDate4").setVisible(true);
                oView.byId("tEndDate4").setVisible(true);
                oView.byId("tDuration4").setVisible(true);
                oView.byId("tPercentage4").setVisible(true);
                oView.byId("tCGPA4").setVisible(true);
                oView.byId("tDivision4").setVisible(true);
                oView.byId("tGrade4").setVisible(true);

                oView.byId("iQuaSubtype4").setVisible(false);
                oView.byId("iEduCer4").setVisible(false);
                oView.byId("iBranch14").setVisible(false);
                oView.byId("iBranch24").setVisible(false);
                oView.byId("iInsName4").setVisible(false);
                oView.byId("iUnivName4").setVisible(false);
                oView.byId("iCourseType4").setVisible(false);
                oView.byId("iYear4").setVisible(false);
                oView.byId("iStartDate4").setVisible(false);
                oView.byId("iEndDate4").setVisible(false);
                oView.byId("iDuration4").setVisible(false);
                oView.byId("iPercentage4").setVisible(false);
                oView.byId("iCGPA4").setVisible(false);
                oView.byId("iDivision4").setVisible(false);
                oView.byId("iGrade4").setVisible(false);
            },

            onGraduationReset: function () { 
                var oView = this.getView();

                oView.byId("opsGraduationAttach").setVisible(false);
                oView.byId("opsGraduation2").setVisible(false);
                oView.byId("idGraduationTitle").setVisible(true);

                oView.byId("tQuaSubtype5").setVisible(true);
                oView.byId("tEduCer5").setVisible(true);
                oView.byId("tBranch15").setVisible(true);
                oView.byId("tBranch25").setVisible(true);
                oView.byId("tInsName5").setVisible(true);
                oView.byId("tUnivName5").setVisible(true);
                oView.byId("tCourseType5").setVisible(true);
                oView.byId("tYear5").setVisible(true);
                //oView.byId("tStartDate5").setVisible(true);
                //oView.byId("tEndDate5").setVisible(true);
                oView.byId("tDuration5").setVisible(true);
                oView.byId("tPercentage5").setVisible(true);
                oView.byId("tCGPA5").setVisible(true);
                oView.byId("tDivision5").setVisible(true);
                oView.byId("tGrade5").setVisible(true);

                oView.byId("iQuaSubtype5").setVisible(false);
                oView.byId("iEduCer5").setVisible(false);
                oView.byId("iBranch15").setVisible(false);
                oView.byId("iBranch25").setVisible(false);
                oView.byId("iInsName5").setVisible(false);
                oView.byId("iUnivName5").setVisible(false);
                oView.byId("iCourseType5").setVisible(false);
                oView.byId("iYear5").setVisible(false);
                //oView.byId("iStartDate5").setVisible(false);
                //oView.byId("iEndDate5").setVisible(false);
                oView.byId("iDuration5").setVisible(false);
                oView.byId("iPercentage5").setVisible(false);
                oView.byId("iCGPA5").setVisible(false);
                oView.byId("iDivision5").setVisible(false);
                oView.byId("iGrade5").setVisible(false);
            },

            onGraduationAdd: function () { 
                var that = this;
                MessageBox.confirm("Do you want to add one more qualification under Graduation Category?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            //MessageToast.show("Action selected: " + sAction);
                            if (sAction != "OK") {
                                //oBusyDialog.close();
                                return;
                            } else {
                                that.getView().byId("idGraduationTitle").setVisible(false); 
                                that.getView().byId("opsSubGraduate").setTitle("Graduate 1");

                                that.getView().byId("opsGraduation2").setVisible(true); 
                                that.getView().byId("opsGraduationAttach").setVisible(false); 
                            }
                        },                    
                });                    
            },

            onMastersAdd: function () { 
                   
            },

            onGraduationDelete1: function () { 
                this.getView().byId("idGraduationTitle").setVisible(true);   
                this.getView().byId("opsGraduation2").setVisible(false); 
                this.getView().byId("opsGraduationAttach").setVisible(false);                    
            },

            onPressAddEducation: function () { 
                var oView = this.getView(),
					oButton = oView.byId("addEducation");
                if (!this._oMenuFragment) {
                    this._oMenuFragment = Fragment.load({
						id: oView.getId(),
						name: "sfpositioncheck.view.Education",
						controller: this
					}).then(function(oMenu) {
						oMenu.openBy(oButton);
						this._oMenuFragment = oMenu;
						return this._oMenuFragment;
					}.bind(this));
                } else {
                    this._oMenuFragment.openBy(oButton);
                }
            },

            onMenuAction: function(oEvent) {
				var oItem = oEvent.getParameter("item"),
					sItemPath = "";
                var that = this;

				while (oItem instanceof MenuItem) {
					sItemPath = oItem.getText() + " > " + sItemPath;
					oItem = oItem.getParent();
				}

				sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));
				MessageToast.show("Action triggered on item: " + sItemPath);

                let oConfirmMsg ="Do you want to add new qualification under ";

                if (sItemPath == "Masters") {
                    oConfirmMsg = oConfirmMsg+sItemPath+" Category ?";
                    MessageBox.confirm(oConfirmMsg, {
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                //MessageToast.show("Action selected: " + sAction);
                                if (sAction != "OK") {
                                    //oBusyDialog.close();
                                    return;
                                } else {
                                    that.getView().byId("opsMasters").setVisible(true); 
                                }
                            },                    
                        });                    
                } else if (sItemPath == "Trade Certificate") {             
                    oConfirmMsg = oConfirmMsg+sItemPath+" educational certificate ?";
                    MessageBox.confirm(oConfirmMsg, {
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                //MessageToast.show("Action selected: " + sAction);
                                if (sAction != "OK") {
                                    //oBusyDialog.close();
                                    return;
                                } else {
                                    that.getView().byId("opsTradeCertificate").setVisible(true); 
                                }
                            },                    
                        });  
                } else if (sItemPath == "Diploma") {             
                    oConfirmMsg = oConfirmMsg+sItemPath+" educational certificate ?";
                    MessageBox.confirm(oConfirmMsg, {
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                //MessageToast.show("Action selected: " + sAction);
                                if (sAction != "OK") {
                                    //oBusyDialog.close();
                                    return;
                                } else {
                                    that.getView().byId("opsDiploma").setVisible(true); 
                                }
                            },                    
                        });  
                }                  
			},
            //Save as Draft
            onSave: function () { 
                MessageBox.information("Data Saved Successfully.\n\n Please verify and select Submit Approval button for verification.");
            },

            onSubmit: function () {

                let oCheckbox = this.byId("idAcknowledgment");
                let isAcknowledgeSelected = oCheckbox.getSelected();

                if (isAcknowledgeSelected) {                    
                } else {
                    //MessageToast.show("Not Selected");
                    MessageBox.warning("Please select the Acknowledgement checkbox.");
                    return;
                }
                
                let isCancelVisible = this.byId('cancel').getVisible();
                let oConfirmMsg ="Please ensure correctness of all education data & attachments before submitting for approval.";
                // if (isCancelVisible) {
                //     //oConfirmMsg = "Are You Sure!\n\n All modified data Please verify all educational sections before Submit for Approval.";
                //     oConfirmMsg = "Please ensure correctness of all education data & attachments before submitting for approval.";
                // } else {
                //     oConfirmMsg = "Please ensure to have validated all existing education data for correctness before submission for approval.";
                // }
                
                //validation
                let oPercentage1 = this.byId("iPercentage1").getValue();
                if (oPercentage1 < 0 || oPercentage1 > 100) {
                    MessageBox.warning("Please enter the percentage value between 0 - 100.");
                    return;
                } else {  
                }

                let  oCGPA1= this.byId("iCGPA1").getValue();
                if (oCGPA1 < 0 || oCGPA1 > 10) {
                    MessageBox.warning("Please enter the CGPA value between 0 - 10.");
                    return;
                } else {
                }

                //validation End
                let oSubmitText = this.byId("submit").getText();
                if (oSubmitText == "Submit") {
                    MessageBox.success("Thanks for your confirmation.");
                } else {
                    MessageBox.confirm(oConfirmMsg, {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                       emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            //MessageToast.show("Action selected: " + sAction);
                            if (sAction != "OK") {
                                return;
                            } else {
                                MessageBox.success("Education details have been sent for approval.");
                            }
                    },                    
                });
                }

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

            onMediaTypeMismatch: function (oEvent) {
                    // var aMismatchedFiles = oEvent.getParameter("files");
                    // var sMessage = "Only PDF files are allowed. The following files are not supported:\n";
                
                    // aMismatchedFiles.forEach(function (file) {
                    //     sMessage += "- " + file.name + "\n";
                    // });
                
                    MessageBox.warning("Only PDF files are allowed");
                },
                
        
            onBeforeUploadStartsG: function (oEvent) {
/*                // var oFile = oEvent.getParameter("file");
                // var sMimeType = oFile.type;
            
                // if (sMimeType !== "applicatiojin/pdf") {
                //     MessageToast.show("Only PDF files are allowed.");
                //     oEvent.preventDefault(); // Cancel the upload
                //      return;
                // }
                const oItem = oEvent.getParameter("item");
                const fileObject = oItem.getFileObject();
                const fileName = fileObject.name;
                const fileExtension = fileName.split('.').pop().toLowerCase();

                var iMaxSizeKB = 200;

                if (fileExtension == "pdf") {
                    if (fileObject.size > 204800) { // 200 KB in bytes
                        //MessageBox.error("File size exceeds the 200 KB limit.");
                        //oEvent.preventDefault();
                        //this._removeFileFromUploadSet(fileName);
                        //return;
                    }
                }   */         
            },

            _removeFileFromUploadSet : function (fileName) {
                var oUploadSet = this.getView().byId("uploadSet1"),
                aItems = oUploadSet.getItems();

                aItems.forEach(function (item) {
                    if (item.getFileName() === fileName) 
                        oUploadSet.removeItem(item);
                });
            },

            onFileSizeExceeded: function (oEvent) {
                MessageBox.warning("File size exceeds the 200 KB limit.");
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
              
              onTradeAdd: function () { 
                let oView = this.getView();
                
                oView.byId("opsTradeCertificate1").setVisible(true);
                oView.byId("idTradeTitle").setVisible(false);

                oView.byId("opsSubTradeCertificate").setTitle("Trade Certificate 1");
                oView.byId("tradeHeadingText").setWidth("920px");

                /*var aSubsections = [
                    { title: "Trade 2", content: "Content for Trade 2" },                    
                ];            
                var oSection = this.byId("opsTradeCertificate");
            
                aSubsections.forEach(function (item, index) {
                    var oSubSection = new sap.uxap.ObjectPageSubSection({
                        title: item.title,
                        blocks: [
                            new sap.m.Text({
                                text: item.content
                            })
                        ]
                    });            
                    oSection.addSubSection(oSubSection);
                }); */                
            },
            onDeleteTrade: function () { 
                let oView = this.getView();

                oView.byId("idTradeCertificate1").setVisible(false);
            },

            onSSCEdit: function(){
                let oView = this.getView();

                let oAfterEditAcknowledgement = "Acknowledgement: I hereby declare that all modified information provided is true and correct.";

                var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
			    oObjectPage.setShowFooter(bCurrentShowFooterState);
                oView.byId("idAcknowledgment").setText(oAfterEditAcknowledgement);

                //attachements
                oView.byId("idSSCAttachements").setVisible(true);

                //screen adjustments
                //oView.byId("spaceYearPassingSSC").setVisible(false);
                oView.byId("iYear2").addStyleClass("sapUiTinyMarginBottom");
                // oView.byId("iYear1").addStyleClass("sapUiSmallMarginBottom");
                // oView.byId("iYear1").addStyleClass("heightadjust");
                //oView.byId("iYear1").addStyleClass("sapUiTinyMarginBottom");
                //oView.byId("iYear2").addStyleClass("sapUiTinyMarginBottom");
                //oView.byId("sscCourseLabel").addStyleClass("sapUiTinyMarginTop");
                oView.byId("tEduCer1").addStyleClass("sapUiTinyMarginBottom");               

                //buttons visibility - Text changes
                oView.byId("submit").setText("Submit for Approval");
                oView.byId("save").setVisible(true);
                oView.byId("edit").setVisible(false);

                //SSC - field type changes
                // let oFormSSC = this.byId("SSCboxID");
                
                //oView.byId("tEduCer1").setVisible(false);
                oView.byId("tDuration1").setVisible(false);
                oView.byId("tInsName1").setVisible(false);
                oView.byId("tPercentage1").setVisible(false);
                oView.byId("tUnivName1").setVisible(false);
                oView.byId("tCGPA1").setVisible(false);
                oView.byId("tYear1").setVisible(false);
                oView.byId("tDivision1").setVisible(false);
                oView.byId("tCourseType1").setVisible(false);
                oView.byId("tGrade1").setVisible(false);

                //oView.byId("iEduCer1").setVisible(true);
                oView.byId("iDuration1").setVisible(true);
                oView.byId("iInsName1").setVisible(true);
                oView.byId("iPercentage1").setVisible(true);
                oView.byId("iUnivName1").setVisible(true);
                oView.byId("iCGPA1").setVisible(true);
                oView.byId("iYear1").setVisible(true);
                oView.byId("iDivision1").setVisible(true);
                oView.byId("iCourseType1").setVisible(true);
                oView.byId("iGrade1").setVisible(true);

                oView.byId("iInsName1").setValue("Pandit Deendayal Petroleum University");
                oView.byId("iUnivName1").setValue("B S E B  Patna");
                oView.byId("iYear1").setValue("2001");
                oView.byId("iCourseType1").setValue("Full Time");
                oView.byId("iDuration1").setValue("12");
                oView.byId("iPercentage1").setValue("70.68");
                oView.byId("iCGPA1").setValue("");
                oView.byId("iDivision1").setValue("");
                oView.byId("iGrade1").setValue("");
            },

            onGraduationEdit: function() {
                let oView = this.getView();

                let oAfterEditAcknowledgement = "Acknowledgement: I hereby declare that all modified information provided is true and correct.";

                var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
			    oObjectPage.setShowFooter(bCurrentShowFooterState);
                oView.byId("idAcknowledgment").setText(oAfterEditAcknowledgement);
                
                oView.byId("opsGraduationAttach").setVisible(true);
                //oView.byId("idGraduationTitle").setVisible(false); 
                //screen adjustments
                /*oView.byId("spaceYearPassingSSC").setVisible(false);
                oView.byId("spaceYearPassingHSC").setVisible(false);
                oView.byId("iYear1").addStyleClass("sapUiTinyMarginBottom");
                oView.byId("iYear2").addStyleClass("sapUiTinyMarginBottom");*/
                
                //buttons visibility - Text changes
                oView.byId("submit").setText("Submit for Approval");
                oView.byId("save").setVisible(true);
                oView.byId("edit").setVisible(false);

                //call combox oEvent
                this.handleSelectionChangeG1();

                //SSC - field type changes
                // let oFormSSC = this.byId("SSCboxID");
                
                oView.byId("tQuaSubtype5").setVisible(false);
                oView.byId("tEduCer5").setVisible(false);
                oView.byId("tBranch15").setVisible(false);
                oView.byId("tBranch25").setVisible(false);
                oView.byId("tYear5").setVisible(false);                
                oView.byId("tInsName5").setVisible(false);
                oView.byId("tUnivName5").setVisible(false);
                oView.byId("tCourseType5").setVisible(false);                
                oView.byId("tDuration5").setVisible(false);
                oView.byId("tPercentage5").setVisible(false);
                oView.byId("tCGPA5").setVisible(false);
                oView.byId("tDivision5").setVisible(false);
                oView.byId("tGrade5").setVisible(false);
                              
                oView.byId("iQuaSubtype5").setVisible(true);
                oView.byId("iEduCer5").setVisible(true);
                oView.byId("iBranch15").setVisible(true);
                oView.byId("iBranch25").setVisible(true);
                oView.byId("iYear5").setVisible(true);                
                oView.byId("iInsName5").setVisible(true);
                oView.byId("iUnivName5").setVisible(true);
                oView.byId("iCourseType5").setVisible(true);                
                oView.byId("iDuration5").setVisible(true);
                oView.byId("iPercentage5").setVisible(true);
                oView.byId("iCGPA5").setVisible(true);
                oView.byId("iDivision5").setVisible(true);
                oView.byId("iGrade5").setVisible(true);

                //set existing values in drop-down list
                oView.byId("iQuaSubtype5").setValue("Engineering");
                oView.byId("iEduCer5").setValue("Bachelor of Technology (BTech)");
                oView.byId("iBranch15").setValue("Electronics & Instrumentation"); 
                oView.byId("iBranch25").setValue("Electronics");                
                oView.byId("iInsName5").setValue("Pandit Deendayal Petroleum University");
                oView.byId("iUnivName5").setValue("Maulana Abul Kalam Azad University of Technology, West Bengal");
                oView.byId("iYear5").setValue("2009");
                oView.byId("iCourseType5").setValue("Full Time");
                oView.byId("iDuration5").setValue("48");
                oView.byId("iPercentage5").setValue("");
                oView.byId("iCGPA5").setValue("8.67");
                oView.byId("iDivision5").setValue("");
                oView.byId("iGrade5").setValue("");
            },
            
            onDiplomaEdit: function() {
                let oView = this.getView();

                let oAfterEditAcknowledgement = "Acknowledgement: I hereby declare that all modified information provided is true and correct.";

                var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
			    oObjectPage.setShowFooter(bCurrentShowFooterState);
                oView.byId("idAcknowledgment").setText(oAfterEditAcknowledgement);
                
                oView.byId("opsDiplomaAttach").setVisible(true);
                oView.byId("idDiplomaTitle").setVisible(false); 
                //screen adjustments
                /*oView.byId("spaceYearPassingSSC").setVisible(false);
                oView.byId("spaceYearPassingHSC").setVisible(false);
                oView.byId("iYear1").addStyleClass("sapUiTinyMarginBottom");
                oView.byId("iYear2").addStyleClass("sapUiTinyMarginBottom");*/
                
                //buttons visibility - Text changes
                oView.byId("submit").setText("Submit for Approval");
                oView.byId("save").setVisible(true);
                oView.byId("edit").setVisible(false);

                //SSC - field type changes
                // let oFormSSC = this.byId("SSCboxID");
                
                //oView.byId("tQuaSubtype5").setVisible(false);
                //oView.byId("tEduCer5").setVisible(false);
                //oView.byId("tBranch15").setVisible(false);
                //oView.byId("tBranch25").setVisible(false);
                oView.byId("tInsName4").setVisible(false);
                oView.byId("tUnivName4").setVisible(false);
                oView.byId("tCourseType4").setVisible(false);
                oView.byId("tYear4").setVisible(false);
                oView.byId("tStartDate4").setVisible(false);
                oView.byId("tEndDate4").setVisible(false);
                oView.byId("tDuration4").setVisible(false);
                oView.byId("tPercentage4").setVisible(false);
                oView.byId("tCGPA4").setVisible(false);
                oView.byId("tDivision4").setVisible(false);
                oView.byId("tGrade4").setVisible(false);
                              
                //oView.byId("iQuaSubtype5").setVisible(true);
                //oView.byId("iEduCer5").setVisible(true);
                //oView.byId("iBranch15").setVisible(true);
                //oView.byId("iBranch25").setVisible(true);
                oView.byId("iInsName4").setVisible(true);
                oView.byId("iUnivName4").setVisible(true);
                oView.byId("iCourseType4").setVisible(true);
                oView.byId("iYear4").setVisible(true);
                oView.byId("iStartDate4").setVisible(true);
                oView.byId("iEndDate4").setVisible(true);
                oView.byId("iDuration4").setVisible(true);
                oView.byId("iPercentage4").setVisible(true);
                oView.byId("iCGPA4").setVisible(true);
                oView.byId("iDivision4").setVisible(true);
                oView.byId("iGrade4").setVisible(true);

                //set existing values in drop-down list
                //oView.byId("iQuaSubtype5").setValue("Standard or Class 10 and less");
                //oView.byId("iEduCer5").setValue("None");
                //oView.byId("iBranch15").setValue("None"); 
                //oView.byId("iBranch25").setValue("None");                
                oView.byId("iInsName4").setValue("Kendriya Vidyalaya");
                oView.byId("iUnivName4").setValue("Karnataka Board");
                oView.byId("iYear4").setValue("2000");
                oView.byId("iCourseType4").setValue("Full Time");
                oView.byId("iDuration4").setValue("12");
                oView.byId("iPercentage4").setValue("70.68");
                oView.byId("iCGPA4").setValue("8.45");
                oView.byId("iDivision4").setValue("Ist Class");
                oView.byId("iGrade5").setValue("A+");
            },

            onDownloadPDF: function(){ 
                //this.oRouter.navTo("DownloadView");
                //var oRouter = this.getOwnerComponent().getRouter();
                var sNewHash = this.oRouter.getURL("DownloadView");
                var sNewURL = window.location.href.split("#")[0] + "#" + sNewHash;
                sap.m.URLHelper.redirect(sNewURL, true);
            },
            onSSCReset: function(){
                let oView = this.getView();
                
                let oBeforeEditAcknowledgement = "Acknowledgement: I hereby declare that the existing information is true and correct.";
                var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
			    oObjectPage.setShowFooter(bCurrentShowFooterState);
                oView.byId("idAcknowledgment").setText(oBeforeEditAcknowledgement);
                oView.byId("idAcknowledgment").setSelected(false);

                //screen adjustments
                //oView.byId("spaceYearPassingSSC").setVisible(true);
                //oView.byId("spaceYearPassingHSC").setVisible(true);
                // oView.byId("iYear1").addStyleClass("sapUiSmallMarginBottom");
                // oView.byId("iYear1").addStyleClass("heightadjust");
                oView.byId("iYear1").removeStyleClass("sapUiTinyMarginBottom");
                oView.byId("iYear2").removeStyleClass("sapUiTinyMarginBottom");
                oView.byId("tEduCer1").removeStyleClass("sapUiTinyMarginBottom") 
                
                //attachments
                oView.byId("idSSCAttachements").setVisible(false);

                oView.byId("tEduCer1").setVisible(true);
                oView.byId("tDuration1").setVisible(true);
                oView.byId("tInsName1").setVisible(true);
                oView.byId("tPercentage1").setVisible(true);
                oView.byId("tUnivName1").setVisible(true);
                oView.byId("tCGPA1").setVisible(true);
                oView.byId("tYear1").setVisible(true);
                oView.byId("tDivision1").setVisible(true);
                oView.byId("tCourseType1").setVisible(true);
                oView.byId("tGrade1").setVisible(true);

                oView.byId("iEduCer1").setVisible(false);
                oView.byId("iDuration1").setVisible(false);
                oView.byId("iInsName1").setVisible(false);
                oView.byId("iPercentage1").setVisible(false);
                oView.byId("iUnivName1").setVisible(false);
                oView.byId("iCGPA1").setVisible(false);
                oView.byId("iYear1").setVisible(false);
                oView.byId("iDivision1").setVisible(false);
                oView.byId("iCourseType1").setVisible(false);
                oView.byId("iGrade1").setVisible(false);
            },

            onDiplomaDelete: function () {
                var that = this;
                MessageBox.confirm("Are you sure you want to Delete the Diploma Certificate ?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            //MessageToast.show("Action selected: " + sAction);
                            if (sAction != "OK") {
                                //oBusyDialog.close();
                                return;
                            } else {
                                that.getView().byId("opsDiploma").setVisible(false); 
                            }
                        },                    
                }); 
            },

            onMastersDelete: function () {
                this.getView().byId("opsMasters").setVisible(false); 
            },

            onEdit: function () {
                let oView = this.getView();

                let oAfterEditAcknowledgement = "Acknowledgement: I hereby declare that all modified information provided is true and correct.";

                var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
			    oObjectPage.setShowFooter(bCurrentShowFooterState);
                oView.byId("idAcknowledgment").setText(oAfterEditAcknowledgement);

                //screen adjustments
                oView.byId("spaceYearPassingSSC").setVisible(false);
                oView.byId("spaceYearPassingHSC").setVisible(false);
                // oView.byId("iYear1").addStyleClass("sapUiSmallMarginBottom");
                // oView.byId("iYear1").addStyleClass("heightadjust");
                oView.byId("iYear1").addStyleClass("sapUiTinyMarginBottom");
                oView.byId("iYear2").addStyleClass("sapUiTinyMarginBottom");
                
                //buttons visibility - Text changes
                oView.byId("submit").setText("Submit for Approval");
                oView.byId("cancel").setVisible(true);
                oView.byId("addTrade").setVisible(true);
                oView.byId("save").setVisible(true);
                oView.byId("edit").setVisible(false);

                //SSC - field type changes
                // let oFormSSC = this.byId("SSCboxID");
                // oFormSSC.sete
                
                //oView.byId("tQuaSubtype1").setVisible(false);
                //oView.byId("tEduCer1").setVisible(false);
                //oView.byId("tBranch11").setVisible(false);
                //oView.byId("tBranch21").setVisible(false);
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
                              
                //oView.byId("iQuaSubtype1").setVisible(true);
                //oView.byId("iEduCer1").setVisible(true);
                //oView.byId("iBranch11").setVisible(true);
                //oView.byId("iBranch21").setVisible(true);
                oView.byId("iInsName1").setVisible(true);
                oView.byId("iUnivName1").setVisible(true);
                oView.byId("iCourseType1").setVisible(true);
                oView.byId("iYear1").setVisible(true);
                oView.byId("iStartDate1").setVisible(true);
                oView.byId("iEndDate1").setVisible(true);
                oView.byId("iDuration1").setVisible(true);
                oView.byId("iPercentage1").setVisible(true);
                oView.byId("iCGPA1").setVisible(true);
                oView.byId("iDivision1").setVisible(true);
                oView.byId("iGrade1").setVisible(true);

                //set existing values in drop-down list
                //oView.byId("iQuaSubtype1").setValue("Standard or Class 10 and less");
                //oView.byId("iEduCer1").setValue("None");
                //oView.byId("iBranch11").setValue("None"); 
                //oView.byId("iBranch21").setValue("None");                
                oView.byId("iInsName1").setValue("Kendriya Vidyalaya");
                oView.byId("iUnivName1").setValue("Karnataka Board");
                oView.byId("iYear1").setValue("2000");
                oView.byId("iCourseType1").setValue("Full Time");
                oView.byId("iDuration1").setValue("12");
                oView.byId("iPercentage1").setValue("70.68");
                oView.byId("iCGPA1").setValue("8.45");
                oView.byId("iDivision1").setValue("Ist Class");
                oView.byId("iGrade1").setValue("A");
                
                //HSC - field type changes
                 //oView.byId("tQuaSubtype2").setVisible(false);
                 //oView.byId("tEduCer2").setVisible(false);
                 //oView.byId("tBranch12").setVisible(false);
                 //oView.byId("tBranch22").setVisible(false);
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
                  
                //oView.byId("iQuaSubtype2").setVisible(true);
                //oView.byId("iEduCer2").setVisible(true);
                //oView.byId("iBranch12").setVisible(true);
                //oView.byId("iBranch22").setVisible(true);
                oView.byId("iInsName2").setVisible(true);
                oView.byId("iUnivName2").setVisible(true);
                oView.byId("iCourseType2").setVisible(true);
                oView.byId("iYear2").setVisible(true);
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
                oView.byId("iBranch12").setValue("None"); 
                oView.byId("iBranch22").setValue("None");                
                oView.byId("iInsName2").setValue("Kendriya Vidyalaya");
                oView.byId("iUnivName2").setValue("MAHARASHTRA STATE BOARD OF SECONDARY & HIGHER SECONDARY EDUCATION");
                oView.byId("iYear2").setValue("2002");
                oView.byId("iCourseType2").setValue("Full Time");
                oView.byId("iDuration2").setValue("24");
                oView.byId("iPercentage2").setValue("63.7");
                oView.byId("iCGPA2").setValue("");
                oView.byId("iDivision2").setValue("");
                oView.byId("iGrade2").setValue("");
            },

            onTradeEdit: function () { 

                this.getView().byId("tInsName3").setVisible(false);
                this.getView().byId("tUnivName3").setVisible(false);
                this.getView().byId("tCourseType3").setVisible(false);
                this.getView().byId("tYear3").setVisible(false);

                this.getView().byId("idTradeAttachements").setVisible(true);    

                this.getView().byId("iInsName3").setVisible(true);
                this.getView().byId("iUnivName3").setVisible(true);
                this.getView().byId("iCourseType3").setVisible(true);
                this.getView().byId("iYear3").setVisible(true);
            },

            onCancel: function () {
                let oView = this.getView();
                
                let oBeforeEditAcknowledgement = "Acknowledgement: I hereby declare that the existing information is true and correct.";
                var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
			    oObjectPage.setShowFooter(bCurrentShowFooterState);
                oView.byId("idAcknowledgment").setText(oBeforeEditAcknowledgement);
                oView.byId("idAcknowledgment").setSelected(false);

                //screen adjustments
                oView.byId("spaceYearPassingSSC").setVisible(true);
                oView.byId("spaceYearPassingHSC").setVisible(true);
                // oView.byId("iYear1").addStyleClass("sapUiSmallMarginBottom");
                // oView.byId("iYear1").addStyleClass("heightadjust");
                oView.byId("iYear1").removeStyleClass("sapUiTinyMarginBottom");
                oView.byId("iYear2").removeStyleClass("sapUiTinyMarginBottom");

                //buttons visibility - Text changes
                oView.byId("submit").setText("Submit");
                oView.byId("edit").setVisible(true);                
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

                //Trade
                oView.byId("idTradeAttachements").setVisible(false);
                oView.byId("idTradeCertificate1").setVisible(false);
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
            },

            handleSelectionChange: function (oEvent) { 
                var selectedKey = oEvent.getParameter("selectedItem").getKey();
                var oModel = this.getView().getModel("masterModel")
                var allItems = oModel.getProperty("/QualificationType/0/QualificationSubType")
             
                // Filter items based on selected category
                var eduCertiItems, branchItems
                allItems.filter(function(item) {
                    if(item.ExternalCode === selectedKey){
                        eduCertiItems = item.EducationCertificate
                        branchItems = item.Branch
                    }
                });              
                this.getView().getModel("educerModel").setData(eduCertiItems);
                this.getView().getModel("branchModel").setData(branchItems); 

                this.byId("iEduCer6").setSelectedKey()
                this.byId("iBranch16").setSelectedKey()
                this.byId("iBranch26").setSelectedKey()
            },

            handleSelectionChangeG: function (oEvent) { 
                var selectedKey = oEvent.getParameter("selectedItem").getKey();
                var oModel = this.getView().getModel("graduateModel")
                var allItems = oModel.getProperty("/QualificationType/0/QualificationSubType")
             
                // Filter items based on selected category
                var eduCertiItems, branchItems
                allItems.filter(function(item) {
                    if(item.ExternalCode === selectedKey){
                        eduCertiItems = item.EducationCertificate
                        branchItems = item.Branch
                    }
                });              
                this.getView().getModel("educerModelG").setData(eduCertiItems);
                this.getView().getModel("branchModelG").setData(branchItems); 

                this.byId("iEduCer5").setSelectedKey()
                this.byId("iBranch15").setSelectedKey()
                this.byId("iBranch25").setSelectedKey()
            },

            handleSelectionChangeG1: function () { 
                var selectedKey = "Q06E";//oEvent.getParameter("selectedItem").getKey();
                var oModel = this.getView().getModel("graduateModel")
                var allItems = oModel.getProperty("/QualificationType/0/QualificationSubType")
             
                // Filter items based on selected category
                var eduCertiItems, branchItems
                allItems.filter(function(item) {
                    if(item.ExternalCode === selectedKey){
                        eduCertiItems = item.EducationCertificate
                        branchItems = item.Branch
                    }
                });              
                this.getView().getModel("educerModelG").setData(eduCertiItems);
                this.getView().getModel("branchModelG").setData(branchItems); 

                this.byId("iEduCer5").setSelectedKey()
                this.byId("iBranch15").setSelectedKey()
                this.byId("iBranch25").setSelectedKey()
            },
        });
    });