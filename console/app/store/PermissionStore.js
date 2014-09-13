/*
 * File: app/store/PermissionStore.js
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

Ext.define('MyApp.store.PermissionStore', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.PermissionModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'MyApp.model.PermissionModel',
            storeId: 'PermissionStore',
            proxy: me.processMyAjaxProxy({
                type: 'ajax',
                url: 'permission/list',
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