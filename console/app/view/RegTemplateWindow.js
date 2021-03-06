/*
 * File: app/view/RegTemplateWindow.js
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

Ext.define('MyApp.view.RegTemplateWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.RegTemplateWindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.XTemplate',
        'Ext.form.field.Hidden',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    height: 160,
    id: 'regTemplateWindow',
    itemId: 'regTemplateWindow',
    width: 450,
    resizable: false,
    layout: 'border',
    title: 'Make Template',
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
                    title: 'regTemplatePanel',
                    items: [
                        {
                            xtype: 'form',
                            id: 'templateForm',
                            itemId: 'templateForm',
                            bodyPadding: 15,
                            fieldDefaults: {
                                msgTarget: 'side'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Name',
                                    labelWidth: 120,
                                    name: 'name',
                                    allowBlank: false,
                                    vtype: 'template'
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Description',
                                    labelWidth: 120,
                                    name: 'description',
                                    vtype: 'description'
                                },
                                {
                                    xtype: 'hiddenfield',
                                    anchor: '100%',
                                    fieldLabel: 'Label',
                                    name: 'hypervisorId'
                                },
                                {
                                    xtype: 'hiddenfield',
                                    anchor: '100%',
                                    fieldLabel: 'Label',
                                    name: 'vmId'
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
                                        var templateForm = Ext.getCmp("templateForm");

                                        if (templateForm.getForm().isValid() !== true ) {
                                            Ext.Msg.alert('Failure', '유효하지 않은 입력값이 존재합니다.');
                                            return;
                                        }

                                        templateForm.getForm().submit({
                                            clientValidation: true,
                                            url: GLOBAL.urlPrefix + "rhevm/vms/makeTemplate",
                                            params: {
                                                newStatus: 'delivered'
                                            },
                                            waitMsg: 'Saving Data...',
                                            success: function(form, action) {
                                                Ext.Msg.alert('Success', action.result.msg);

                                                Ext.getCmp('rhevmVMGrid').getStore().reload();
                                                templateForm.up('window').close();
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
                                    id: 'makeTemplateBtn',
                                    itemId: 'makeTemplateBtn',
                                    margin: '0 15 0 0',
                                    padding: '2 10 2 10',
                                    text: 'OK'
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
                                    id: 'templateCancelBtn',
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