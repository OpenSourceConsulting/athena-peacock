/*
 * File: app/view/objectFilesContainer.js
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

Ext.define('MyApp.view.objectFilesContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.objectFilesContainer',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.menu.Menu',
        'Ext.menu.Separator',
        'Ext.toolbar.TextItem',
        'Ext.grid.Panel',
        'Ext.grid.View',
        'Ext.grid.column.Number',
        'Ext.selection.CheckboxModel'
    ],

    id: 'objectFilesContainer',
    itemId: 'objectFilesContainer',
    layout: 'border',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    region: 'north',
                    split: true,
                    splitterResize: false,
                    height: 80,
                    id: 'objectFilesTopContainer',
                    itemId: 'objectFilesTopContainer',
                    layout: 'border',
                    items: [
                        {
                            xtype: 'toolbar',
                            region: 'north',
                            height: 40,
                            id: 'objectFilesTopBtnsToolbar',
                            itemId: 'objectFilesTopBtnsToolbar',
                            items: [
                                {
                                    xtype: 'button',
                                    height: 28,
                                    id: 'filesUploadButton',
                                    itemId: 'filesUploadButton',
                                    width: 120,
                                    text: 'Upload'
                                },
                                {
                                    xtype: 'button',
                                    height: 28,
                                    id: 'filesActionsButton',
                                    itemId: 'filesActionsButton',
                                    width: 120,
                                    text: 'Actions',
                                    menu: {
                                        xtype: 'menu',
                                        id: 'filesActionsMenu',
                                        itemId: 'filesActionsMenu',
                                        minWidth: 140,
                                        width: 140,
                                        items: [
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesOpenMenuItem',
                                                itemId: 'filesOpenMenuItem',
                                                text: 'Open'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesDownloadMenuItem',
                                                itemId: 'filesDownloadMenuItem',
                                                text: 'Download'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesUploadMenuItem',
                                                itemId: 'filesUploadMenuItem',
                                                text: 'Upload'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesMakepublicMenuItem',
                                                itemId: 'filesMakepublicMenuItem',
                                                text: 'Make Public'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesMakeprotectedMenuItem',
                                                itemId: 'filesMakeprotectedMenuItem',
                                                text: 'Make Protected'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesRenameMenuItem',
                                                itemId: 'filesRenameMenuItem',
                                                text: 'Rename'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesDeleteMenuItem',
                                                itemId: 'filesDeleteMenuItem',
                                                text: 'Delete'
                                            },
                                            {
                                                xtype: 'menuseparator',
                                                id: 'filesMenuSeparator',
                                                itemId: 'filesMenuSeparator'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesCutMenuItem',
                                                itemId: 'filesCutMenuItem',
                                                text: 'Cut'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesCopyMenuItem',
                                                itemId: 'filesCopyMenuItem',
                                                text: 'Copy'
                                            },
                                            {
                                                xtype: 'menuitem',
                                                id: 'filesPasteMenuItem',
                                                itemId: 'filesPasteMenuItem',
                                                text: 'Paste'
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            region: 'north',
                            height: 40,
                            id: 'objectFilesTopAddrToolbar',
                            itemId: 'objectFilesTopAddrToolbar',
                            padding: '15 0 0 6',
                            items: [
                                {
                                    xtype: 'button',
                                    id: 'filesTextItem',
                                    itemId: 'filesTextItem',
                                    style: {
                                        color: '#66f'
                                    },
                                    text: 'All Buckets'
                                },
                                {
                                    xtype: 'tbtext',
                                    id: 'filesTextItem1',
                                    itemId: 'filesTextItem1',
                                    margin: '0 0 0 0',
                                    width: 640,
                                    text: '/ my-new-bucket'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    region: 'center',
                    split: false,
                    id: 'objectFilesCenterContainer',
                    itemId: 'objectFilesCenterContainer',
                    layout: 'border',
                    items: [
                        {
                            xtype: 'gridpanel',
                            flex: 2,
                            region: 'center',
                            id: 'objectFilesGrid',
                            itemId: 'objectFilesGrid',
                            columnLines: true,
                            forceFit: true,
                            store: 'objectFilesListJsonStore',
                            viewConfig: {
                                id: 'objectFilesGridView',
                                itemId: 'objectFilesGridView'
                            },
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'name',
                                    text: 'Name'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    align: 'right',
                                    dataIndex: 'size',
                                    text: 'Size',
                                    format: '0,000'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'sclass',
                                    text: 'Sclass'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'mdate',
                                    text: 'Mdate'
                                }
                            ],
                            selModel: Ext.create('Ext.selection.CheckboxModel', {

                            })
                        },
                        {
                            xtype: 'panel',
                            flex: 1,
                            region: 'east',
                            split: true,
                            id: 'objectFilesDetail',
                            itemId: 'objectFilesDetail',
                            collapsed: true,
                            collapsible: true,
                            title: 'Detail',
                            titleCollapse: false,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    flex: 1,
                                    border: 1,
                                    id: 'objectFilesDetail1',
                                    itemId: 'objectFilesDetail1',
                                    autoScroll: true,
                                    layout: 'border',
                                    bodyPadding: 10,
                                    bodyStyle: {
                                        background: '#fff'
                                    }
                                },
                                {
                                    xtype: 'panel',
                                    flex: 2,
                                    border: 1,
                                    id: 'objectFilesDetail2',
                                    itemId: 'objectFilesDetail2',
                                    autoScroll: true,
                                    layout: 'border',
                                    bodyPadding: 10,
                                    bodyStyle: {
                                        background: '#fff'
                                    }
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