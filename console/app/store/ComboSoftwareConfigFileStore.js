/*
 * File: app/store/ComboSoftwareConfigFileStore.js
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

Ext.define('MyApp.store.ComboSoftwareConfigFileStore', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.ConfigModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'MyApp.model.ConfigModel',
            storeId: 'ComboSoftwareConfigFileStore',
            proxy: me.processMyAjaxProxy({
                type: 'ajax',
                url: 'config/getConfigFileNames',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            }),
            listeners: {
                load: {
                    fn: me.onJsonstoreLoad,
                    scope: me
                }
            }
        }, cfg)]);
    },

    processMyAjaxProxy: function(config) {
        config.actionMethods = {create: "GET", read: "GET", update: "GET", destroy: "GET"};

        return config;
    },

    onJsonstoreLoad: function(store, records, successful, eOpts) {
        Ext.each(records, function(record) {
            var displayField = record.get("configFileLocation") +"/"+record.get("configFileName");

            record.set("confifFgfn", displayField);
        });

    }

});