/*
 * File: app/store/MenuTreeStore.js
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

Ext.define('MyApp.store.MenuTreeStore', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'Ext.data.Field'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'MenuTreeStore',
            root: {
                expanded: true,
                text: 'Server List',
                children: [
                    {
                        text: '<b>Dashboard</b>',
                        id: 'MENU_01',
                        leaf: true,
                        iconCls: 'no-icon',
                        cls: 'parent-node last-children',
                        activeRow: 0
                    },
                    {
                        text: '<b>Instances</b>',
                        id: 'MENU_02',
                        leaf: true,
                        iconCls: 'no-icon',
                        cls: 'parent-node last-children',
                        activeRow: 1
                    },
                    {
                        text: '<b>RHEV Management</b>',
                        id: 'MENU_03',
                        leaf: true,
                        iconCls: 'no-icon',
                        cls: 'parent-node last-children',
                        activeRow: 2
                    },
                    {
                        text: '<b>ALM Management</b>',
                        id: 'MENU_04',
                        leaf: true,
                        iconCls: 'no-icon',
                        cls: 'parent-node last-children',
                        activeRow: 3
                    },
                    {
                        text: '<b>Administration</b>',
                        id: 'MENU_05',
                        leaf: true,
                        iconCls: 'no-icon',
                        cls: 'parent-node last-children',
                        activeRow: 4
                    }
                ]
            },
            fields: [
                {
                    name: 'text'
                },
                {
                    name: 'activeRow'
                }
            ]
        }, cfg)]);
    }
});