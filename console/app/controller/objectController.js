/*
 * File: app/controller/objectController.js
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

Ext.define('MyApp.controller.objectController', {
    extend: 'Ext.app.Controller',

    id: 'objectController',

    onObjectBucketsGridpanelCellClick: function(tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        objectConstants.selectRow = record;
        objectConstants.selectIndex = rowIndex;

        var gNm = record.get('name');

        Ext.Ajax.request({
            url: GLOBAL.urlPrefix + 'ceph/object/bucket?name=' + gNm,
            disableCaching : true,
            success: function(response){
                var data = Ext.decode(response.responseText);
                Ext.getCmp("objectBucketsDetail1").update(data.data);
                Ext.getCmp("objectBucketsDetail2").update(data.data.logging);

                Ext.getCmp("objectBucketsDetail").expand();
            }
        });

    },

    onObjectBucketsGridpanelCellDblClick: function(tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        objectConstants.selectRow = record;
        objectConstants.selectIndex = rowIndex;
        objectConstants.currentBucket = record.get('name');
        objectConstants.currentFolder = '';

        Ext.getCmp('objectCenterContainer').layout.setActiveItem(1);
        objectConstants.me.setObjectFilesData();

    },

    onObjectBucketsGridpanelBeforeItemContextMenu: function(dataview, record, item, index, e, eOpts) {
        objectConstants.selectRow = record;
        objectConstants.selectIndex = index;

        var position = e.getXY();
        e.stopEvent();
        objectConstants.bucketsContextMenu.showAt(position);
    },

    onbucketsCreateButtonClick: function(button, e, eOpts) {
        //Add Popup 호출

        var AddWindow = Ext.create('widget.createBucketWindow');
        AddWindow.title = 'Create Bucket';
        AddWindow.show();

        var myForm = Ext.getCmp("createBucketFormPanel");
        myForm.getForm().findField("createBucketName").focus();
    },

    onbucketsCreateMenuitemClick: function(item, e, eOpts) {
        //Add Popup 호출

        var AddWindow = Ext.create('widget.createBucketWindow');
        AddWindow.title = 'Create Bucket';
        AddWindow.show();

        var myForm = Ext.getCmp("createBucketFormPanel");
        myForm.getForm().findField("createBucketName").focus();
    },

    onbucketsDeleteMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.deleteObjectBucket();
    },

    onbucketsEmptyMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.emptyObjectBucket();
    },

    onbucketsRefreshMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.setObjectBucketsData();
    },

    onCreateBucketNameTextfieldSpecialkey: function(field, e, eOpts) {
        if (e.getKey() == e.ENTER) {
            this.createObjectBucket();
        }
    },

    onCreateFolderNameTextfieldSpecialkey: function(field, e, eOpts) {
        if (e.getKey() == e.ENTER) {
            this.createfolderObjectFile();
        }
    },

    onRenameFileNameTextfieldSpecialkey: function(field, e, eOpts) {
        if (e.getKey() == e.ENTER) {
            this.renameObjectFile();
        }
    },

    onObjectFilesGridpanelCellClick: function(tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        objectConstants.selectFilesRow = record;
        objectConstants.selectFilesIndex = rowIndex;

        objectConstants.me.setFilesMenuEnable(record);

        var key = record.get('key');
        var isFolder = record.get('folder');
        var folder = objectConstants.currentFolder;

        Ext.Ajax.request({
        //    url: GLOBAL.urlPrefix + 'ceph/object/object?bucketName='+objectConstants.currentBucket + '&key='+key,
            url: GLOBAL.urlPrefix + 'ceph/object/object/detail',
            method: 'POST',
            params: {'bucketName':objectConstants.currentBucket, 'key':key},
            disableCaching : true,
            success: function(response){
                var data = Ext.decode(response.responseText);

                if ((objectConstants.currentBucket == data.data.bucketName) && (objectConstants.currentFolder == folder)) {
                    data.data.folder = isFolder;
                    Ext.getCmp("objectFilesDetail1").update(data.data);
                    Ext.getCmp("objectFilesDetail2").update(data.data.acl.grantsAsList);

                    Ext.getCmp("objectFilesDetail").expand();
                }
            }
        });

    },

    onObjectFilesGridpanelCellDblClick: function(tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        objectConstants.me.openObjectFile();

    },

    onObjectFilesGridpanelBeforeItemContextMenu: function(dataview, record, item, index, e, eOpts) {
        objectConstants.selectFilesRow = record;
        objectConstants.selectFilesIndex = index;

        objectConstants.me.setFilesMenuEnable(record);

        var position = e.getXY();
        e.stopEvent();
        objectConstants.filesContextMenu.showAt(position);
    },

    onfilesAllBucketsButtonClick: function(button, e, eOpts) {
        Ext.getCmp('objectCenterContainer').layout.setActiveItem(0);

    },

    onfilesUploadButtonClick: function(button, e, eOpts) {
        objectConstants.me.uploadFileClick();
    },

    onfilesOpenMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.openObjectFile();
    },

    onfilesDownloadMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.downloadObjectFile();
    },

    onfilesCreatefolderMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.createObjectFolder();

    },

    onfilesUploadMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.uploadFileClick();
    },

    onfilesMakepublicMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.makepublicObjectFile();
    },

    onfilesMakeprotectedMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.makeprotectedObjectFile();
    },

    onfilesRenameMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.renameFileClick();

    },

    onfilesDeleteMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.deleteObjectFile();
    },

    onfilesCutMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.cutObjectFile();
    },

    onfilesCopyMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.copyObjectFile();
    },

    onfilesPasteMenuitemClick: function(item, e, eOpts) {
        objectConstants.me.pasteObjectFile();
    },

    setObjectBucketsData: function() {
        Ext.getCmp('objectBucketsGrid').getStore().load();

    },

    createObjectBucket: function() {
        //Create Bucket Execute

        var myForm = Ext.getCmp("createBucketFormPanel");
        if (myForm.getForm().isValid() !== true) {
            Ext.MessageBox.alert('알림', '유효하지 않은 입력값이 존재합니다.');
            return;
        }

        var values = myForm.getValues();

        var nameField = myForm.getForm().findField("createBucketName");
        var name = nameField.getValue();

        if (name !== '') {
            var myGrid = Ext.getCmp("objectBucketsGrid");
            var myStore = myGrid.getStore();
            var myName = '';

            for (var i = 0; i < myStore.count(); i++) {
                myName = myStore.getAt(i).get('name');
                if (myName == name) {
                    alert('Bucket name(' + name + ') already exist.');
                    nameField.focus();
                    return;
                }
            }

            Ext.Ajax.request({
                url: GLOBAL.urlPrefix + "ceph/object/bucket",
                method: 'POST',
                params: values,
                success: function(response){
                    var data = Ext.decode(response.responseText);

                    objectConstants.me.setObjectBucketsData();
                },
                failure: function(response){
                    var data = Ext.decode(response.responseText);

                    Ext.Msg.show({
                        title:'Error',
                        msg: 'Error on Create Bucket.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });
        }

        myForm.up('window').close();

    },

    deleteObjectBucket: function() {
        var name = objectConstants.selectRow.get('name');

        Ext.Msg.show({
            title:'Confirm',
            msg: 'Delete selected Bucket?',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'ok') {
                    Ext.Ajax.request({
                        url: GLOBAL.urlPrefix + "ceph/object/bucket/delete",
                        method: 'POST',
                        params:{'bucketName':name},
                        success: function(response){
                            var data = Ext.decode(response.responseText);
                            objectConstants.me.setObjectBucketsData();
                        },
                        failure: function(response){
                            var data = Ext.decode(response.responseText);

                            Ext.Msg.show({
                                title:'Error',
                                msg: 'Error on Delete Bucket.',
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.ERROR
                            });
                        }
                    });
                }
            }
        });

    },

    emptyObjectBucket: function() {
        var name = objectConstants.selectRow.get('name');

        Ext.Msg.show({
            title:'Confirm',
            msg: 'Empty selected Bucket?',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'ok') {
                    Ext.Ajax.request({
                        url: GLOBAL.urlPrefix + "ceph/object/bucket?bucketName=" + name,
                        method: 'PUT',
                        success: function(response){
                            var data = Ext.decode(response.responseText);

                            Ext.Msg.show({
                                title:'Information',
                                msg: 'Empty Bucket success.',
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.INFO
                            });
                        },
                        failure: function(response){
                            var data = Ext.decode(response.responseText);

                            Ext.Msg.show({
                                title:'Error',
                                msg: 'Error on Empty Bucket.',
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.ERROR
                            });
                        }
                    });
                }
            }
        });

    },

    setObjectFilesData: function() {
        var store = Ext.getCmp('objectFilesGrid').getStore();

        if (objectConstants.currentFolder !== '') {
            store.getProxy().extraParams = {
                bucketName : objectConstants.currentBucket,
                parentPath : objectConstants.currentFolder
            };
        } else {
            store.getProxy().extraParams = {
                bucketName : objectConstants.currentBucket
            };
        }
        store.load();

        var toolBar = Ext.getCmp('objectFilesTopAddrToolbar');

        toolBar.removeAll();
        var button = {
            xtype: 'button',
            id: 'filesAllBuckets',
            itemId: 'filesAllBuckets',
            style: {
                color: '#66f'
            },
            width: 100,
            text: 'All Buckets'
        };
        Ext.getCmp('objectFilesTopAddrToolbar').add(button);

        objectConstants.me.addFilesFolderButton(objectConstants.currentBucket, '');

        if (objectConstants.currentFolder !== '') {
            var key='';
            var splitKey = objectConstants.currentFolder.split('/');

            var i_count = splitKey.length;
            if (splitKey[splitKey.length - 1] === '') {
                i_count -= 1;
            }

            var i_width = Ext.getCmp('objectFilesTopAddrToolbar').getWidth();
            var i_max = (i_count * 130) + 250;
            var i_start = 0;
            if (i_max > i_width) {
                i_start = Math.floor((i_max - i_width - 1) / 130) + 1;
                if (i_start >= i_count) {
                    i_start = i_count - 1;
                }

                if (i_start > 0) {
                    Ext.getCmp('objectFilesTopAddrToolbar').add('>');
                    Ext.getCmp('objectFilesTopAddrToolbar').add('...');
                }
            }

            for (var i = 0; i < i_start; i++) {
                key += splitKey[i] + '/';
            }
            for (var i = i_start; i < splitKey.length; i++) {
                key += splitKey[i] + '/';
                if (splitKey[i] !== '') {
                    objectConstants.me.addFilesFolderButton(splitKey[i], key);
                }
            }
        }

        Ext.getCmp("objectFilesDetail1").update(null);
        Ext.getCmp("objectFilesDetail2").update(null);
        Ext.getCmp("objectFilesDetail").collapse();





























    },

    createObjectFolder: function() {
        //Add Popup 호출

        var AddWindow = Ext.create('widget.createFolderWindow');
        AddWindow.title = 'Create Folder';
        AddWindow.show();

        var myForm = Ext.getCmp("createFolderFormPanel");
        myForm.getForm().findField("createFolderName").focus();

    },

    uploadFileClick: function() {
        //Upload Popup 호출

        var AddWindow = Ext.create('widget.uploadFileWindow');
        AddWindow.title = 'Upload';
        AddWindow.show();


    },

    renameFileClick: function() {
        //Rename Popup 호출

        var name = objectConstants.selectFilesRow.get('objectName');
        var folder = objectConstants.selectFilesRow.get('folder');

        if (folder !== true) {
            var AddWindow = Ext.create('widget.renameFileWindow');
            AddWindow.title = 'Rename';

            var myForm = Ext.getCmp("renameFileFormPanel");
            var nameField = myForm.getForm().findField("renameFileName");

            nameField.setValue(name);
            AddWindow.show();
        }

    },

    openObjectFile: function() {
        var key = objectConstants.selectFilesRow.get('key');
        var folder = objectConstants.selectFilesRow.get('folder');

        if (folder === true) {
            objectConstants.currentFolder = key;
            objectConstants.me.setObjectFilesData();
        }

    },

    downloadObjectFile: function() {
        Ext.Msg.show({
            title:'Confirm',
            msg: 'Download selected files?',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'ok') {
                    var selections = Ext.getCmp('objectFilesGrid').selModel.getSelection();
                    var idx = 0;

                    Ext.each(selections, function(recs){
                        if (recs.get('folder') !== true) {
                            var key = recs.get('key');

                            Ext.Ajax.request({
                                //url: GLOBAL.urlPrefix + 'ceph/object/object?bucketName='+objectConstants.currentBucket + '&key='+key,
                                url: GLOBAL.urlPrefix + 'ceph/object/object/detail',
                                method: 'POST',
                                params: {'bucketName':objectConstants.currentBucket, 'key':key},
                                disableCaching : true,
                                success: function(response){
                                    var data = Ext.decode(response.responseText);

                                    var link = document.createElement('a');
                                    link.download = data.data.key;
                                    link.href = data.data.url;
                                    link.click();
                                }
                            });
                        }
                    });
                }
            }
        });

    },

    createfolderObjectFile: function() {
        //Create Folder Execute

        var myForm = Ext.getCmp("createFolderFormPanel");
        if (myForm.getForm().isValid() !== true) {
            Ext.MessageBox.alert('알림', '유효하지 않은 입력값이 존재합니다.');
            return;
        }

        myForm.getForm().findField("createFolderBucket").setValue(objectConstants.currentBucket);
        myForm.getForm().findField("createFolderParent").setValue(objectConstants.currentFolder);

        var values = myForm.getValues();

        var nameField = myForm.getForm().findField("createFolderName");
        var name = nameField.getValue() + '/';

        if (name !== '') {
            var myGrid = Ext.getCmp("objectFilesGrid");
            var myStore = myGrid.getStore();
            var myName = '';

            for (var i = 0; i < myStore.count(); i++) {
                myName = myStore.getAt(i).get('objectName');
                if (myName == name) {
                    alert('Folder name(' + name + ') already exist.');
                    nameField.focus();
                    return;
                }
            }

            Ext.Ajax.request({
                url: GLOBAL.urlPrefix + "ceph/object/folder",
                method: 'POST',
                params: values,
                success: function(response){
                    var data = Ext.decode(response.responseText);

                    objectConstants.me.setObjectFilesData();
                },
                failure: function(response){
                    var data = Ext.decode(response.responseText);

                    Ext.Msg.show({
                        title:'Error',
                        msg: 'Error on Create Folder.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });
        }

        myForm.up('window').close();

    },

    makepublicObjectFile: function() {
        var bucketName = objectConstants.currentBucket;
        var key = '';
        var permission = 'public-read-write';  //private | public-read | public-read-write | authenticated-read | bucket-owner-read | bucket-owner-full-control
        var pars = null;

        Ext.Msg.show({
            title:'Confirm',
            msg: 'Make to Public Objects?',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'ok') {
                    var selections = Ext.getCmp('objectFilesGrid').selModel.getSelection();
                    Ext.each(selections, function(recs){
                        key = recs.get('key');

                        pars = { 'bucketName':bucketName, 'key':key, 'permission' : permission };

                        Ext.Ajax.request({
                            url: GLOBAL.urlPrefix + "ceph/object/object",
                            method: 'PUT',
                            jsonData: pars,
                            success: function(response){
                                var data = Ext.decode(response.responseText);
                                objectConstants.me.setObjectFilesData();
                            },
                            failure: function(response){
                                var data = Ext.decode(response.responseText);
                                Ext.Msg.show({
                                    title:'Error',
                                    msg: 'Error on Make Public Object. (' + key + ')',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.ERROR
                                });
                            }
                        });
                    });
                }
            }
        });

    },

    makeprotectedObjectFile: function() {
        var bucketName = objectConstants.currentBucket;
        var key = '';
        var permission = 'private';  //private | public-read | public-read-write | authenticated-read | bucket-owner-read | bucket-owner-full-control
        var pars = null;

        Ext.Msg.show({
            title:'Confirm',
            msg: 'Make to Protected Objects?',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'ok') {
                    var selections = Ext.getCmp('objectFilesGrid').selModel.getSelection();
                    Ext.each(selections, function(recs){
                        key = recs.get('key');

                        pars = { 'bucketName':bucketName, 'key':key, 'permission' : permission };

                        Ext.Ajax.request({
                            url: GLOBAL.urlPrefix + "ceph/object/object",
                            method: 'PUT',
                            jsonData: pars,
                            success: function(response){
                                var data = Ext.decode(response.responseText);
                                objectConstants.me.setObjectFilesData();
                            },
                            failure: function(response){
                                var data = Ext.decode(response.responseText);
                                Ext.Msg.show({
                                    title:'Error',
                                    msg: 'Error on Make Public Object. (' + key + ')',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.ERROR
                                });
                            }
                        });
                    });
                }
            }
        });

    },

    renameObjectFile: function() {
        //Rename File Execute

        var objectName = objectConstants.selectFilesRow.get('objectName');
        var values = null;

        var myForm = Ext.getCmp("renameFileFormPanel");
        if (myForm.getForm().isValid() !== true) {
            Ext.MessageBox.alert('알림', '유효하지 않은 입력값이 존재합니다.');
            return;
        }

        var nameField = myForm.getForm().findField("renameFileName");
        var newName = nameField.getValue();

        if (newName !== objectName) {
            var myGrid = Ext.getCmp("objectFilesGrid");
            var myStore = myGrid.getStore();
            var myName = '';

            for (var i = 0; i < myStore.count(); i++) {
                myName = myStore.getAt(i).get('objectName');
                if (myName == newName) {
                    alert('Object name(' + newName + ') already exist.');
                    nameField.focus();
                    return;
                }
            }

            myForm.getForm().findField("renameKey").setValue(objectConstants.currentFolder + objectName);
            myForm.getForm().findField("renameObjectName").setValue(objectName);
            myForm.getForm().findField("renameBucketName").setValue(objectConstants.currentBucket);
            values = myForm.getValues();

            Ext.Ajax.request({
                url: GLOBAL.urlPrefix + "ceph/object/object",
                method: 'PUT',
                jsonData: values,
                success: function(response){
                    var data = Ext.decode(response.responseText);
                    objectConstants.me.setObjectFilesData();

                    // Empty Selections
                    objectConstants.filesSelectBucket = '';
                    objectConstants.filesSelectList = null;

                    Ext.getCmp("filesPasteMenuItem").disable();
                    Ext.getCmp("filesPasteMenu").disable();
                },
                failure: function(response){
                    var data = Ext.decode(response.responseText);

                    Ext.Msg.show({
                        title:'Error',
                        msg: 'Error on Rename Object.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });

            myForm.up('window').close();
        } else {
            nameField.focus();
        }

    },

    deleteObjectFile: function() {
        var bucketName = objectConstants.currentBucket;
        var key = '';
        var isFolder = false;
        var pars = '';

        Ext.Msg.show({
            title:'Confirm',
            msg: 'Delete selected Objects?',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'ok') {
                    var selections = Ext.getCmp('objectFilesGrid').selModel.getSelection();
                    Ext.each(selections, function(recs){
                        key = recs.get('key');
                        isFolder = recs.get('folder');

        //                pars = 'bucketName=' + bucketName + '&' + 'key=' + key + '&' + 'isFolder=' + isFolder;
                        Ext.Ajax.request({
        //                    url: GLOBAL.urlPrefix + "ceph/object/object/delete?" + pars,
                            url: GLOBAL.urlPrefix + "ceph/object/object/delete",
                            method: 'POST',
                            params: {'bucketName':bucketName, 'key':key, 'isFolder':isFolder},
                            success: function(response){
                                var data = Ext.decode(response.responseText);
                                objectConstants.me.setObjectFilesData();
                            },
                            failure: function(response){
                                var data = Ext.decode(response.responseText);
                                Ext.Msg.show({
                                    title:'Error',
                                    msg: 'Error on Delete Object. (' + key + ')',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.ERROR
                                });
                            }
                        });
                    });

                    // Empty Selections
                    objectConstants.filesSelectBucket = '';
                    objectConstants.filesSelectList = null;

                    Ext.getCmp("filesPasteMenuItem").disable();
                    Ext.getCmp("filesPasteMenu").disable();
                }
            }
        });

    },

    cutObjectFile: function() {
        objectConstants.filesSelectMode = 'cut';
        objectConstants.filesSelectBucket = objectConstants.currentBucket;
        objectConstants.filesSelectList = Ext.getCmp('objectFilesGrid').selModel.getSelection();

    },

    copyObjectFile: function() {
        objectConstants.filesSelectMode = 'copy';
        objectConstants.filesSelectBucket = objectConstants.currentBucket;
        objectConstants.filesSelectList = Ext.getCmp('objectFilesGrid').selModel.getSelection();

    },

    pasteObjectFile: function() {
        var values = null;
        var url = 'ceph/object/';
        var msg = 'Paste ';
        if (objectConstants.filesSelectMode == 'cut') {
            msg += 'cutted Objects?';
            url += 'move';
        } else {
            msg += 'coppied Objects?';
            url += 'copy';
        }

        Ext.Msg.show({
            title:'Confirm',
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'ok') {
                    Ext.each(objectConstants.filesSelectList, function(recs){
                        if (recs.get('folder') !== true) {
                            values = {
                                'bucketName':objectConstants.filesSelectBucket,
                                'key':recs.get('key'),
                                'objectName':recs.get('objectName'),
                                'targetBucketName':objectConstants.currentBucket,
                                'parentPath':objectConstants.currentFolder
                            };

                            Ext.Ajax.request({
                                url: GLOBAL.urlPrefix + url,
                                method: 'POST',
                                jsonData: values,
                                success: function(response){
                                    var data = Ext.decode(response.responseText);
                                    objectConstants.me.setObjectFilesData();
                                },
                                failure: function(response){
                                    var data = Ext.decode(response.responseText);
                                    Ext.Msg.show({
                                        title:'Error',
                                        msg: 'Error on Coping(Moving) Objects.',
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.Msg.ERROR
                                    });
                                }
                            });
                        }
                    });

                    if (objectConstants.filesSelectMode == 'cut') {
                        objectConstants.filesSelectBucket = '';
                        objectConstants.filesSelectList = null;

                        Ext.getCmp("filesPasteMenuItem").disable();
                        Ext.getCmp("filesPasteMenu").disable();
                    }
                }
            }
        });

    },

    addFilesFolderButton: function(name, key) {
        var button = {
            xtype : 'button',
            text : name,
            width : 100,
            style: {
                color: '#66f'
            },
            listeners : {
                click : function(){
                    objectConstants.currentFolder = key;
                    objectConstants.me.setObjectFilesData();
                }
            }
        };

        Ext.getCmp('objectFilesTopAddrToolbar').add('>');
        Ext.getCmp('objectFilesTopAddrToolbar').add(button);
    },

    setFilesMenuEnable: function(record) {
        var folder = record.get('folder');
        if (folder === true) {
            Ext.getCmp("filesOpenMenuItem").enable();
            Ext.getCmp("filesDownloadMenuItem").disable();
            Ext.getCmp("filesRenameMenuItem").disable();

            Ext.getCmp("filesOpenMenu").enable();
            Ext.getCmp("filesDownloadMenu").disable();
            Ext.getCmp("filesRenameMenu").disable();
        } else {
            Ext.getCmp("filesOpenMenuItem").disable();
            Ext.getCmp("filesDownloadMenuItem").enable();
            Ext.getCmp("filesRenameMenuItem").enable();

            Ext.getCmp("filesOpenMenu").disable();
            Ext.getCmp("filesDownloadMenu").enable();
            Ext.getCmp("filesRenameMenu").enable();
        }

        var cnt = Ext.getCmp('objectFilesGrid').selModel.getSelection().length;
        if (cnt > 0) {
            Ext.getCmp("filesPasteMenuItem").enable();
            Ext.getCmp("filesPasteMenu").enable();
        } else {
            Ext.getCmp("filesPasteMenuItem").disable();
            Ext.getCmp("filesPasteMenu").disable();
        }

    },

    init: function(application) {
                var objects = this;

                var bucketsGridContextMenu = new Ext.menu.Menu({
                    items:
                    [
                    { text: 'Delete Bucket',
                        handler: function() {
                            objects.deleteObjectBucket();
                        }
                    },
                    { text: 'Empty Bucket',
                        handler: function() {
                            objects.emptyObjectBucket();
                        }
                    }
                    ]
                });

                var filesGridContextMenu = new Ext.menu.Menu({
                    items:
                    [
                    { text: 'Open',
                        id: 'filesOpenMenu',
                        handler: function() {
                            objects.openObjectFile();
                        }
                    },
                    { text: 'Download',
                        id: 'filesDownloadMenu',
                        handler: function() {
                            objects.downloadObjectFile();
                        }
                    },
                    /*
                    { text: 'Create Folder',
                    id: 'filesCreatefolderMenu',
                    handler: function() {
                    objects.createObjectFolder();
                    }
                    },
                    { text: 'Upload',
                    id: 'filesUploadMenu',
                    handler: function() {
                    objects.uploadFileClick();
                    }
                    },
                    */
                    { text: 'Make Public',
                        id: 'filesMakepublicMenu',
                        handler: function() {
                            objects.makepublicObjectFile();
                        }
                    },
                    { text: 'Make Protected',
                        id: 'filesMakeprotectedMenu',
                        handler: function() {
                            objects.makeprotectedObjectFile();
                        }
                    },
                    { text: 'Rename',
                        id: 'filesRenameMenu',
                        handler: function() {
                            objects.renameFileClick();
                        }
                    },
                    { text: 'Delete',
                        id: 'filesDeleteMenu',
                        handler: function() {
                            objects.deleteObjectFile();
                        }
                    },
                    {
                        xtype: 'menuseparator'
                    },
                    { text: 'Cut',
                        id: 'filesCutMenu',
                        handler: function() {
                            objects.cutObjectFile();
                        }
                    },
                    { text: 'Copy',
                        id: 'filesCopyMenu',
                        handler: function() {
                            objects.copyObjectFile();
                        }
                    },
                    { text: 'Paste',
                        id: 'filesPasteMenu',
                        handler: function() {
                            objects.pasteObjectFile();
                        }
                    }
                    ]
                });

                Ext.define('objectConstants', {
                    singleton: true,
                    me : objects,
                    bucketsContextMenu: bucketsGridContextMenu,
                    filesContextMenu: filesGridContextMenu,
                    currentBucket: '',
                    currentFolder: '',
                    filesSelectList: null,
                    filesSelectMode: 'cut',
                    filesSelectBucket: '',
                    selectRow:  null,
                    selectIndex: 0,
                    selectFilesRow:  null,
                    selectFilesIndex: 0
                });

        this.control({
            "#objectBucketsGrid": {
                cellclick: this.onObjectBucketsGridpanelCellClick,
                celldblclick: this.onObjectBucketsGridpanelCellDblClick,
                beforeitemcontextmenu: this.onObjectBucketsGridpanelBeforeItemContextMenu
            },
            "#bucketsCreateButton": {
                click: this.onbucketsCreateButtonClick
            },
            "#bucketsCreateMenuItem": {
                click: this.onbucketsCreateMenuitemClick
            },
            "#bucketsDeleteMenuItem": {
                click: this.onbucketsDeleteMenuitemClick
            },
            "#bucketsEmptyMenuItem": {
                click: this.onbucketsEmptyMenuitemClick
            },
            "#bucketsRefreshMenuItem": {
                click: this.onbucketsRefreshMenuitemClick
            },
            "#createBucketName": {
                specialkey: this.onCreateBucketNameTextfieldSpecialkey
            },
            "#createFolderName": {
                specialkey: this.onCreateFolderNameTextfieldSpecialkey
            },
            "#renameFileName": {
                specialkey: this.onRenameFileNameTextfieldSpecialkey
            },
            "#objectFilesGrid": {
                cellclick: this.onObjectFilesGridpanelCellClick,
                celldblclick: this.onObjectFilesGridpanelCellDblClick,
                beforeitemcontextmenu: this.onObjectFilesGridpanelBeforeItemContextMenu
            },
            "#filesAllBuckets": {
                click: this.onfilesAllBucketsButtonClick
            },
            "#filesUploadButton": {
                click: this.onfilesUploadButtonClick
            },
            "#filesOpenMenuItem": {
                click: this.onfilesOpenMenuitemClick
            },
            "#filesDownloadMenuItem": {
                click: this.onfilesDownloadMenuitemClick
            },
            "#filesCreatefolderMenuItem": {
                click: this.onfilesCreatefolderMenuitemClick
            },
            "#filesUploadMenuItem": {
                click: this.onfilesUploadMenuitemClick
            },
            "#filesMakepublicMenuItem": {
                click: this.onfilesMakepublicMenuitemClick
            },
            "#filesMakeprotectedMenuItem": {
                click: this.onfilesMakeprotectedMenuitemClick
            },
            "#filesRenameMenuItem": {
                click: this.onfilesRenameMenuitemClick
            },
            "#filesDeleteMenuItem": {
                click: this.onfilesDeleteMenuitemClick
            },
            "#filesCutMenuItem": {
                click: this.onfilesCutMenuitemClick
            },
            "#filesCopyMenuItem": {
                click: this.onfilesCopyMenuitemClick
            },
            "#filesPasteMenuItem": {
                click: this.onfilesPasteMenuitemClick
            }
        });
    }

});
