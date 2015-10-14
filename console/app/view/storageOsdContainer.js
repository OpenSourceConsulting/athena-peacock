/*
 * File: app/view/storageOsdContainer.js
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

Ext.define('MyApp.view.storageOsdContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.storageOsdContainer',

    requires: [
        'Ext.grid.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.grid.View',
        'Ext.grid.column.Column'
    ],

    id: 'storageOsdContainer',
    itemId: 'storageOsdContainer',
    layout: 'border',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    flex: 3,
                    region: 'center',
                    id: 'storageOsdGrid',
                    itemId: 'storageOsdGrid',
                    columnLines: true,
                    forceFit: true,
                    store: 'storageOsdJsonStore',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            height: 36,
                            id: 'storageOsdToolbar',
                            itemId: 'storageOsdToolbar',
                            items: [
                                {
                                    xtype: 'button',
                                    id: 'storageOsdAdd',
                                    itemId: 'storageOsdAdd',
                                    padding: '3 10 3 10',
                                    text: 'Add OSD'
                                }
                            ]
                        }
                    ],
                    viewConfig: {
                        id: 'storageOsdGridView',
                        itemId: 'storageOsdGridView'
                    },
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'name',
                            text: 'Name'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'id',
                            text: 'Id'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'status',
                            text: 'Status'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'ip',
                            text: 'Ip'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'port',
                            text: 'Port'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'pid',
                            text: 'Pid'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'up_from',
                            text: 'Up_from'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'host',
                            text: 'Host'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'public_addr',
                            text: 'Public_addr'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'cluster_addr',
                            text: 'Cluster_addr'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'heartbeat_back_addr',
                            text: 'Heartbeat_back_addr'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'heartbeat_front_addr',
                            text: 'Heartbeat_front_addr'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    flex: 2,
                    region: 'south',
                    split: true,
                    id: 'storageOsdDetail',
                    itemId: 'storageOsdDetail',
                    autoScroll: true,
                    layout: 'border',
                    bodyPadding: 10,
                    bodyStyle: {
                        background: '#fff'
                    }
                }
            ]
        });

        me.callParent(arguments);
    }

});