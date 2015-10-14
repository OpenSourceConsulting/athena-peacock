/*
 * File: app/view/poolAddWindow.js
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

Ext.define('MyApp.view.poolAddWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.poolAddWindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.form.field.Number',
        'Ext.form.field.ComboBox',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    height: 225,
    width: 400,
    resizable: false,
    layout: 'border',
    title: 'Add POOL',
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    region: 'center',
                    id: 'poolAddTopPanel',
                    itemId: 'poolAddTopPanel',
                    items: [
                        {
                            xtype: 'form',
                            height: 156,
                            id: 'poolAddFormPanel',
                            itemId: 'poolAddFormPanel',
                            bodyPadding: 10,
                            items: [
                                {
                                    xtype: 'fieldset',
                                    padding: 10,
                                    title: ' POOL Data ',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            anchor: '100%',
                                            id: 'poolAddName',
                                            itemId: 'poolAddName',
                                            fieldLabel: 'Pool Name',
                                            name: 'poolAddName'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            anchor: '100%',
                                            id: 'poolAddSize',
                                            itemId: 'poolAddSize',
                                            fieldLabel: 'Replica Size',
                                            name: 'poolAddSize'
                                        },
                                        {
                                            xtype: 'combobox',
                                            anchor: '100%',
                                            id: 'poolAddPgNum',
                                            itemId: 'poolAddPgNum',
                                            fieldLabel: 'PG Number',
                                            name: 'poolAddPgNum',
                                            displayField: 'value',
                                            store: 'PgNumComboArrayStore',
                                            valueField: 'value'
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
                            id: 'poolAddToolbar',
                            itemId: 'poolAddToolbar',
                            layout: {
                                type: 'hbox',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    handler: function(button, e) {
                                        storageConstants.me.addStoragePool();
                                    },
                                    padding: '2 20 2 20',
                                    text: 'Ok'
                                },
                                {
                                    xtype: 'button',
                                    handler: function(button, e) {
                                        var myForm = Ext.getCmp("poolAddFormPanel");

                                        myForm.getForm().findField("poolAddName").setValue('');
                                        myForm.getForm().findField("poolAddSize").setValue('');
                                        myForm.getForm().findField("poolAddPgNum").setValue('');

                                    },
                                    padding: '2 12 2 12',
                                    text: 'Clear'
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