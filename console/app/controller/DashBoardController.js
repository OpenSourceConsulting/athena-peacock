/*
 * File: app/controller/DashBoardController.js
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

Ext.define('MyApp.controller.DashBoardController', {
    extend: 'Ext.app.Controller',

    onServerSummaryGridCellClick: function(tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var window;
        var store;
        if(cellIndex == 1) {

            window = Ext.create("widget.VmSummaryWindow");
            window.show();

            Ext.getCmp("vmSummaryGrid").getStore().loadData(record.get("vmList"), false);

        } else if(cellIndex == 2) {

            window = Ext.create("widget.TemplateSummaryWindow");
            window.show();

            Ext.getCmp("templateSummaryGrid").getStore().loadData(record.get("templateList"), false);


        } else if(cellIndex == 3) {

            window = Ext.create("widget.AgentSummaryWindow");
            window.show();

            Ext.getCmp("agentSummaryGrid").getStore().loadData(record.get("agentList"), false);

        } else if(cellIndex == 4) {

            window = Ext.create("widget.AlarmCriticalWindow");
            window.show();

            Ext.getCmp("alarmCriticalGrid").getStore().loadData(record.get("criticalList"), false);

        } else if(cellIndex == 5) {

            window = Ext.create("widget.AlarmWarningWindow");
            window.show();

            Ext.getCmp("alarmWarningGrid").getStore().loadData(record.get("warningList"), false);

        }
    },

    init: function(application) {
                //DashBoard Menu Config Setting

                var dashboard = this;

                //DashBoard Menu Constants
                Ext.define('dashboardConstants', {
                    singleton: true,
                    me : dashboard
                });


        this.control({
            "#serverSummaryGrid": {
                cellclick: this.onServerSummaryGridCellClick
            }
        });
    },

    showDashBoard: function() {

        Ext.Ajax.request({
            url: GLOBAL.urlPrefix + "dashboard/main",
            disableCaching : true,
            success: function(response){

                var data = Ext.decode(response.responseText).data;

                var rhevmNames = data.rhevmNames;

                //Server Summary
                var serverDatas = [];
                Ext.each(rhevmNames, function (key){

                    var serverData = {};
                    serverData.rhevmName = key;
                    serverData.vmCnt = data.vmTotalCnt[key] + " ("+ data.vmUpCnt[key] + ")";
                    serverData.templateCnt = data.templateTotalCnt[key];
                    serverData.agentCnt = data.agentTotalCnt[key] + " ("+ data.agentRunningCnt[key] + ")";
                    serverData.criticalCnt = data.cpuCriticalCnt[key] + " / "+ data.memoryCriticalCnt[key] + " / " + data.diskCriticalCnt[key];
                    serverData.warningCnt = data.cpuWarningCnt[key] + " / "+ data.memoryWarningCnt[key] + " / " + data.diskWarningCnt[key];

                    serverData.vmList = data.vmList[key];
                    serverData.templateList = data.templateList[key];
                    serverData.agentList = data.agentList[key];
                    serverData.criticalList = data.criticalList[key];
                    serverData.warningList = data.warningList[key];

                    serverDatas.push(serverData);

                });

                Ext.getCmp("serverSummaryGrid").getStore().loadData(serverDatas, false);

                //Project Summary
                var projectDatas = [{}];
                projectDatas[0].projectSummary = data.projectCnt;
                projectDatas[0].svnRepository = data.svnCnt;
                projectDatas[0].jenkinsJob = data.jenkinsCnt;

                Ext.getCmp("projectSummaryGrid").getStore().loadData(projectDatas, false);

                //S/W Summary
                var swDatas = [{}];
                swDatas[0].ewsHttpd = data.httpdCnt;
                swDatas[0].ewsTomcat = data.tomcatCnt;
                swDatas[0].eap = data.jbossCnt;

                Ext.getCmp("swSummaryGrid").getStore().loadData(swDatas, false);

                //Monitoring
                var cpuDatas = [], memoryDatas = [], diskDatas = [];
                Ext.each(data.cpuTopList, function(cpu){

                    var monitoringData = {};
                    monitoringData.instanceName = cpu.instanceName;
                    monitoringData.cpuUsed = cpu.used;
                    monitoringData.cpuFree = cpu.free;

                    cpuDatas.push(monitoringData);
                });

                Ext.getStore("DashboardCpuChartStore").loadData(cpuDatas, false);


                Ext.each(data.memoryTopList, function(memory){

                    var monitoringData = {};
                    monitoringData.instanceName = memory.instanceName;
                    monitoringData.memoryUsed = memory.used;
                    monitoringData.memoryFree = memory.free;

                    memoryDatas.push(monitoringData);
                });

                Ext.getStore("DashboardMemoryChartStore").loadData(memoryDatas, false);


                Ext.each(data.diskTopList, function(disk){

                    var monitoringData = {};
                    monitoringData.instanceName = disk.instanceName;
                    monitoringData.storageUsed = disk.used;
                    monitoringData.storageFree = disk.free;

                    diskDatas.push(monitoringData);

                });

                Ext.getStore("DashboardDiskChartStore").loadData(diskDatas, false);

            }
        });

    }

});
