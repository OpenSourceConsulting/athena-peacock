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

    refs: [
        {
            ref: 'mycombobox2',
            selector: '#mycombobox2'
        }
    ],

    onComboboxChange: function(field, newValue, oldValue, eOpts) {

        var frmID = null;
        var installWindow = Ext.getCmp("softwareInstallWindow");

        if(newValue == 'Apache HTTP Server') {

            frmID = 0;
            installWindow.setSize(500, 350);

        } else if(newValue == 'Apache Tomcat') {

            frmID = 1;
            installWindow.setSize(500, 460);
            //installWindow.height = 460;

        } else if(newValue == 'JBoss EWS') {

            frmID = 2;
            installWindow.setSize(500, 520);

        } else if(newValue == 'JBoss EAP') {

            frmID = 3;
            installWindow.setSize(500, 750);

        }


        var installPanel = Ext.getCmp("softwareInstallPanel");
        installPanel.layout.setActiveItem(frmID);

        installWindow.center();

    },

    init: function(application) {
        this.control({
            "#mycombobox2": {
                change: this.onComboboxChange
            }
        });
    }

});