/*
 * File: app/view/VmSummaryWindow.js
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

Ext.define('MyApp.view.VmSummaryWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.VmSummaryWindow',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer',
        'Ext.grid.View'
    ],

    height: 480,
    width: 420,
    resizable: false,
    title: 'VM List',
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    height: 435,
                    id: 'vmSummaryGrid',
                    itemId: 'vmSummaryGrid',
                    autoScroll: true,
                    header: false,
                    title: 'My Grid Panel',
                    columnLines: true,
                    forceFit: true,
                    store: 'DashboardVmStore',
                    columns: [
                        {
                            xtype: 'rownumberer',
                            minWidth: 40,
                            width: 40
                        },
                        {
                            xtype: 'gridcolumn',
                            minWidth: 150,
                            dataIndex: 'instanceName',
                            text: 'Instance Name'
                        },
                        {
                            xtype: 'gridcolumn',
                            minWidth: 120,
                            dataIndex: 'ipAddress',
                            text: 'IP Address'
                        },
                        {
                            xtype: 'gridcolumn',
                            minWidth: 60,
                            dataIndex: 'vmStatus',
                            text: 'Status'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});