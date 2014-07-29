/*
 * File: app/view/rhevmContainer.js
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

Ext.define('MyApp.view.rhevmContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.rhevmcontainer',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.View',
        'Ext.toolbar.Toolbar',
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.grid.column.Number',
        'Ext.grid.column.Date',
        'Ext.grid.column.Boolean',
        'Ext.form.Panel',
        'Ext.form.FieldContainer',
        'Ext.form.field.Text'
    ],

    height: 755,
    id: 'rhevmContainer',
    itemId: 'rhevmContainer',
    width: 1000,
    layout: 'border',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    flex: 1,
                    region: 'center',
                    id: 'rhevmsGrid',
                    itemId: 'rhevmsGrid',
                    minHeight: 100,
                    autoScroll: true,
                    columnLines: true,
                    store: 'tempGridData',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            id: 'rhevmsToolbar',
                            itemId: 'rhevmsToolbar',
                            width: 150,
                            items: [
                                {
                                    xtype: 'button',
                                    handler: function(button, e) {
                                        var rhevmWindow = Ext.create("widget.regRhevmWindow");
                                        rhevmWindow.show();
                                    },
                                    id: 'addRHEVMBtn',
                                    itemId: 'addRHEVMBtn',
                                    text: 'Add RHEVM'
                                }
                            ]
                        }
                    ],
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'id',
                            text: 'No'
                        },
                        {
                            xtype: 'gridcolumn',
                            text: 'Host'
                        },
                        {
                            xtype: 'gridcolumn',
                            text: 'Name'
                        },
                        {
                            xtype: 'gridcolumn',
                            text: 'Domain'
                        },
                        {
                            xtype: 'gridcolumn',
                            text: 'Protocol'
                        },
                        {
                            xtype: 'gridcolumn',
                            text: 'Port'
                        },
                        {
                            xtype: 'gridcolumn',
                            text: 'Username'
                        },
                        {
                            xtype: 'gridcolumn',
                            text: 'Password'
                        },
                        {
                            xtype: 'gridcolumn',
                            text: 'Create Date'
                        },
                        {
                            xtype: 'gridcolumn',
                            text: 'Delete'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    flex: 3,
                    region: 'south',
                    split: true,
                    id: 'rhevmDetailPanel',
                    itemId: 'rhevmDetailPanel',
                    layout: 'border',
                    items: [
                        {
                            xtype: 'tabpanel',
                            flex: 1,
                            region: 'center',
                            id: 'rhevmTabPanel',
                            itemId: 'rhevmTabPanel',
                            padding: '5 0 0 0',
                            style: 'background-color:#ffffff;',
                            activeTab: 0,
                            plain: true,
                            items: [
                                {
                                    xtype: 'panel',
                                    autoScroll: true,
                                    layout: 'fit',
                                    title: 'Virtual Machines',
                                    items: [
                                        {
                                            xtype: 'gridpanel',
                                            id: 'rhevmVMGrid',
                                            itemId: 'rhevmVMGrid',
                                            autoScroll: true,
                                            columnLines: true,
                                            store: 'tempGridData',
                                            viewConfig: {
                                                itemId: 'mygridview4'
                                            },
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    dataIndex: 'id',
                                                    text: 'Id'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    autoScroll: true,
                                    layout: 'fit',
                                    title: 'Templates',
                                    items: [
                                        {
                                            xtype: 'gridpanel',
                                            id: 'rhevmTemplateGrid',
                                            itemId: 'rhevmTemplateGrid',
                                            autoScroll: true,
                                            columnLines: true,
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    dataIndex: 'string',
                                                    text: 'String'
                                                },
                                                {
                                                    xtype: 'numbercolumn',
                                                    dataIndex: 'number',
                                                    text: 'Number'
                                                },
                                                {
                                                    xtype: 'datecolumn',
                                                    dataIndex: 'date',
                                                    text: 'Date'
                                                },
                                                {
                                                    xtype: 'booleancolumn',
                                                    dataIndex: 'bool',
                                                    text: 'Boolean'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            flex: 2,
                            region: 'south',
                            split: true,
                            height: 150,
                            id: 'rhevmTabDetailPanel',
                            itemId: 'rhevmTabDetailPanel',
                            padding: '5 0 0 0 ',
                            animCollapse: true,
                            collapsed: true,
                            collapsible: true,
                            title: 'Detail',
                            items: [
                                {
                                    xtype: 'tabpanel',
                                    id: 'rhevmTabDetailTabPanel',
                                    itemId: 'rhevmTabDetailTabPanel',
                                    padding: '5 0 0 0',
                                    width: 1000,
                                    collapsible: false,
                                    activeTab: 0,
                                    plain: true,
                                    items: [
                                        {
                                            xtype: 'panel',
                                            autoScroll: true,
                                            layout: 'fit',
                                            title: 'General',
                                            items: [
                                                {
                                                    xtype: 'form',
                                                    id: 'instanceDescForm1',
                                                    itemId: 'instanceDescForm',
                                                    defaults: {
                                                        border: false,
                                                        xtype: 'panel',
                                                        flex: 1,
                                                        layout: 'anchor'
                                                    },
                                                    bodyPadding: 10,
                                                    bodyStyle: 'padding:5px 5px 0',
                                                    header: false,
                                                    fieldDefaults: {
                                                        msgTarget: 'side',
                                                        margin: '0 10',
                                                        readOnly: true
                                                    },
                                                    waitMsgTarget: 'instDescForm',
                                                    items: [
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            height: 34,
                                                            defaults: {
                                                                flex: 1
                                                            },
                                                            fieldLabel: 'Label',
                                                            hideLabel: true,
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'Name'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'Status'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            height: 34,
                                                            defaults: {
                                                                flex: 1
                                                            },
                                                            fieldLabel: 'Label',
                                                            hideLabel: true,
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'Description'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'Display Type'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            height: 34,
                                                            defaults: {
                                                                flex: 1
                                                            },
                                                            fieldLabel: 'Label',
                                                            hideLabel: true,
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'Template'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'Origin'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            height: 34,
                                                            defaults: {
                                                                flex: 1
                                                            },
                                                            fieldLabel: 'Label',
                                                            hideLabel: true,
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'Memory'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'CPU Cores'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            height: 34,
                                                            defaults: {
                                                                flex: 1
                                                            },
                                                            fieldLabel: 'Label',
                                                            hideLabel: true,
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'HA Enabled'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'HA Priority'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldcontainer',
                                                            height: 34,
                                                            defaults: {
                                                                flex: 1
                                                            },
                                                            fieldLabel: 'Label',
                                                            hideLabel: true,
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'OS Type'
                                                                },
                                                                {
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'Create Date'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'panel',
                                            autoScroll: true,
                                            layout: 'fit',
                                            title: 'Network Interfaces',
                                            items: [
                                                {
                                                    xtype: 'gridpanel',
                                                    id: 'instanceSoftwareGrid2',
                                                    itemId: 'instanceSoftwareGrid',
                                                    autoScroll: true,
                                                    columnLines: true,
                                                    columns: [
                                                        {
                                                            xtype: 'gridcolumn',
                                                            dataIndex: 'string',
                                                            text: 'String'
                                                        },
                                                        {
                                                            xtype: 'numbercolumn',
                                                            dataIndex: 'number',
                                                            text: 'Number'
                                                        },
                                                        {
                                                            xtype: 'datecolumn',
                                                            dataIndex: 'date',
                                                            text: 'Date'
                                                        },
                                                        {
                                                            xtype: 'booleancolumn',
                                                            dataIndex: 'bool',
                                                            text: 'Boolean'
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'panel',
                                            autoScroll: true,
                                            layout: 'fit',
                                            title: 'Disks',
                                            items: [
                                                {
                                                    xtype: 'gridpanel',
                                                    id: 'instanceOsGrid2',
                                                    itemId: 'instanceOsGrid',
                                                    autoScroll: true,
                                                    columnLines: true,
                                                    columns: [
                                                        {
                                                            xtype: 'gridcolumn',
                                                            dataIndex: 'string',
                                                            text: 'String'
                                                        },
                                                        {
                                                            xtype: 'numbercolumn',
                                                            dataIndex: 'number',
                                                            text: 'Number'
                                                        },
                                                        {
                                                            xtype: 'datecolumn',
                                                            dataIndex: 'date',
                                                            text: 'Date'
                                                        },
                                                        {
                                                            xtype: 'booleancolumn',
                                                            dataIndex: 'bool',
                                                            text: 'Boolean'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});