/*
 * File: app/view/almProjectSpaceWindow.js
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

Ext.define('MyApp.view.almProjectSpaceWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.almProjectSpaceWindow',

    requires: [
        'Ext.grid.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.form.field.Text',
        'Ext.selection.CheckboxModel',
        'Ext.grid.column.Column',
        'Ext.grid.View',
        'Ext.button.Button'
    ],

    height: 250,
    id: 'almProjectSpaceWindow',
    itemId: 'almProjectSpaceWindow',
    width: 550,
    layout: 'border',
    title: 'Add Space',
    modal: true,

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
                    title: 'almSpacePanel',
                    items: [
                        {
                            xtype: 'gridpanel',
                            height: 358,
                            id: 'almSpaceGrid',
                            itemId: 'almSpaceGrid',
                            autoScroll: true,
                            bodyBorder: false,
                            columnLines: true,
                            forceFit: true,
                            store: 'AlmSpaceStore',
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    padding: '5 0 20 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Filtering',
                                            labelWidth: 60
                                        }
                                    ]
                                }
                            ],
                            selModel: Ext.create('Ext.selection.CheckboxModel', {

                            }),
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    minWidth: 100,
                                    dataIndex: 'key',
                                    text: 'Space'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    minWidth: 200,
                                    dataIndex: 'name',
                                    text: 'Name'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    minWidth: 100,
                                    dataIndex: 'type',
                                    text: 'Type'
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
                                pack: 'end'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    id: 'makeTemplateBtn3',
                                    itemId: 'makeTemplateBtn',
                                    margin: '0 15 0 0',
                                    padding: '2 5 2 5',
                                    text: 'add'
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