/*
 * File: app/view/AlmRepositoryWindow.js
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

Ext.define('MyApp.view.AlmRepositoryWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.AlmRepositoryWindow',

    requires: [
        'Ext.form.Panel',
        'Ext.XTemplate',
        'Ext.form.field.ComboBox',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    height: 200,
    width: 470,
    resizable: false,
    layout: 'border',
    title: 'Add Repository',
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
                    title: 'My Panel',
                    items: [
                        {
                            xtype: 'form',
                            id: 'popRepositoryForm',
                            itemId: 'popRepositoryForm',
                            padding: 5,
                            width: 435,
                            bodyPadding: '10 0 10 10',
                            header: false,
                            title: 'My Form',
                            fieldDefaults: {
                                msgTarget: 'side',
                                labelWidth: 145
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Repository Name',
                                    msgTarget: 'under',
                                    name: 'repositoryCode',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'combobox',
                                    anchor: '100%',
                                    fieldLabel: 'Repository Type',
                                    msgTarget: 'under',
                                    name: 'repositoryType',
                                    store: [
                                        [
                                            '10',
                                            'svn'
                                        ],
                                        [
                                            '20',
                                            'git'
                                        ]
                                    ]
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    afterLabelTextTpl: [
                                        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                    ],
                                    fieldLabel: 'Repository Description',
                                    msgTarget: 'under',
                                    name: 'repositoryDescription',
                                    allowBlank: false
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

                                var repositoryForm = Ext.getCmp("popRepositoryForm");
                                if(repositoryForm.isValid()) {

                                    Ext.Ajax.request({
                                        url: GLOBAL.urlPrefix + "alm/repository",
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        waitMsg: 'Saving Data...',
                                        jsonData: repositoryForm.getForm().getFieldValues(),
                                        success: function (response) {

                                            var responseData = Ext.JSON.decode(response.responseText);

                                            if(responseData.success) {

                                                Ext.Msg.alert('Success', responseData.msg);

                                                Ext.getCmp('almRepositoryGrid').getStore().reload();
                                                repositoryForm.up('window').close();

                                            } else {

                                                Ext.Msg.alert('Failure', responseData.msg);

                                            }
                                        },
                                        failure: function (response) {
                                            var msg = Ext.JSON.decode(response.responseText).msg;

                                            Ext.Msg.alert('Failure', msg);
                                        }
                                    });

                                }

                            },
                            margin: '0 15 0 0',
                            padding: '2 5 2 5',
                            text: 'Create'
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
    }

});