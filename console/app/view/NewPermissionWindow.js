/*
 * File: app/view/NewPermissionWindow.js
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

Ext.define('MyApp.view.NewPermissionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.NewPermissionWindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.XTemplate',
        'Ext.form.field.Hidden',
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.tree.Column',
        'Ext.grid.column.CheckColumn',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    height: 470,
    width: 500,
    resizable: false,
    title: 'New Permission',
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    id: 'newPermissionForm',
                    itemId: 'newPermissionForm',
                    padding: '10 10 0 10',
                    bodyPadding: 10,
                    header: false,
                    title: 'My Form',
                    fieldDefaults: {
                        msgTarget: 'side',
                        labelWidth: 120
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            afterLabelTextTpl: [
                                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                            ],
                            fieldLabel: 'Permission Name',
                            labelWidth: 120,
                            name: 'permNm',
                            allowBlank: false,
                            maskRe: /[^\s]/,
                            maxLength: 30,
                            minLength: 3,
                            regex: /[^\s]/
                        },
                        {
                            xtype: 'hiddenfield',
                            anchor: '100%',
                            fieldLabel: 'Label',
                            name: 'permMenus'
                        }
                    ]
                },
                {
                    xtype: 'treepanel',
                    getRecords: function() {
                        var current = 0;
                        var records = [];
                        return (function find(nodes) {
                            var i, len = nodes.length;
                            for (i = 0; i < len; i++) {
                                records.push(nodes[i]);
                                current++;
                                var found = find(nodes[i].childNodes);
                            }

                            return records;

                        }(this.store.getRootNode().childNodes));

                    },
                    plugins: [
                        Ext.create('Ext.grid.plugin.CellEditing',
                        {
                            
                        })
                    ],
                    height: 320,
                    id: 'allMenuTreeGrid',
                    itemId: 'allMenuTreeGrid',
                    margin: '5 20 10 20',
                    width: 445,
                    autoScroll: true,
                    frameHeader: false,
                    header: false,
                    title: 'My Tree Grid Panel',
                    columnLines: true,
                    forceFit: false,
                    rowLines: true,
                    rootVisible: false,
                    viewConfig: {
                        frame: false
                    },
                    columns: [
                        {
                            xtype: 'treecolumn',
                            dataIndex: 'menuNm',
                            groupable: false,
                            text: 'Menu',
                            flex: 5
                        },
                        {
                            xtype: 'checkcolumn',
                            dataIndex: 'isRead',
                            menuDisabled: true,
                            text: 'Read',
                            flex: 1,
                            stopSelection: false,
                            listeners: {
                                checkchange: {
                                    fn: me.onCheckcolumnCheckChange2,
                                    scope: me
                                }
                            }
                        },
                        {
                            xtype: 'checkcolumn',
                            dataIndex: 'isWrite',
                            text: 'Write',
                            flex: 1,
                            listeners: {
                                checkchange: {
                                    fn: me.onCheckcolumnCheckChange11,
                                    scope: me
                                }
                            }
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            height: 10
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

                                var menuRecords = Ext.getCmp("allMenuTreeGrid").getRecords();

                                var menus = [];
                                Ext.each(menuRecords, function(record) {
                                    var menu = {};
                                    menu.menuId = record.get("menuId");
                                    menu.readYn = (record.get("isRead") == true ? "1" : "0");
                                    menu.writeYn = (record.get("isWrite") == true ? "1" : "0");

                                    menus.push(menu);

                                });

                                var permissionForm = Ext.getCmp("newPermissionForm");

                                permissionForm.getForm().findField("permMenus").setValue(Ext.JSON.encode(menus));

                                permissionForm.getForm().submit({
                                    clientValidation: true,
                                    url: GLOBAL.urlPrefix + "permission/create",
                                    method : "POST",
                                    params: {
                                        newStatus: 'delivered'
                                    },
                                    waitMsg: 'Saving Data...',
                                    success: function(form, action) {
                                        Ext.Msg.alert('Success', action.result.msg);

                                        Ext.getCmp('userPermissionGrid').getStore().load();

                                        permissionForm.up('window').close();
                                    },
                                    failure: function(form, action) {
                                        switch (action.failureType) {
                                            case Ext.form.action.Action.CLIENT_INVALID:
                                            Ext.Msg.alert('Failure', '유효하지 않은 입력값이 존재합니다.');
                                            break;
                                            case Ext.form.action.Action.CONNECT_FAILURE:
                                            Ext.Msg.alert('Failure', 'Server communication failed');
                                            break;
                                            case Ext.form.action.Action.SERVER_INVALID:
                                            Ext.Msg.alert('Failure', action.result.msg);
                                        }
                                    }
                                });
                            },
                            margin: '0 15 0 0',
                            padding: '2 5 2 5',
                            text: 'Save'
                        },
                        {
                            xtype: 'button',
                            handler: function(button, e) {
                                Ext.MessageBox.confirm('Confirm', '작업을 취소하시겠습니까?', function(btn){

                                    if(btn == "yes"){
                                        button.up("window").close();
                                    }

                                });

                            },
                            margin: '0 0 0 0',
                            padding: '2 5 2 5',
                            text: 'Cancel'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },

    onCheckcolumnCheckChange2: function(checkcolumn, rowIndex, checked, eOpts) {
        userConstants.me.changeMenuAuth(Ext.getCmp("allMenuTreeGrid"), "isRead", rowIndex, checked);
    },

    onCheckcolumnCheckChange11: function(checkcolumn, rowIndex, checked, eOpts) {
        userConstants.me.changeMenuAuth(Ext.getCmp("allMenuTreeGrid"), "isWrite", rowIndex, checked);
    }

});