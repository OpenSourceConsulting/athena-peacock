/*
 * File: app/controller/ALMController.js
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

Ext.define('MyApp.controller.ALMController', {
    extend: 'Ext.app.Controller',

    onAlmProjectGridCellClick: function(tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        //ALM Project Grid Item Click

        if(almConstants.selectRow == null || almConstants.selectRow.get("projectId") != record.get("projectId")) {

            almConstants.selectRow = record;

            this.selectAlmProjectGrid();
        }
    },

    onAlmUserGridCellClick: function(tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        //ALM User Grid Item Click

        if(almConstants.selectRow == null || almConstants.selectRow.get("userId") != record.get("userId")) {

            almConstants.selectRow = record;

            this.selectAlmUserGrid();
        }
    },

    onAlmUserGridBeforeItemContextMenu: function(dataview, record, item, index, e, eOpts) {
        //ALM User Grid Right Click Menu 호출

        var position = e.getXY();
        e.stopEvent();

        almConstants.selectRow = record;

        almConstants.userContextMenu.showAt(position);


    },

    onAlmGroupGridBeforeItemContextMenu: function(dataview, record, item, index, e, eOpts) {
        //ALM Group Grid Right Click Menu 호출

        var position = e.getXY();
        e.stopEvent();

        almConstants.selectRow = record;

        almConstants.groupContextMenu.showAt(position);


    },

    onAlmTabPanelTabChange: function(tabPanel, newCard, oldCard, eOpts) {
        if(newCard.title == "Project"){

            this.searchAlmProject();

        } else if(newCard.title == "User"){

            this.searchAlmUser();

        } else if(newCard.title == "Group"){

            almConstants.selectRow = null;

            Ext.getCmp("almGroupGrid").getStore().load();

            var detailPanel = Ext.getCmp("almGroupDetailPanel");
            detailPanel.layout.setActiveItem(0);

        }
    },

    onProjectTabPanelTabChange: function(tabPanel, newCard, oldCard, eOpts) {
        if(newCard.title == "Summary"){

            this.selectAlmProjectGrid();

        } else if(newCard.title == "User"){

            var grid = Ext.getCmp("almProjectUserGrid");

            var store = Ext.create('Ext.data.Store', {
                alias: 'store.ModeStore',
                autoLoad: false,
                fields: [{
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'text',
                    type: 'string'
                }],
                data: [
              { name : "A468827", text : "Remove User from Project"},
              { name : "BP08882", text : "Remove User from Project"}
            ]
            });

            grid.getView().bindStore(store);

        } else if(newCard.title == "Group"){

            var grid = Ext.getCmp("almProjectGroupGrid");

            var store = Ext.create('Ext.data.Store', {
                alias: 'store.ModeStore',
                autoLoad: false,
                fields: [{
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'text',
                    type: 'string'
                }],
                data: [
              { name : "A468827", text : "Remove Group from Project"},
              { name : "BP08882", text : "Remove Group from Project"}
            ]
            });

            grid.getView().bindStore(store);

        } else {

            var grid = Ext.getCmp("almProjectConfluenceGrid");

            var store = Ext.create('Ext.data.Store', {
                alias: 'store.ModeStore',
                autoLoad: false,
                fields: [{
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'text',
                    type: 'string'
                }],
                data: [
              { name : "Blank", text : "Remove Space from Project"},
              { name : "S", text : "Remove Space from Project"}
            ]
            });

            grid.getView().bindStore(store);

        }
    },

    onAlmGroupGridCellClick: function(tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        //ALM Project Grid Item Click

        if(almConstants.selectRow == null || almConstants.selectRow.get("name") != record.get("name")) {

            almConstants.selectRow = record;


            var groupDetailPanel = Ext.getCmp("almGroupDetailPanel");
            groupDetailPanel.layout.setActiveItem(1);

            //User Data Loading

            var groupForm = Ext.getCmp("almGroupForm");

            groupForm.getForm().reset();

            groupForm.getForm().waitMsgTarget = groupForm.getEl();
            //alert(almConstants.selectRow.get("username"))
            groupForm.getForm().load({
                 /*params : {
                    username : almConstants.selectRow.get("username")
                }
                ,*/url : GLOBAL.urlPrefix + "alm/groupmanagement/" + almConstants.selectRow.get("name")
                ,method : 'GET'
                ,waitMsg:'Loading...'
            });

            Ext.getCmp("almGroupTitleLabel").setText("<h2>"+almConstants.selectRow.get("name")+"</h2>", false);


            var grid = Ext.getCmp("almGroupUserGrid");

            var store = Ext.create('Ext.data.Store', {
                alias: 'store.ModeStore',
                autoLoad: false,
                fields: [{
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'text',
                    type: 'string'
                }],
                data: [
              { name : "A468827", text : "Remove User from Group"},
              { name : "BP08882", text : "Remove User from Group"}
            ]
            });

            grid.getView().bindStore(store);

        }
    },

    init: function(application) {
                //ALM Menu Config Setting

                var alm = this;

                var almUserGridContextMenu = new Ext.menu.Menu({
                    items:
                    [
                    { text: 'Edit',
                        handler: function() {
                            alm.showAlmUserWindow();
                        }
                    },
                    { text: 'Delete',
                        handler: function() {
                            alert('delete');
                        }
                    },
                    { text: 'Clone User',
                        handler: function() {
                            alm.showAlmUserWindow();
                        }
                    }
                    ]

                });

                var almGroupGridContextMenu = new Ext.menu.Menu({
                    items:
                    [
                    { text: 'Edit',
                        handler: function() {
                            alm.showAlmGroupWindow();
                        }
                    },
                    { text: 'Delete',
                        handler: function() {
                            alert('delete');
                        }
                    }
                    ]

                });

                //ALM Menu Constants
                Ext.define('almConstants', {
                    singleton: true,
                    me : alm,
                    userContextMenu: almUserGridContextMenu,
                    groupContextMenu: almGroupGridContextMenu,
                    selectRow : null
                });


        this.control({
            "#almProjectGrid": {
                cellclick: this.onAlmProjectGridCellClick
            },
            "#almUserGrid": {
                cellclick: this.onAlmUserGridCellClick,
                beforeitemcontextmenu: this.onAlmUserGridBeforeItemContextMenu
            },
            "#almGroupGrid": {
                beforeitemcontextmenu: this.onAlmGroupGridBeforeItemContextMenu,
                cellclick: this.onAlmGroupGridCellClick
            },
            "#almTabPanel": {
                tabchange: this.onAlmTabPanelTabChange
            },
            "#projectTabPanel": {
                tabchange: this.onProjectTabPanelTabChange
            }
        });
    },

    searchAlmProject: function(init) {

        if(init) {

            Ext.getCmp("almTabPanel").setActiveTab(0);
            Ext.getCmp("almProjectGrid").reconfigure(Ext.getCmp("almProjectGrid").store, Ext.getCmp("almProjectGrid").initialConfig.columns);
        }

        almConstants.selectRow = null;

        Ext.getCmp("almProjectGrid").getStore().load();

        var detailPanel = Ext.getCmp("almProjectDetailPanel");
        detailPanel.layout.setActiveItem(0);
    },

    searchAlmUser: function(init) {

        if(init) {
            Ext.getCmp("almUserGrid").reconfigure(Ext.getCmp("almUserGrid").store, Ext.getCmp("almUserGrid").initialConfig.columns);
        }

        almConstants.selectRow = null;

        Ext.getCmp("almUserGrid").getStore().load();

        var detailPanel = Ext.getCmp("almUserDetailPanel");
        detailPanel.layout.setActiveItem(0);
    },

    selectAlmProjectGrid: function() {

        var userDetailPanel = Ext.getCmp("almProjectDetailPanel");
        userDetailPanel.layout.setActiveItem(1);

        Ext.getCmp("projectTabPanel").setActiveTab(0);

        //Project Data Loading

        var projectForm = Ext.getCmp("almProjectForm");

        projectForm.getForm().reset();

        projectForm.getForm().waitMsgTarget = projectForm.getEl();

        projectForm.getForm().load({
            url : GLOBAL.urlPrefix + "alm/project/" + almConstants.selectRow.get("projectId")
            ,method : 'GET'
            ,waitMsg:'Loading...'
        });

        Ext.getCmp("almProjectTitleLabel").setText("<h2>"+almConstants.selectRow.get("projectName")+"</h2>", false);
    },

    selectAlmUserGrid: function() {

        var userDetailPanel = Ext.getCmp("almUserDetailPanel");
        userDetailPanel.layout.setActiveItem(1);

        //User Data Loading

        var userForm = Ext.getCmp("almUserForm");

        userForm.getForm().reset();

        userForm.getForm().waitMsgTarget = userForm.getEl();
        //alert(almConstants.selectRow.get("username"))
        userForm.getForm().load({
             /*params : {
                username : almConstants.selectRow.get("username")
            }
            ,*/url : GLOBAL.urlPrefix + "alm/usermanagement/" + almConstants.selectRow.get("userId")
            ,method : 'GET'
            ,waitMsg:'Loading...'
        });

        Ext.getCmp("almUserTitleLabel").setText("<h2>"+almConstants.selectRow.get("displayName")+"</h2>", false);
    },

    showAlmUserWindow: function() {
        var almUserWindow = Ext.create("widget.almUserWindow");

        almUserWindow.show();
    },

    showAlmGroupWindow: function() {
        var almGroupWindow = Ext.create("widget.almGroupWindow");

        almGroupWindow.show();
    }

});
