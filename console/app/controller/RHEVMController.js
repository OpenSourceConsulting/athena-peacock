/*
 * File: app/controller/RHEVMController.js
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

Ext.define('MyApp.controller.RHEVMController', {
    extend: 'Ext.app.Controller',

    onHypervisorRender: function(component, eOpts) {
        //hypervisor Grid Data Search
        Ext.getCmp("hypervisorGrid").getStore().load();

        var detailPanel = Ext.getCmp("rhevmDetailPanel");
        detailPanel.layout.setActiveItem(0);
    },

    onHypervisorGridSelect: function(rowmodel, record, index, eOpts) {
        //RHEVM Grid Item Click

        RHEVMConstants.selectRow = record;

        var detailPanel = Ext.getCmp("rhevmDetailPanel");
        detailPanel.layout.setActiveItem(1);

        Ext.getCmp("rhevmTabPanel").setActiveTab(0);

        var detailDPanel = Ext.getCmp("rhevmTabDetailPanel");
        detailDPanel.layout.setActiveItem(0);
        detailDPanel.collapse();


        //Virtual Machines Data Loading
        var vmGrid = Ext.getCmp('rhevmVMGrid');

        vmGrid.getStore().load({
            params:{
                hypervisorId : record.get("hypervisorId")
            }
        });


        //Template Data Loading
        var templateGrid = Ext.getCmp('rhevmTemplateGrid');

        templateGrid.getStore().load({
            params:{
                hypervisorId : record.get("hypervisorId")
            }
        });

    },

    onRhevmTabPanelTabChange: function(tabPanel, newCard, oldCard, eOpts) {
        var detailTab = Ext.getCmp("rhevmTabDetailPanel");
        detailTab.collapse();
        detailTab.layout.setActiveItem(0);

        var grid;
        if(newCard.title == "Templates"){
            grid = Ext.getCmp('rhevmTemplateGrid');
        } else {
            grid = Ext.getCmp('rhevmVMGrid');
        }
        grid.getStore().reload();
    },

    onRhevmVMGridItemClick: function(rowmodel, record, index, eOpts) {
        //RHEVM VM Grid Item Click
        var detailTab = Ext.getCmp("rhevmTabDetailPanel");
        detailTab.expand();

        detailTab.layout.setActiveItem(1);

        RHEVMConstants.childSelectRow = record;

        Ext.getCmp("rhevmTabDetailTabPanel").setActiveTab(0);


        //General Data Loading
        var generalform = Ext.getCmp("rhevmGeneralForm");

        generalform.getForm().reset();

        generalform.getForm().findField('template').show();
        generalform.getForm().findField('type').hide();

        generalform.getForm().waitMsgTarget = generalform.getEl();

        generalform.getForm().load({
            params : {
                hypervisorId : RHEVMConstants.selectRow.get("hypervisorId"),
                vmId : record.get("vmId")
            }
            ,url : GLOBAL.urlPrefix + "/rhevm/vms/info"
            ,waitMsg:'Loading...'
        });


        //Network Interfaces Data Loading
        var networkGrid = Ext.getCmp('rhevmNetworkGrid');

        networkGrid.columns[6].setVisible(true);

        networkGrid.getStore().getProxy().url = GLOBAL.urlPrefix + "/rhevm/vms/nics";
        networkGrid.getStore().load({
            params:{
                hypervisorId : RHEVMConstants.selectRow.get("hypervisorId"),
                vmId : record.get("vmId")
            }
        });


        //Disk Data Loading
        var diskGrid = Ext.getCmp('rhevmDiskGrid');

        diskGrid.columns[1].setVisible(true);

        diskGrid.getStore().getProxy().url = GLOBAL.urlPrefix + "/rhevm/vms/disks";
        diskGrid.getStore().load({
            params:{
                hypervisorId : RHEVMConstants.selectRow.get("hypervisorId"),
                vmId : record.get("vmId")
            }
        });



    },

    onRhevmVMGridBeforeItemContextMenu: function(dataview, record, item, index, e, eOpts) {
        var position = e.getXY();
        e.stopEvent();

        RHEVMConstants.childSelectRow = record;

        var menu = RHEVMConstants.contextMenu;
        var status = record.get('status');

        menu.items.each(function( item ) {

            if(status == 'up') {

                if(item.text == 'Start')				item.setDisabled(true);
                else if(item.text == 'Stop')			item.setDisabled(false);
                else if(item.text == 'Shutdown')		item.setDisabled(false);
                else if(item.text == 'Remove')			item.setDisabled(true);
                else if(item.text == 'Export')			item.setDisabled(true);
                else if(item.text == 'Make Template')	item.setDisabled(true);

            } else if(status == 'down') {

                if(item.text == 'Start')				item.setDisabled(false);
                else if(item.text == 'Stop')			item.setDisabled(true);
                else if(item.text == 'Shutdown')		item.setDisabled(true);
                else if(item.text == 'Remove')			item.setDisabled(false);
                else if(item.text == 'Export')			item.setDisabled(false);
                else if(item.text == 'Make Template')	item.setDisabled(false);

            } else {
                item.setDisabled(true);
            }

        });

        menu.showAt(position);
    },

    onRowEditingEdit: function(editor, context, eOpts) {
        var record = context.record;

        Ext.Ajax.request({
            url: GLOBAL.urlPrefix + "/hypervisor/updateHypervisor",
            params: {
                hypervisorId 	: record.get("hypervisorId"),
                hypervisorType 	: record.get("hypervisorType"),
                rhevmName 		: record.get("rhevmName"),
                rhevmProtocol 	: record.get("rhevmProtocol"),
                rhevmPort 		: record.get("rhevmPort"),
                rhevmDomain 	: record.get("rhevmDomain"),
                rhevmHost 		: record.get("rhevmHost"),
                rhevmUsername 	: record.get("rhevmUsername"),
                rhevmPassword 	: record.get("rhevmPassword")
            },
            disableCaching : true,
            waitMsg: 'update RHEVM...',
            success: function(response){
                var msg = Ext.JSON.decode(response.responseText).msg;
                Ext.MessageBox.alert('알림', msg);

                Ext.getCmp("hypervisorGrid").getStore().load();

                //Ext.getCmp("rhevmDetailPanel").layout.setActiveItem(0);

            }
        });

    },

    onRhevmTemplateGridSelect: function(rowmodel, record, index, eOpts) {
        //RHEVM VM Grid Item Click
        var detailTab = Ext.getCmp("rhevmTabDetailPanel");
        detailTab.expand();

        detailTab.layout.setActiveItem(1);

        RHEVMConstants.childSelectRow = record;

        Ext.getCmp("rhevmTabDetailTabPanel").setActiveTab(0);


        //General Data Loading
        var generalform = Ext.getCmp("rhevmGeneralForm");

        generalform.getForm().reset();

        generalform.getForm().findField('template').hide();
        generalform.getForm().findField('type').show();

        generalform.getForm().waitMsgTarget = generalform.getEl();

        generalform.getForm().load({
            params : {
                hypervisorId : RHEVMConstants.selectRow.get("hypervisorId"),
                templateId : record.get("templateId")
            }
            ,url : GLOBAL.urlPrefix + "/rhevm/templates/info"
            ,waitMsg:'Loading...'
        });


        //Network Interfaces Data Loading
        var networkGrid = Ext.getCmp('rhevmNetworkGrid');

        networkGrid.columns[6].setVisible(false);

        networkGrid.getStore().getProxy().url = GLOBAL.urlPrefix + "/rhevm/templates/nics";
        networkGrid.getStore().load({
            params:{
                hypervisorId : RHEVMConstants.selectRow.get("hypervisorId"),
                templateId : record.get("templateId")
            }
        });


        //Disk Data Loading
        var diskGrid = Ext.getCmp('rhevmDiskGrid');

        diskGrid.columns[1].setVisible(false);

        diskGrid.getStore().getProxy().url = GLOBAL.urlPrefix + "/rhevm/templates/disks";
        diskGrid.getStore().load({
            params:{
                hypervisorId : RHEVMConstants.selectRow.get("hypervisorId"),
                templateId : record.get("templateId")
            }
        });
    },

    init: function(application) {
                var rhevm = this;

                var rhevmVMGridContextMenu = new Ext.menu.Menu({
                    items:
                    [
                    { text: 'Start',
                        handler: function() {
                            rhevm.controlVMStatus('Start');
                        }
                    },
                    { text: 'Stop',
                        handler: function() {
                            rhevm.controlVMStatus('Stop');
                        }
                    },
                    { text: 'Shutdown',
                        handler: function() {
                            rhevm.controlVMStatus('Shutdown');
                        }
                    },
                    { text: 'Remove',
                        handler: function() {
                            rhevm.controlVMStatus('Remove');
                        }
                    },
                    { text: 'Export',
                        handler: function() {
                            rhevm.controlVMStatus('Export');
                        }
                    },
                    { text: 'Make Template',
                        handler: function() {
                            rhevm.showTemplateWindow();
                        }
                    }
                    ]

                });

                //RHEVM Menu Constants
                Ext.define('RHEVMConstants', {
                    singleton: true,
                    contextMenu: rhevmVMGridContextMenu,
                    selectRow : null,
                    childSelectRow : null
                });

        this.control({
            "#hypervisorGrid": {
                afterrender: this.onHypervisorRender,
                select: this.onHypervisorGridSelect,
                edit: this.onRowEditingEdit
            },
            "#rhevmTabPanel": {
                tabchange: this.onRhevmTabPanelTabChange
            },
            "#rhevmVMGrid": {
                select: this.onRhevmVMGridItemClick,
                beforeitemcontextmenu: this.onRhevmVMGridBeforeItemContextMenu
            },
            "#rhevmTemplateGrid": {
                select: this.onRhevmTemplateGridSelect
            }
        });
    },

    controlVMStatus: function(status) {

        var controlUrl = '';

        if(status == 'Start') {

            controlUrl = '/rhevm/vms/start';

        } else if(status == 'Stop') {

            controlUrl = '/rhevm/vms/stop';

        } else if(status == 'Shutdown') {

            controlUrl = '/rhevm/vms/shutdown';

        } else if(status == 'Remove') {

            controlUrl = ' /rhevm/vms/remove';

        } else if(status == 'Export') {

            controlUrl = '/rhevm/vms/export';

        }

        Ext.MessageBox.confirm('Confirm', 'VM을 ' + status + '하시겠습니까?', function(btn){

            if(btn == "yes"){

                Ext.Ajax.request({
                    url: GLOBAL.urlPrefix + controlUrl,
                    params : {
                        hypervisorId : RHEVMConstants.selectRow.get("hypervisorId"),
                        vmId : RHEVMConstants.childSelectRow.get("vmId")
                    },
                    disableCaching : true,
                    waitMsg: status + ' VM...',
                    success: function(response){
                        var msg = Ext.JSON.decode(response.responseText).msg;
                        Ext.MessageBox.alert('알림', msg);

                        Ext.getCmp('rhevmVMGrid').getStore().reload();
                    }
                });
            }

        });
    },

    showTemplateWindow: function() {
        var templateWindow = Ext.create("widget.regTemplateWindow");

        templateWindow.show();

        var templateForm = Ext.getCmp('templateForm');
        templateForm.getForm().findField('hypervisorId').setRawValue(RHEVMConstants.selectRow.get('hypervisorId'));
        templateForm.getForm().findField('vmId').setRawValue(RHEVMConstants.childSelectRow.get('vmId'));

    }

});
