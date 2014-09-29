/*
 * File: app/view/AlmUsersWindow.js
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

Ext.define('MyApp.view.AlmUsersWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.AlmUsersWindow',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.View',
        'Ext.toolbar.Toolbar',
        'Ext.form.field.Text',
        'Ext.toolbar.Spacer',
        'Ext.button.Button',
        'Ext.form.field.Hidden'
    ],

    height: 310,
    id: 'AlmUsersWindow',
    itemId: 'AlmUsersWindow',
    width: 500,
    resizable: false,
    layout: 'border',
    title: 'Add Users',
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
                    title: 'almUsersPanel',
                    items: [
                        {
                            xtype: 'gridpanel',
                            height: 220,
                            id: 'popAlmUsersGrid',
                            itemId: 'popAlmUsersGrid',
                            autoScroll: true,
                            columnLines: true,
                            forceFit: true,
                            store: 'AlmUserStore',
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    minWidth: 100,
                                    dataIndex: 'userId',
                                    text: 'Name'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    minWidth: 150,
                                    dataIndex: 'displayName',
                                    text: 'Display Name'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'emailAddress',
                                    text: 'Email'
                                },
                                {
                                    xtype: 'actioncolumn',
                                    text: 'Add',
                                    maxWidth: 60,
                                    minWidth: 70,
                                    style: 'text-align:left;',
                                    width: 60,
                                    defaultWidth: 60,
                                    align: 'center',
                                    menuText: '',
                                    items: [
                                        {
                                            handler: function(view, rowIndex, colIndex, item, e, record, row) {

                                                Ext.MessageBox.confirm('Confirm', 'User를 등록 하시겠습니까?', function(btn){

                                                    if(btn == "yes"){

                                                        var type = Ext.getCmp("addAlmUserType").getValue();

                                                        if(type == "group") {

                                                            Ext.Ajax.request({
                                                                url : GLOBAL.urlPrefix + "alm/groupmanagement/"
                                                                + almConstants.selectRow.get("name") + "/" + record.get("userId"),
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                disableCaching : true,
                                                                waitMsg: 'Add ALM User...',
                                                                success: function(response){
                                                                    var msg = Ext.JSON.decode(response.responseText).msg;
                                                                    Ext.MessageBox.alert('알림', msg);

                                                                    Ext.getCmp("almGroupUserGrid").getStore().reload();

                                                                }
                                                            });

                                                        } else if(type == "project") {

                                                            Ext.Ajax.request({
                                                                url : GLOBAL.urlPrefix + "alm/groupmanagement/"
                                                                + almConstants.selectRow.get("projectCode") + "/" + record.get("userId"),
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                disableCaching : true,
                                                                waitMsg: 'Add Project User...',
                                                                success: function(response){
                                                                    var msg = Ext.JSON.decode(response.responseText).msg;
                                                                    Ext.MessageBox.alert('알림', msg);

                                                                    Ext.getCmp("almProjectUserGrid").getStore().reload();

                                                                }
                                                            });

                                                        }
                                                    }

                                                });
                                            },
                                            icon: 'resources/images/icons/add.png',
                                            iconCls: ''
                                        }
                                    ]
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    id: 'instancesToolbar5',
                                    itemId: 'instancesToolbar1',
                                    width: 150,
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'inputPopAlmUserName',
                                            itemId: 'inputPopAlmUserName',
                                            fieldLabel: 'Filtering',
                                            labelWidth: 60,
                                            emptyText: 'Search Name',
                                            enableKeyEvents: true
                                        },
                                        {
                                            xtype: 'tbspacer',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'button',
                                            handler: function(button, e) {
                                                almConstants.me.searchPopAlmUser(false, 'left');
                                            },
                                            iconMask: false,
                                            height: 30,
                                            width: 25,
                                            iconCls: 'x-toolbar-scroll-left'
                                        },
                                        {
                                            xtype: 'button',
                                            handler: function(button, e) {
                                                almConstants.me.searchPopAlmUser(false, 'right');
                                            },
                                            iconMask: false,
                                            height: 30,
                                            width: 25,
                                            iconCls: 'x-toolbar-scroll-right'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    height: 10,
                                    hidden: true
                                }
                            ]
                        },
                        {
                            xtype: 'hiddenfield',
                            id: 'addAlmUserType',
                            itemId: 'addAlmUserType',
                            width: 150,
                            fieldLabel: 'Label'
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
                            handler: function(button, e) {
                                button.up("window").close();
                            },
                            itemId: '',
                            margin: '0 0 0 0',
                            padding: '2 5 2 5',
                            text: 'Close'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});