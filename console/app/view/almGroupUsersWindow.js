/*
 * File: app/view/almGroupUsersWindow.js
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

Ext.define('MyApp.view.almGroupUsersWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.almGroupUsersWindow',

    requires: [
        'Ext.grid.Panel',
        'Ext.selection.CheckboxModel',
        'Ext.grid.column.Boolean',
        'Ext.grid.View',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    height: 250,
    id: 'almGroupUsersWindow',
    itemId: 'almGroupUsersWindow',
    width: 300,
    layout: 'border',
    title: 'Add Users',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    region: 'center',
                    bodyBorder: false,
                    bodyPadding: 10,
                    header: false,
                    title: 'almUsersPanel',
                    items: [
                        {
                            xtype: 'gridpanel',
                            height: 358,
                            autoScroll: true,
                            bodyBorder: false,
                            columnLines: true,
                            selModel: Ext.create('Ext.selection.CheckboxModel', {

                            }),
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'string',
                                    text: 'String'
                                },
                                {
                                    xtype: 'booleancolumn',
                                    dataIndex: 'bool',
                                    text: 'Boolean'
                                }
                            ]
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            ui: 'footer',
                            layout: {
                                type: 'hbox',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    id: 'makeTemplateBtn1',
                                    itemId: 'makeTemplateBtn',
                                    margin: '0 15 0 0',
                                    padding: '2 5 2 5',
                                    text: 'Create'
                                },
                                {
                                    xtype: 'button',
                                    handler: function(button, e) {
                                        button.up("window").close();
                                    },
                                    id: 'templateCancelBtn1',
                                    itemId: 'templateCancelBtn',
                                    margin: '0 0 0 0',
                                    padding: '2 5 2 5',
                                    text: 'Cancel'
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