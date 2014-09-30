/*
 * File: app/view/RegInstanceWindow.js
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

Ext.define('MyApp.view.RegInstanceWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.RegInstanceWindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Display',
        'Ext.XTemplate',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Hidden',
        'Ext.form.FieldSet',
        'Ext.form.RadioGroup',
        'Ext.form.field.Radio',
        'Ext.form.field.File',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    height: 680,
    id: 'regInstanceWindow1',
    width: 480,
    resizable: false,
    layout: 'border',
    title: 'Create Instance',
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    region: 'center',
                    autoScroll: true,
                    header: false,
                    title: 'regInstancePanel',
                    items: [
                        {
                            xtype: 'form',
                            id: 'instanceForm',
                            itemId: 'instanceForm',
                            autoScroll: true,
                            bodyPadding: 15,
                            fieldDefaults: {
                                msgTarget: 'side',
                                labelWidth: 130
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    anchor: '100%',
                                    hidden: true,
                                    padding: '0 0 15 0',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'RHEM Manager',
                                    labelWidth: 130,
                                    name: 'displayHypervisor',
                                    value: 'Display Field'
                                },
                                {
                                    xtype: 'combobox',
                                    anchor: '100%',
                                    padding: '0 0 15 0',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'RHEM Manager',
                                    labelWidth: 130,
                                    name: 'hypervisorId',
                                    allowBlank: false,
                                    displayField: 'rhevmName',
                                    store: 'ComboHypervisorStore',
                                    valueField: 'hypervisorId',
                                    listeners: {
                                        change: {
                                            fn: me.onComboboxChange,
                                            scope: me
                                        }
                                    }
                                },
                                {
                                    xtype: 'combobox',
                                    anchor: '100%',
                                    padding: '0 0 0 0',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Based on Template',
                                    labelWidth: 130,
                                    name: 'template',
                                    allowBlank: false,
                                    displayField: 'name',
                                    valueField: 'templateId',
                                    listeners: {
                                        select: {
                                            fn: me.onComboboxSelect,
                                            scope: me
                                        }
                                    }
                                },
                                {
                                    xtype: 'combobox',
                                    anchor: '100%',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Data Center',
                                    labelWidth: 130,
                                    name: 'dataCenter',
                                    allowBlank: false,
                                    displayField: 'name',
                                    valueField: 'id',
                                    listeners: {
                                        change: {
                                            fn: me.onComboboxChange1,
                                            scope: me
                                        }
                                    }
                                },
                                {
                                    xtype: 'combobox',
                                    anchor: '100%',
                                    padding: '0 0 15 0',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Host Cluster',
                                    labelWidth: 130,
                                    name: 'cluster',
                                    allowBlank: false,
                                    displayField: 'name',
                                    valueField: 'name'
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Name',
                                    labelWidth: 130,
                                    name: 'name',
                                    allowBlank: false,
                                    enableKeyEvents: true,
                                    vtype: 'template',
                                    listeners: {
                                        keyup: {
                                            fn: me.onTextfieldKeyup,
                                            scope: me
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Description',
                                    labelWidth: 130,
                                    name: 'description',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    padding: '0 0 15 0',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Host Name',
                                    labelWidth: 130,
                                    name: 'hostName',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'displayfield',
                                    anchor: '100%',
                                    hidden: true,
                                    padding: '0 0 15 0',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Based on Template',
                                    labelWidth: 130,
                                    name: 'displayTemplate',
                                    value: 'Display Field'
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Memory(MB)',
                                    labelWidth: 130,
                                    name: 'memory',
                                    allowBlank: false,
                                    vtype: 'numeric'
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Total Virtual CPUs',
                                    labelWidth: 130,
                                    name: 'sockets',
                                    allowBlank: false,
                                    vtype: 'numeric'
                                },
                                {
                                    xtype: 'hiddenfield',
                                    anchor: '100%',
                                    fieldLabel: 'Label',
                                    name: 'cores'
                                },
                                {
                                    xtype: 'hiddenfield',
                                    anchor: '100%',
                                    fieldLabel: 'Label',
                                    name: 'initTemplate'
                                },
                                {
                                    xtype: 'fieldset',
                                    margin: '20 0 10 0',
                                    collapsible: true,
                                    title: 'SSH Settings (Required)',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            anchor: '100%',
                                            afterLabelTextTpl: [
                                                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                            ],
                                            fieldLabel: 'SSH Port',
                                            labelWidth: 130,
                                            name: 'sshPort'
                                        },
                                        {
                                            xtype: 'textfield',
                                            anchor: '100%',
                                            afterLabelTextTpl: [
                                                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                            ],
                                            fieldLabel: 'Username',
                                            labelWidth: 130,
                                            name: 'sshUsername'
                                        },
                                        {
                                            xtype: 'radiogroup',
                                            padding: '0 0 0 135',
                                            items: [
                                                {
                                                    xtype: 'radiofield',
                                                    name: 'chkUseType',
                                                    boxLabel: 'Use Password',
                                                    checked: true,
                                                    inputValue: 'password',
                                                    listeners: {
                                                        change: {
                                                            fn: me.onRadiofieldChange,
                                                            scope: me
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'radiofield',
                                                    name: 'chkUseType',
                                                    boxLabel: ' Use Key',
                                                    inputValue: 'key'
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'textfield',
                                            validator: function(value) {
                                                var chkValue = Ext.getCmp('instanceForm').getForm().findField('chkUseType').getValue();

                                                if(chkValue == true) {
                                                    if(value) {
                                                        return true;
                                                    } else {
                                                        return 'This field is required';
                                                    }
                                                } else {
                                                    return true;
                                                }

                                            },
                                            anchor: '100%',
                                            fieldLabel: 'Password',
                                            labelWidth: 130,
                                            name: 'sshPassword',
                                            inputType: 'password'
                                        },
                                        {
                                            xtype: 'textfield',
                                            validator: function(value) {
                                                var chkValue = Ext.getCmp('instanceForm').getForm().findField('chkUseType').getValue();

                                                if(chkValue == true) {
                                                    if(value) {
                                                        return true;
                                                    } else {
                                                        return 'This field is required';
                                                    }
                                                } else {
                                                    return true;
                                                }

                                            },
                                            anchor: '100%',
                                            fieldLabel: 'Password Confirm',
                                            labelWidth: 130,
                                            name: 'confirmSshPassword',
                                            inputType: 'password',
                                            vtype: 'password'
                                        },
                                        {
                                            xtype: 'filefield',
                                            validator: function(value) {
                                                var chkValue = Ext.getCmp('instanceForm').getForm().findField('chkUseType').getValue();

                                                if(chkValue == false) {
                                                    if(value) {
                                                        return true;
                                                    } else {
                                                        return 'This field is required';
                                                    }
                                                } else {
                                                    return true;
                                                }

                                            },
                                            anchor: '100%',
                                            disabled: true,
                                            fieldLabel: 'Key File',
                                            name: 'keyFile',
                                            emptyText: 'Select a identity file'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    margin: '20 0 0 0',
                                    collapsed: true,
                                    collapsible: true,
                                    title: 'Static IP Address Settings (Optional)',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            anchor: '100%',
                                            fieldLabel: 'IP Address',
                                            labelWidth: 130,
                                            name: 'ipAddress'
                                        },
                                        {
                                            xtype: 'textfield',
                                            validator: function(value) {
                                                var chkValue = Ext.getCmp('instanceForm').getForm().findField('ipAddress').getValue();

                                                if(chkValue) {
                                                    if(value) {
                                                        return true;
                                                    } else {
                                                        return 'This field is required';
                                                    }
                                                } else {
                                                    return true;
                                                }

                                            },
                                            anchor: '100%',
                                            fieldLabel: 'Net Mask',
                                            labelWidth: 130,
                                            name: 'netmask'
                                        },
                                        {
                                            xtype: 'textfield',
                                            validator: function(value) {
                                                var chkValue = Ext.getCmp('instanceForm').getForm().findField('ipAddress').getValue();

                                                if(chkValue) {
                                                    if(value) {
                                                        return true;
                                                    } else {
                                                        return 'This field is required';
                                                    }
                                                } else {
                                                    return true;
                                                }

                                            },
                                            anchor: '100%',
                                            fieldLabel: 'Gateway',
                                            labelWidth: 130,
                                            name: 'gateway'
                                        },
                                        {
                                            xtype: 'textfield',
                                            anchor: '100%',
                                            fieldLabel: 'Name Server',
                                            labelWidth: 130,
                                            name: 'nameServer'
                                        }
                                    ]
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
                                        var instanceForm = Ext.getCmp("instanceForm");

                                        instanceForm.getForm().submit({
                                            clientValidation: true,
                                            url: GLOBAL.urlPrefix + "rhevm/vms/create",
                                            method : "POST",
                                            params: {
                                                newStatus: 'delivered'
                                            },
                                            waitMsg: 'Saving Data...',
                                            success: function(form, action) {
                                                Ext.Msg.alert('Success', action.result.msg);

                                                Ext.getCmp('instancesGrid').getStore().load();

                                                instanceForm.up('window').close();
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
                                    id: 'instanceCreateBtn3',
                                    itemId: 'instanceCreateBtn',
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
                                    id: 'instanceCancelBtn3',
                                    itemId: 'instanceCancelBtn',
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
    },

    onComboboxChange: function(field, newValue, oldValue, eOpts) {

        var form = field.up('form').getForm();

        var dataCenter = field.up('form').getForm().findField("dataCenter");
        var dateCenterStore = Ext.getStore("ComboDataCenterStore");

        var template = form.findField("template");
        var templateStore = Ext.getStore("ComboTemplateStore");

        dataCenter.setValue("");

        form.findField("cluster").setValue("");

        dataCenter.bindStore(dateCenterStore);

        dateCenterStore.getProxy().extraParams = {
            hypervisorId : newValue
        };
        dateCenterStore.load();

        if(form.findField("displayTemplate").getValue() != "") {

            template.setValue("");
            form.findField("memory").setValue("");
            form.findField("sockets").setValue("");

            template.bindStore(templateStore);

            templateStore.getProxy().extraParams = {
                hypervisorId : newValue
            };
            templateStore.load();

        }
    },

    onComboboxSelect: function(combo, records, eOpts) {
        combo.up('form').getForm().findField("memory").setValue(records[0].get("memory"));
        combo.up('form').getForm().findField("sockets").setValue(records[0].get("sockets"));
        combo.up('form').getForm().findField("dataCenter").setValue("");
        combo.up('form').getForm().findField("dataCenter").setValue(records[0].get("dataCenter")+"::"+records[0].get("cluster"));
        combo.up('form').getForm().findField("cores").setValue("1");

        //alert(records[0].get("clusterMap"));

    },

    onComboboxChange1: function(field, newValue, oldValue, eOpts) {

        if(newValue != '') {

            var dataCenterValue = newValue;
            var clusterValue = "";

            if(dataCenterValue.indexOf("::") > -1) {
                dataCenterValue = newValue.split("::")[0];
                clusterValue = newValue.split("::")[1];

                field.setRawValue(dataCenterValue);
            }

            var cluster = field.up('form').getForm().findField("cluster");
            var clusterStore = Ext.getStore("ComboClusterStore");

            cluster.bindStore(clusterStore);

            clusterStore.getProxy().extraParams = {
                hypervisorId : field.up('form').getForm().findField("hypervisorId").getValue(),
                dataCenterId : newValue
            };
            clusterStore.load({
                callback : function(records, options, success) {
                    cluster.setValue(clusterValue);
                }
            });

        }
    },

    onTextfieldKeyup: function(textfield, e, eOpts) {
        textfield.up('form').getForm().findField("hostName").setValue(textfield.getValue());
    },

    onRadiofieldChange: function(field, newValue, oldValue, eOpts) {
        var form = field.up('form').getForm();
        if(newValue == true) {
            form.findField('keyFile').setValue('');
            form.findField('keyFile').isValid();

            form.findField('keyFile').setDisabled(true);
            form.findField('sshPassword').setDisabled(false);
            form.findField('confirmSshPassword').setDisabled(false);

        } else {
            form.findField('sshPassword').setValue('');
            form.findField('confirmSshPassword').setValue('');

            form.findField('sshPassword').isValid();
            form.findField('confirmSshPassword').isValid();

            form.findField('keyFile').setDisabled(false);
            form.findField('sshPassword').setDisabled(true);
            form.findField('confirmSshPassword').setDisabled(true);
        }
    }

});