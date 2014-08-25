/*
 * File: app/view/CLIWindow.js
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

Ext.define('MyApp.view.CLIWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.CLIWindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.XTemplate',
        'Ext.form.field.Hidden',
        'Ext.form.Label',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.form.field.TextArea'
    ],

    height: 620,
    width: 500,
    resizable: false,
    layout: 'border',
    title: 'CLI(Command Line Interface)',
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    region: 'north',
                    split: true,
                    height: 210,
                    collapsed: false,
                    collapsible: false,
                    header: false,
                    title: 'commendPanel',
                    items: [
                        {
                            xtype: 'form',
                            height: 250,
                            id: 'cliForm',
                            itemId: 'cliForm',
                            layout: 'auto',
                            bodyPadding: 10,
                            title: '',
                            fieldDefaults: {
                                msgTarget: 'side',
                                labelWidth: 150
                            },
                            items: [
                                {
                                    xtype: 'fieldset',
                                    padding: 10,
                                    title: 'Command',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            anchor: '100%',
                                            fieldLabel: 'Working Directory',
                                            name: 'workingDir'
                                        },
                                        {
                                            xtype: 'textfield',
                                            anchor: '100%',
                                            afterLabelTextTpl: [
                                                '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                                            ],
                                            fieldLabel: 'Executable Command',
                                            name: 'command',
                                            allowBlank: false,
                                            enableKeyEvents: true,
                                            listeners: {
                                                keydown: {
                                                    fn: me.onTextfieldKeydown,
                                                    scope: me
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'textfield',
                                            anchor: '100%',
                                            fieldLabel: 'Argument(s)',
                                            name: 'args',
                                            enableKeyEvents: true,
                                            listeners: {
                                                keydown: {
                                                    fn: me.onTextfieldKeydown1,
                                                    scope: me
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'hiddenfield',
                                    fieldLabel: 'Label',
                                    name: 'machineId'
                                },
                                {
                                    xtype: 'label',
                                    padding: '',
                                    style: 'font-size: 12px;color:red;',
                                    text: '※ 대화형 애플리케이션과 같이 인터럽트로 종료되는 명령은 지원하지 않습니다.'
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
                                        Ext.getCmp("cliOutputForm").getForm().findField("inputCLIOutput").setValue("");
                                    },
                                    margin: '0 15 0 0',
                                    padding: '2 10 2 10',
                                    text: 'Clear'
                                },
                                {
                                    xtype: 'button',
                                    handler: function(button, e) {
                                        instancesConstants.me.executeInstanceCLI();
                                    },
                                    margin: '0 0 0 0',
                                    padding: '2 5 2 5',
                                    text: 'Execute'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    split: true,
                    animCollapse: false,
                    collapsed: false,
                    collapsible: false,
                    header: false,
                    title: 'outputPanel',
                    items: [
                        {
                            xtype: 'form',
                            id: 'cliOutputForm',
                            itemId: 'cliOutputForm',
                            items: [
                                {
                                    xtype: 'textareafield',
                                    height: 330,
                                    padding: '10 10 10 10',
                                    width: 464,
                                    fieldLabel: 'Output',
                                    labelAlign: 'top',
                                    name: 'inputCLIOutput',
                                    inputId: 'inputCLIOutput',
                                    readOnly: true
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },

    onTextfieldKeydown: function(textfield, e, eOpts) {
        if(e.getKey() == e.ENTER){
            instancesConstants.me.executeInstanceCLI();
        }
    },

    onTextfieldKeydown1: function(textfield, e, eOpts) {
        if(e.getKey() == e.ENTER){
            instancesConstants.me.executeInstanceCLI();
        }
    }

});