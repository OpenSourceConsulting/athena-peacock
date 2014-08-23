/*
 * File: app/view/almGroupWindow.js
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

Ext.define('MyApp.view.almGroupWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.almGroupWindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.field.Checkbox',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    height: 200,
    id: 'almGroupWindow',
    itemId: 'almGroupWindow',
    width: 460,
    layout: 'border',
    title: 'Add Group',
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
                    title: 'almGroupPanel',
                    items: [
                        {
                            xtype: 'form',
                            id: 'popAlmGroupForm',
                            itemId: 'popAlmGroupForm',
                            bodyPadding: 15,
                            items: [
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Group Name',
                                    labelWidth: 120
                                },
                                {
                                    xtype: 'checkboxfield',
                                    anchor: '100%',
                                    fieldLabel: 'Is Active',
                                    labelWidth: 120,
                                    boxLabel: ''
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Group Description',
                                    labelWidth: 120
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
                            id: 'instanceCreateBtn2',
                            itemId: 'instanceCreateBtn',
                            margin: '0 15 0 0',
                            padding: '2 5 2 5',
                            text: 'Create'
                        },
                        {
                            xtype: 'button',
                            handler: function(button, e) {
                                button.up("window").close();
                            },
                            id: 'instanceCancelBtn2',
                            itemId: 'instanceCancelBtn',
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