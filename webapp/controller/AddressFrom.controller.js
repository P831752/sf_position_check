sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Select",
    "sap/ui/core/Item",
    "sap/m/Button",
    "sap/m/Panel"
  ], function(Controller, JSONModel, Label, Input, Select, Item, Button, Panel) {
    "use strict";
  
    return Controller.extend("sfpositioncheck.controller.AddressForm", {
      onInit: function () {
        this.oModel = new JSONModel({ addresses: [] });
        this.getView().setModel(this.oModel);

        for (var i = 0; i < 3; i++) { 
          this.onAddAddress();
        }
      },
  
      onAddAddress: function () {
        var formContainer = this.byId("formContainer");
        var addressIndex = this.oModel.getProperty("/addresses").length;
  
        // Add new address object to the model
        this.oModel.getProperty("/addresses").push({
          street: "",
          city: "",
          country: ""
        });
        this.oModel.refresh();
  
        // Create panel for each address
        var oPanel = new Panel({
          headerText: "Address " + (addressIndex + 1),
          expandable: true,
          expanded: true,
          content: [
            new Label({ text: "Street" }),
            new Input({ value: "{/addresses/" + addressIndex + "/street}" }),
  
            new Label({ text: "City" }),
            new Input({ value: "{/addresses/" + addressIndex + "/city}" }),
  
            new Label({ text: "Country" }),
            new Select({
              selectedKey: "{/addresses/" + addressIndex + "/country}",
              items: [
                new Item({ key: "US", text: "United States" }),
                new Item({ key: "DE", text: "Germany" }),
                new Item({ key: "IN", text: "India" })
              ]
            }),
  
            new Button({
              text: "Remove",
              icon: "sap-icon://delete",
              press: this.onRemoveAddress.bind(this, addressIndex)
            })
          ]
        });
  
        formContainer.addItem(oPanel);
      },
  
      onRemoveAddress: function (index) {
        var addresses = this.oModel.getProperty("/addresses");
        addresses.splice(index, 1);
        this.oModel.setProperty("/addresses", addresses);
  
        // Rebuild all address panels
        var formContainer = this.byId("formContainer");
        formContainer.removeAllItems();
  
        for (var i = 0; i < addresses.length; i++) {
          this.onAddAddress(); // rebuilds all panels based on updated model
        }
      }
    });
  });
  