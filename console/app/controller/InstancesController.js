/*
 * File: app/controller/InstancesController.js
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

Ext.define('MyApp.controller.InstancesController', {
    extend: 'Ext.app.Controller',

    id: 'InstancesController',

    onInstancesGridSelect: function(tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {

        //Instances Grid Item Click

        if(instancesConstants.selectRow == null || instancesConstants.selectRow.get("machineId") != record.get("machineId")) {

            instancesConstants.selectRow = record;

            this.selectInstanceGrid();
        }

    },

    onInstancesGridBeforeItemContextMenu: function(dataview, record, item, index, e, eOpts) {
        //Instaces Grid Right Click Menu 호출

        if(instancesConstants.writeMenuAuth == false) {
            return;
        }

        var position = e.getXY();
        e.stopEvent();

        instancesConstants.actionRow = record;

        var menu = instancesConstants.contextMenu;
        var status = record.get("status");
        var os = Ext.util.Format.lowercase(record.get("osName"));

        menu.items.each(function( item ) {

            if(item.text != 'Edit Instance') {

                if(os.indexOf('linux') >= 0) {

                    if(status == 'Running') {

                        if(item.text == 'Agent Start') {
                            item.setDisabled(true);
                        } else {
                            item.setDisabled(false);
                        }

                    } else {

                        if(item.text == 'Agent Start') {
                            item.setDisabled(false);
                        } else {
                            item.setDisabled(true);
                        }
                    }

                } else {
                    item.setDisabled(true);
                }

            }

        });

        menu.showAt(position);
    },

    onCategoryCycleClick: function(item, e, eOpts) {
        // Category Menu Click
        if(Ext.getCmp("searchCategory").getRawValue() != item.getId()) {

            if(item.getId() == 'production') {
                Ext.getCmp("searchCategory").setRawValue("Y");

            } else if(item.getId() == 'development') {

                Ext.getCmp("searchCategory").setRawValue("N");

            } else {

                Ext.getCmp("searchCategory").setRawValue("");

            }

            this.searchInstance();
        }

    },

    onRhevmCycleClick: function(item, e, eOpts) {
        //RHEVM Menu Click

        if(Ext.getCmp("searchRhevm").getRawValue() != item.code) {

            Ext.getCmp("rhevmCycle").setText(item.text);
            Ext.getCmp("searchRhevm").setRawValue(item.code);

            this.searchInstance();
        }


    },

    onSearchInstanceNameKeydown: function(textfield, e, eOpts) {
        //Instance Name Search
        if(e.getKey() == e.ENTER){
            this.searchInstance();
        }
    },

    onSearchPackageNameKeydown: function(textfield, e, eOpts) {
        //Instance Package Name Search
        if(e.getKey() == e.ENTER){
            this.searchInstanceOs();
        }
    },

    onInstanceTabPanelTabChange: function(tabPanel, newCard, oldCard, eOpts) {

        if(newCard.title == "Description"){

            this.searchInstanceDetail(0);

        } else if(newCard.title == "Software"){

            this.setInstanceMenuAuth();
            this.searchInstanceDetail(1);

        } else if(newCard.title == "OS Package"){

            Ext.getCmp("searchPackageName").setValue("");
            Ext.getCmp("instanceOsGrid").reconfigure(Ext.getCmp("instanceOsGrid").store, Ext.getCmp("instanceOsGrid").initialConfig.columns);

            this.searchInstanceDetail(2);

        } else {

            this.viewInstanceMonitoring();

            instancesConstants.chartInterval = setInterval(function() {
                instancesConstants.me.viewInstanceMonitoring();
            }, 60000);

        }
    },

    init: function(application) {
                //Instances Menu Config Setting

                var instances = this;

                var instancesGridContextMenu = new Ext.menu.Menu({
                    items:
                    [

                    { text: 'CLI(Command Line Interface)',
                        handler: function() {
                            instances.showCLIWindow();
                        }
                    },
                    { text: 'Edit Instance',
                        handler: function() {
                            instances.showEditInstanceWindow();
                        }
                    },
                    { text: 'Agent Start',
                        handler: function() {
                            instances.controlAgent('Start');
                        }
                    },
                    { text: 'Agent Stop',
                        handler: function() {
                            instances.controlAgent('Stop');
                        }
                    },
                    { text: 'Manage Group',
                        handler: function() {
                            instances.showManageGroupWindow();
                        }
                    },
                    { text: 'Manage Account',
                        handler: function() {
                            instances.showManageAccountWindow();
                        }
                    },
                    { text: 'Edit Fstab',
                        handler: function() {
                            instances.showFstabWindow();
                        }
                    },
                    { text: 'Edit Crontab',
                        handler: function() {
                            instances.showCrontabWindow();
                        }
                    }
                    ]

                });

                //Instances Menu Constants
                Ext.define('instancesConstants', {
                    singleton: true,
                    me : instances,
                    chartInterval : null,
                    contextMenu: instancesGridContextMenu,
                    selectRow : null,
                    actionRow : null,
                    writeMenuAuth : false
                });


        this.control({
            "#instancesGrid": {
                cellclick: this.onInstancesGridSelect,
                beforeitemcontextmenu: this.onInstancesGridBeforeItemContextMenu
            },
            "#categoryCycle menuitem": {
                click: this.onCategoryCycleClick
            },
            "#rhevmCycle menuitem": {
                click: this.onRhevmCycleClick
            },
            "#searchInstanceName": {
                keydown: this.onSearchInstanceNameKeydown
            },
            "#searchPackageName": {
                keydown: this.onSearchPackageNameKeydown
            },
            "#instanceTabPanel": {
                tabchange: this.onInstanceTabPanelTabChange
            }
        });
    },

    initInstance: function() {
        //RHEVM Combo Menu setting

        var rhevmCycle = Ext.getCmp("rhevmCycle").menu;
        var menuItems = rhevmCycle.items;


        for(var idx = menuItems.length; idx >= 0; idx--) {
            menuItems.removeAt(idx);
        }

        rhevmCycle.add({
            xtype: 'menucheckitem',
            code: '',
            text: 'All RHEV Manager',
            group : 'rhevm',
            checked : true
        });

        var comboStore = Ext.getStore("ComboHypervisorStore");
        comboStore.load({
            callback : function(records, options, success) {

                Ext.each(records, function (record, index) {

                    rhevmCycle.add({
                        xtype: 'menucheckitem',
                        code: record.get("hypervisorId"),
                        text: record.get("rhevmName"),
                        group : 'rhevm'
                    });

                });

                rhevmCycle.doLayout();

            }
        });

    },

    searchInstance: function(init) {

        //Instances Grid Data Search

        if(init) {
            Ext.getCmp("searchCategory").setValue("");
            Ext.getCmp("searchRhevm").setValue("");
            Ext.getCmp("searchInstanceName").setValue("");

            Ext.getCmp("instancesGrid").reconfigure(Ext.getCmp("instancesGrid").store, Ext.getCmp("instancesGrid").initialConfig.columns);
        }

        clearInterval(instancesConstants.chartInterval);

        instancesConstants.selectRow = null;

        var instanceStore = Ext.getCmp("instancesGrid").getStore();

        instanceStore.getProxy().extraParams = {
            isPrd : Ext.getCmp("searchCategory").getRawValue(),
            hypervisorId : Ext.getCmp("searchRhevm").getRawValue(),
            displayName : Ext.getCmp("searchInstanceName").getRawValue()
        };

        //Grid Combo Data
        var comboStore = Ext.getStore("ComboHypervisorStore");
        if(comboStore.getCount() > 0) {

            instanceStore.loadPage(1);

        } else {

            comboStore.load({
                callback : function(records, options, success) {

                    instanceStore.loadPage(1);

                }
            });

        }

        var detailPanel = Ext.getCmp("instanceDetailPanel");
        detailPanel.layout.setActiveItem(0);
    },

    selectInstanceGrid: function() {
        //Instance Detail 조회

        var detailPanel = Ext.getCmp("instanceDetailPanel");
        detailPanel.layout.setActiveItem(1);

        Ext.getCmp("instanceTabPanel").setActiveTab(0);

        this.searchInstanceDetail(0);
    },

    searchInstanceDetail: function(tabIndex) {

        //Instance Detail 조회(Tab 별)

        /*
        //init clear
        clearInterval(instancesConstants.chartInterval);
        Ext.getStore("instanceMonitoringChartStore").removeAll();

        */

        if(tabIndex == 0) {

            //Description Data Loading
            var descform = Ext.getCmp("instanceDescForm");

            descform.getForm().reset();

            descform.getForm().waitMsgTarget = descform.getEl();

            descform.getForm().load({
                params : {
                    machineId : instancesConstants.selectRow.get("machineId")
                }
                ,url : GLOBAL.urlPrefix + "machine/getMachine"
                ,waitMsg:'Loading...'
            });


        } else if(tabIndex == 1) {

            //Software Data Loading
            var softwareStore = Ext.getCmp('instanceSoftwareGrid').getStore();

            softwareStore.getProxy().extraParams = {
                machineId : instancesConstants.selectRow.get("machineId")
            };

            softwareStore.load();

        } else if(tabIndex == 2) {

            //OS Package Data Loading
            this.searchInstanceOs();

        } else {

            //Monitoring Data Loading

            instancesConstants.chartInterval = setInterval(function() {

            var chartStore = Ext.getStore("instanceMonitoringChartStore");
                chartStore.load({
                    addRecords : true
                });

                if(chartStore.getCount() > 30) {
                    chartStore.remove(chartStore.getAt(0));
                }

            }, 5000);
        }


    },

    searchInstanceOs: function() {
        //Instances Os Package Grid Data Search

        var packageStore = Ext.getCmp('instanceOsGrid').getStore();

        packageStore.getProxy().extraParams = {
            machineId : instancesConstants.selectRow.get("machineId"),
            name : Ext.getCmp("searchPackageName").getRawValue()
        };

        packageStore.loadPage(1);

    },

    reloadInstanceOs: function() {
        //Instance Os Reload

        if(instancesConstants.selectRow.get("status") != 'Running') {

            Ext.MessageBox.alert('Message', 'Instance의 Agent가 Running일 경우에만 재수집이 가능합니다.');
            return;

        }

        Ext.MessageBox.confirm('Confirm', 'OS Package 재수집은 최대 수분의 시간이 소요됩니다.<br/>재수집 하시겠습니까?', function(btn){

            if(btn == "yes"){

                Ext.Ajax.request({
                    url: GLOBAL.urlPrefix + "package/reload",
                    params : {
                        machineId : instancesConstants.selectRow.get("machineId")
                    },
                    disableCaching : true,
                    waitMsg: 'Package Reload...',
                    timeout: 300000,
                    success: function(response){
                        var msg = Ext.JSON.decode(response.responseText).msg;
                        Ext.MessageBox.alert('알림', msg);

                        Ext.getCmp("instanceOsGrid").getStore().reload();

                    }
                });
            }

        });

    },

    showCLIWindow: function() {
        //CLI Popup 호출

        var CLIWindow = Ext.create("widget.CLIWindow");
        CLIWindow.show();

        Ext.getCmp("cliForm").getForm().findField("machineId").setRawValue(instancesConstants.actionRow.get("machineId"));

    },

    showManageAccountWindow: function() {
        //Manage Account Popup 호출

        var manageAccountWindow = Ext.create("widget.ManageAccountWindow");
        manageAccountWindow.show();

        var accountStore = Ext.getCmp('instanceAccountGrid').getStore();

        accountStore.getProxy().extraParams = {
            machineId : instancesConstants.actionRow.get("machineId")
        };

        accountStore.load();

    },

    showManageGroupWindow: function() {
        //Manage Group Popup 호출

        var manageGroupWindow = Ext.create("widget.ManageGroupWindow");
        manageGroupWindow.show();

        var groupStore = Ext.getCmp('instanceGroupGrid').getStore();

        groupStore.getProxy().extraParams = {
            machineId : instancesConstants.actionRow.get("machineId")
        };

        groupStore.load();

    },

    showFstabWindow: function() {
        //Fstab Popup 호출

        var fstabWindow = Ext.create("widget.FstabWindow");
        fstabWindow.show();

        var fstabForm = Ext.getCmp("fstabForm");

        fstabForm.getForm().reset();

        fstabForm.getForm().waitMsgTarget = fstabForm.getEl();

        fstabForm.getForm().load({
            params : {
                machineId : instancesConstants.actionRow.get("machineId")
            }
            ,url : GLOBAL.urlPrefix + "machine/getFstab"
            ,waitMsg:'Loading...'
            ,success: function(form, action) {

                form.findField('machineId').setValue(instancesConstants.actionRow.get("machineId"));
                form.findField('contents').setValue(action.result.data);
            }
        });
    },

    showCrontabWindow: function() {
        //Crontab Popup 호출

        var crontabWindow = Ext.create("widget.CrontabWindow");

        crontabWindow.show();

        Ext.getCmp("crontabForm").getForm().findField('machineId').setValue(instancesConstants.actionRow.get("machineId"));

        var accountStore = Ext.getStore("ComboAccountStore");
        accountStore.getProxy().extraParams = {
            machineId : instancesConstants.actionRow.get("machineId")
        };

    },

    showEditInstanceWindow: function() {
        //Instance Edit Popup 호출

        var editWindow = Ext.create("widget.EditInstanceWindow");
        editWindow.show();

        var instanceForm = Ext.getCmp("editInstanceForm");

        instanceForm.getForm().waitMsgTarget = instanceForm.getEl();

        instanceForm.getForm().load({
            params : {
                machineId : instancesConstants.actionRow.get("machineId")
            }
            ,url : GLOBAL.urlPrefix + "machine/getMachine"
            ,waitMsg:'Loading...'
            ,success: function(form, action) {

                var password = form.findField('sshPassword').getValue();

                form.findField('confirmSshPassword').setRawValue(password);

                if(form.findField('sshKeyFile').getValue() != '') {
                    Ext.getCmp('chkUseGroup').items.items[1].setValue(true);
                } else {
                    Ext.getCmp('chkUseGroup').items.items[0].setValue(true);
                }


            }
        });
    },

    executeInstanceCLI: function() {
        //CLI Comment Execute

        var cliForm = Ext.getCmp("cliForm");

        cliForm.getForm().submit({
            clientValidation: true,
            url: GLOBAL.urlPrefix + "machine/cli",
            method : "POST",
            params: {
                newStatus: 'delivered'
            },
            waitMsg: 'Processing...',
            success: function(form, action) {

                Ext.getCmp("cliOutputForm").getForm().findField("inputCLIOutput").setValue(action.result.data);

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

    controlAgent: function(status) {
        //Agent Status Controll

        Ext.Ajax.request({
            url: GLOBAL.urlPrefix + "machine/getMachine",
            params : {
                machineId : instancesConstants.actionRow.get("machineId")
            },
            disableCaching : true,
            waitMsg: status + ' Check Agent Status...',
            success: function(response){

                var data = Ext.decode(response.responseText).data;

                if(data.sshPort != null && data.sshUsername != null && ( data.sshPassword != null || data.sshKeyFile != null ) ) {

                    var controlUrl = 'machine/agentStart';
                    if(status == 'Stop') {
                        controlUrl = 'machine/agentStop';
                    }

                    Ext.MessageBox.confirm('Confirm', 'Agent를 ' + status + '하시겠습니까?', function(btn){

                        if(btn == "yes"){

                            Ext.Ajax.request({
                                url: GLOBAL.urlPrefix + controlUrl,
                                params : {
                                    machineId : instancesConstants.actionRow.get("machineId")
                                },
                                disableCaching : true,
                                waitMsg: status + ' Agent...',
                                success: function(response){
                                    var msg = Ext.JSON.decode(response.responseText).msg;
                                    Ext.MessageBox.alert('알림', msg);

                                    Ext.getCmp('instancesGrid').getStore().reload();
                                }
                            });
                        }

                    });

                } else {

                    Ext.MessageBox.alert('알림', '설정된 SSH 관련 정보가 없습니다. Edit Instance 메뉴에서 수정하십시오. ');
                }

            }
        });


    },

    viewInstanceMonitoring: function() {

        //Instance Chart View

        Ext.Ajax.request({
            url: GLOBAL.urlPrefix + "monitor/factor_list",
            params : {
                includeAll : "Y"
            },
            disableCaching : true,
            waitMsg: status + ' Check Agent Status...',
            success: function(response){

                columnData = Ext.decode(response.responseText).list;
                Ext.each(columnData, function(data, idx) {
                    if(data.monFactorId == "FACTOR_001") {
                        Ext.getCmp("chartCpuLabel").setText("CPU ("+ data.monFactorUnit +")");
                    }
                    if(data.monFactorId == "FACTOR_004") {
                        Ext.getCmp("chartMemoryLabel").setText("Memory ("+ data.monFactorUnit +")");
                    }
                    if(data.monFactorId == "FACTOR_006") {
                        Ext.getCmp("chartDiskLabel").setText("Disk ("+ data.monFactorUnit +")");
                    }

                });


                var chartStore = Ext.getStore("InstanceMonitoringStore");
                chartStore.getProxy().extraParams = {
                    machineId : instancesConstants.selectRow.get("machineId")
                };


                var diskColumns = [];

                chartStore.load({
                    callback : function(records, options, success) {

                        Ext.each(records, function(record, index) {

                            if(record.get("FACTOR_006")) {

                                var diskCol = record.get("FACTOR_006").split(",");

                                Ext.each(diskCol, function (col) {

                                    var diskData = col.split(":");
                                    var flag = true;
                                    Ext.each(diskColumns, function(disk, diskIdx) {

                                       if(disk == diskData[0])  {

                                           record.set("DISK_"+(diskIdx+1), diskData[1]);

                                           flag = false;
                                           return false;

                                       }

                                    });

                                    if(flag) {
                                        diskColumns.push(diskData[0]);

                                        record.set("DISK_"+(diskColumns.length), diskData[1]);
                                    }
                                });

                            } else {

                                Ext.each(diskColumns, function(disk, diskIdx) {

                                    record.set("DISK_"+(diskIdx+1), "");

                                });

                            }

                        });

                        var chartSeries = Ext.getCmp('diskChart').series;

                        for(var i=0;i<10;i++) {

                            if(i < diskColumns.length) {
                                chartSeries.getAt(i).showAll();
                                chartSeries.getAt(i).showInLegend = true;
                                chartSeries.getAt(i).showMarkers = true;

                                chartSeries.getAt(i).setTitle(diskColumns[i]);

                            } else {
                                chartSeries.getAt(i).hideAll();
                                chartSeries.getAt(i).showInLegend = false;
                                chartSeries.getAt(i).showMarkers = false;
                            }
                        }

                    }
                });

            }
        });

    },

    viewInstanceMonitoringPopup: function(type) {

        //Instance Chart Popup

        if(type) {

            var monitoringChartWindow = Ext.create("widget.MonitoringChartWindow");

            monitoringChartWindow.show();

            if(type == 'cpu') {

                Ext.getCmp("chartPanel").layout.setActiveItem(0);
                monitoringChartWindow.setTitle("CPU");

            } else if(type == 'memory') {

                Ext.getCmp("chartPanel").layout.setActiveItem(1);
                monitoringChartWindow.setTitle("Memory");

            } else if(type == 'disk') {

                Ext.getCmp("chartPanel").layout.setActiveItem(2);
                monitoringChartWindow.setTitle("Disk");
            }

            Ext.getCmp("comboTimeRange").setValue("");
            Ext.getCmp("comboTimePeriod").setValue("");
            Ext.getCmp("instanceMonitoringType").setValue(type);

        } else {
            type = Ext.getCmp("instanceMonitoringType").getValue();
        }

        var chartStore = Ext.getStore("MonitoringPopupStore");

        chartStore.getProxy().extraParams = {
            machineId : instancesConstants.selectRow.get("machineId"),
            timeRange : Ext.getCmp("comboTimeRange").getValue(),
            period    : Ext.getCmp("comboTimePeriod").getValue()
        };


        var diskColumns = [];

        chartStore.load({
            callback : function(records, options, success) {

                if(type == 'disk') {

                    Ext.each(records, function(record, index) {

                        if(record.get("FACTOR_006")) {

                            var diskCol = record.get("FACTOR_006").split(",");

                            Ext.each(diskCol, function (col) {

                                var diskData = col.split(":");
                                var flag = true;
                                Ext.each(diskColumns, function(disk, diskIdx) {

                                    if(disk == diskData[0])  {

                                        record.set("DISK_"+(diskIdx+1), diskData[1]);

                                        flag = false;
                                        return false;

                                    }

                                });

                                if(flag) {
                                    diskColumns.push(diskData[0]);

                                    record.set("DISK_"+(diskColumns.length), diskData[1]);
                                }
                            });

                        } else {

                            Ext.each(diskColumns, function(disk, diskIdx) {

                                record.set("DISK_"+(diskIdx+1), "");

                            });

                        }
                    });

                    var chartSeries = Ext.getCmp('popDiskChart').series;

                    for(var i=0;i<10;i++) {

                        if(i < diskColumns.length) {
                            chartSeries.getAt(i).showAll();
                            chartSeries.getAt(i).showInLegend = true;
                            chartSeries.getAt(i).showMarkers = true;

                            chartSeries.getAt(i).setTitle(diskColumns[i]);

                        } else {
                            chartSeries.getAt(i).hideAll();
                            chartSeries.getAt(i).showInLegend = false;
                            chartSeries.getAt(i).showMarkers = false;
                        }
                    }

                }
            }
        });

    },

    setInstanceMenuAuth: function() {

        //Tab에 숨겨진 버튼은 disabled 처리가 안되므로 tab change event에 한번 더 적용
        if(instancesConstants.writeMenuAuth) {

            Ext.get("instancesContainer").select(".auth-write").show();
            Ext.getCmp("instanceSoftwareGrid").getView().headerCt.getGridColumns()[6].setVisible(true);
            Ext.getCmp("instanceSoftwareGrid").getView().headerCt.getGridColumns()[7].setVisible(true);
            Ext.getCmp("instanceSoftwareGrid").getView().headerCt.getGridColumns()[8].setVisible(true);

        } else {

            Ext.get("instancesContainer").select(".auth-write").hide();
            Ext.getCmp("instanceSoftwareGrid").getView().headerCt.getGridColumns()[6].setVisible(false);
            Ext.getCmp("instanceSoftwareGrid").getView().headerCt.getGridColumns()[7].setVisible(false);
            Ext.getCmp("instanceSoftwareGrid").getView().headerCt.getGridColumns()[8].setVisible(false);

        }
    }

});
