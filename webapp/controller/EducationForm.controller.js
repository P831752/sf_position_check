sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Select",
    "sap/ui/core/Item",
    "sap/m/DatePicker",
    "sap/m/Button",
    "sap/m/Panel"
  ], function(Controller, JSONModel, Label, Input, Select, Item, DatePicker, Button, Panel) {
    "use strict";
  
    return Controller.extend("sfpositioncheck.controller.EducationForm", {
      onInit: function () {
        this.oModel = new JSONModel({ qualifications: [] });
        this.getView().setModel(this.oModel);
      },
  
      onAddQualification: function () {
        var container = this.byId("educationContainer");
        var index = this.oModel.getProperty("/qualifications").length;
  
        // Add new qualification object to the model
        this.oModel.getProperty("/qualifications").push({
          level: "",
          institute: "",
          board: "",
          percentage: "",
          year: null
        });
        this.oModel.refresh();
  
        var panel = new Panel({
          headerText: "Qualification " + (index + 1),
          expandable: true,
          expanded: true,
          content: [
            new Label({ text: "Level" }),
            new Select({
              selectedKey: "{/qualifications/" + index + "/level}",
              items: [
                new Item({ key: "10th", text: "10th (SSC)" }),
                new Item({ key: "12th", text: "12th (HSC)" }),
                new Item({ key: "UG", text: "Graduation" }),
                new Item({ key: "PG", text: "Post-Graduation" }),
                new Item({ key: "Other", text: "Other" })
              ]
            }),
  
            new Label({ text: "Institute Name" }),
            new Input({ value: "{/qualifications/" + index + "/institute}" }),
  
            new Label({ text: "Board/University" }),
            new Input({ value: "{/qualifications/" + index + "/board}" }),
  
            new Label({ text: "Percentage/CGPA" }),
            new Input({ value: "{/qualifications/" + index + "/percentage}" }),
  
            new Label({ text: "Year of Completion" }),
            new DatePicker({
              value: "{/qualifications/" + index + "/year}",
              displayFormat: "yyyy",
              valueFormat: "yyyy"
            }),
  
            new Button({
              text: "Remove",
              type: "Reject",
              icon: "sap-icon://delete",
              press: this.onRemoveQualification.bind(this, index)
            })
          ]
        });
  
        container.addItem(panel);
      },
  
      onRemoveQualification: function (index) {
        var qualifications = this.oModel.getProperty("/qualifications");
        qualifications.splice(index, 1);
        this.oModel.setProperty("/qualifications", qualifications);
  
        // Re-render all qualification panels
        var container = this.byId("educationContainer");
        container.removeAllItems();
  
        for (var i = 0; i < qualifications.length; i++) {
          this.onAddQualification(); // re-create each entry
        }
      }
    });
  });
  