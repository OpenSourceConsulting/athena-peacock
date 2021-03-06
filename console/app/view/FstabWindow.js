/*
 * File: app/view/FstabWindow.js
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

Ext.define('MyApp.view.FstabWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.FstabWindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.TextArea',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Hidden',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    height: 400,
    id: 'fstabWindow',
    width: 500,
    resizable: false,
    layout: 'border',
    title: 'Edit Fstab',
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    region: 'center',
                    header: false,
                    title: 'fstabPanel',
                    items: [
                        {
                            xtype: 'form',
                            id: 'fstabForm',
                            itemId: 'fstabForm',
                            bodyPadding: 10,
                            items: [
                                {
                                    xtype: 'textareafield',
                                    height: 240,
                                    width: 470,
                                    fieldLabel: '',
                                    labelAlign: 'top',
                                    name: 'contents',
                                    inputId: 'inputFstab'
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Unmount node(s)',
                                    labelWidth: 120,
                                    name: 'unmounts'
                                },
                                {
                                    xtype: 'checkboxfield',
                                    anchor: '100%',
                                    fieldLabel: 'Remount',
                                    labelWidth: 120,
                                    name: 'remount',
                                    boxLabel: 'Execute "mount -a" after save',
                                    checked: true
                                },
                                {
                                    xtype: 'hiddenfield',
                                    anchor: '100%',
                                    fieldLabel: 'Label',
                                    name: 'machineId'
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
                                        var fstabForm = Ext.getCmp("fstabForm");

                                        fstabForm.getForm().submit({
                                            clientValidation: true,
                                            url: GLOBAL.urlPrefix + "machine/editFstab",
                                            params: {
                                                newStatus: 'delivered'
                                            },
                                            waitMsg: 'Saving Data...',
                                            success: function(form, action) {
                                                Ext.Msg.alert('Success', action.result.msg);

                                                fstabForm.up('window').close();
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
                                    id: 'fstabSaveBtn',
                                    itemId: 'fstabSaveBtn',
                                    margin: '0 15 0 0',
                                    padding: '2 7 2 7',
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
                                    id: 'fstabCancelBtn',
                                    itemId: 'fstabCancelBtn',
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