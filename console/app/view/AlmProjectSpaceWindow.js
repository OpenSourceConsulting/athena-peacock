/*
 * File: app/view/AlmProjectSpaceWindow.js
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

Ext.define('MyApp.view.AlmProjectSpaceWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.AlmProjectSpaceWindow',

    requires: [
        'Ext.grid.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.form.field.ComboBox',
        'Ext.grid.column.Action',
        'Ext.grid.View',
        'Ext.grid.plugin.CellEditing'
    ],

    height: 300,
    id: 'almProjectSpaceWindow',
    itemId: 'almProjectSpaceWindow',
    width: 700,
    layout: 'border',
    title: 'Add Space',
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
                    title: 'almSpacePanel',
                    items: [
                        {
                            xtype: 'gridpanel',
                            height: 240,
                            id: 'almSpaceGrid',
                            itemId: 'almSpaceGrid',
                            autoScroll: true,
                            columnLines: true,
                            forceFit: true,
                            store: 'AlmSpaceStore',
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    height: 5,
                                    itemId: 'almAddSpaceToolbar'
                                }
                            ],
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    minWidth: 100,
                                    dataIndex: 'key',
                                    text: 'Space'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    minWidth: 200,
                                    dataIndex: 'name',
                                    text: 'Name'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    minWidth: 100,
                                    dataIndex: 'type',
                                    text: 'Type'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                                        if(value === ""){
                                            return "<font color='#999999'><i>Select Auth Type</i></font>";
                                        }else{
                                            return value;
                                        }
                                    },
                                    minWidth: 150,
                                    dataIndex: 'authType',
                                    emptyCellText: 'Select Auth Type',
                                    text: 'Auth Type',
                                    editor: {
                                        xtype: 'combobox',
                                        blankText: 'Select Auth Type',
                                        emptyText: 'Select Auth Type',
                                        multiSelect: true,
                                        store: 'AuthTypeComboStore',
                                        valueField: 'value'
                                    }
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


                                                if(record.get("authType") !== ""){

                                                    Ext.MessageBox.confirm('Confirm', 'Space를 등록 하시겠습니까?', function(btn){

                                                        if(btn == "yes"){

                                                            Ext.Ajax.request({
                                                                url : GLOBAL.urlPrefix + "alm/project/"
                                                                + almConstants.selectRow.get("projectCode") + "/confluence/" + record.get("key") + "?permission="+ record.get("authType"),
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                disableCaching : true,
                                                                waitMsg: 'Add Project Space...',
                                                                success: function(response){
                                                                    var msg = Ext.JSON.decode(response.responseText).msg;
                                                                    Ext.MessageBox.alert('알림', msg);

                                                                    Ext.getCmp("almProjectConfluenceGrid").getStore().reload();

                                                                }
                                                            });

                                                        }

                                                    });
                                                }else{
                                                    Ext.MessageBox.alert('알림', 'auth type을 선택해주세요.');

                                                }


                                            },
                                            icon: 'resources/images/icons/add.png',
                                            iconCls: ''
                                        }
                                    ]
                                }
                            ],
                            plugins: [
                                Ext.create('Ext.grid.plugin.CellEditing', {

                                })
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});