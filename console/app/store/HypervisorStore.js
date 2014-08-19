/*
 * File: app/store/HypervisorStore.js
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

Ext.define('MyApp.store.HypervisorStore', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.HypervisorModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'MyApp.model.HypervisorModel',
            storeId: 'HypervisorStore',
            proxy: me.processMyAjaxProxy({
                type: 'ajax',
                url: 'hypervisor/list',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            })
        }, cfg)]);
    },

    processMyAjaxProxy: function(config) {
        config.actionMethods = {create: "POST", read: "POST", update: "POST", destroy: "POST"};

        return config;
    }

});