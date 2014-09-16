/*
 * File: app/controller/SoftwareInstallController.js
 *
 * This file was generated by Sencha Architect version 3.0.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.controller.SoftwareInstallController', {
    extend: 'Ext.app.Controller',

    onPopComboSoftwareNameChange: function(field, newValue, oldValue, eOpts) {
        if(newValue != '') {

            var store = Ext.getCmp("popComboSoftwareName").getStore();
            var index = store.indexOf(store.findRecord("softwareName", newValue));

            var versionStore = Ext.getStore("ComboSoftwareVersionStore");

            versionStore.getProxy().extraParams = {
                softwareName : newValue
            };
            versionStore.load();

            var installPanel = Ext.getCmp("softwareInstallPanel");
            installPanel.layout.setActiveItem(index);

            if(index == 0) {


            }

        }

    },

    init: function(application) {
        this.control({
            "#popComboSoftwareName": {
                change: this.onPopComboSoftwareNameChange
            }
        });
    }

});
