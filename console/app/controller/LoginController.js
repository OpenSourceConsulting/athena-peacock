/*
 * File: app/controller/LoginController.js
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

Ext.define('MyApp.controller.LoginController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'userName',
            selector: '#userName'
        },
        {
            ref: 'password',
            selector: '#password'
        },
        {
            ref: 'passwdResetLabel',
            selector: '#passwdResetLabel'
        },
        {
            ref: 'userSplitBtn',
            selector: '#userSplitBtn'
        }
    ],

    doLogin: function(button, e, eOpts) {

        var form = Ext.getCmp("loginForm"),			// Login form
            formWindow = Ext.getCmp('loginWindow'),	// Login form window
            values = form.getValues();				// Form values

        var me = this;

        var userName = this.getUserName(),
            password = this.getPassword();

        var userNameVal = userName.getValue(),
            passwordVal = password.getValue();

        // Success
        var successCallback = function(resp, ops) {

            var response = Ext.decode(resp.responseText);
            if(response.success){
                me.successfulLogin(response.data, "json");
            }
            else {
                failureCallback(response, ops);
            }

        };


        // Failure
        var failureCallback = function(resp, ops) {

            var msg = "로그인에 실패하였습니다.";
            if(resp.msg !== null) {
                msg = resp.msg;
            }
            // Show login failure error
            Ext.Msg.alert({
                title: "Login Failure",
                msg: msg,
                buttons: Ext.Msg.OK,
                fn: function(choice) {
                    password.setValue("");
                    password.focus();
                },
                icon: Ext.Msg.ERROR
            });
        };

        if (userNameVal === "") {

            // username must not be null.
            Ext.Msg.show({
                title: "Message",
                msg: "사용자아이디를 입력해주세요.",
                buttons: Ext.Msg.OK,
                fn: function(choice) {
                    userName.focus();
                },
                icon: Ext.Msg.WARNING
            });
        } else if (passwordVal === "") {

            // password must not be null.
            Ext.Msg.show({
                title: "Message",
                msg: "비밀번호를 입력해주세요.",
                buttons: Ext.Msg.OK,
                fn: function(choice) {
                    password.focus();
                },
                icon: Ext.Msg.WARNING
            });
        } else {

            //TODO: Login using server-side authentication service
            Ext.Ajax.request({
                url: GLOBAL.urlPrefix + "user/login",
                params: values,
                success: successCallback,
                failure: failureCallback
            });


        /*
            var response = {
                'userId': 'admin',
                'loginId': 'admin',
                'userName': 'admin',
                'deptName': 'admin',
                'email': 'email',
                'lastLogon'	: '2015.10.08 10:37:55',
                'authorities' : {'authority': 'ROLE_ADMIN'}
            };
            me.successfulLogin(response, "json");
        */
        }
    },

    detectPasswordSpecialkey: function(field, e, eOpts) {

        if (e.getKey() == e.ENTER) {
            this.doLogin();
        }
    },

    detectUsernameSpecialkey: function(field, e, eOpts) {

        if (e.getKey() == e.ENTER) {
            this.doLogin();
        }
    },

    popupLoginWindow: function(button, e, eOpts) {
        var login = Ext.create("widget.loginWindow");

        // Show window
        login.show();

        this.getUserName().focus();

        /**
          * 비밀번호 재설정 Label click event를 catch 하도록 설정
          */
        this.getPasswdResetLabel().getEl().on('click', function() {
            Ext.Msg.show({
                title: "Message",
                msg: "Password reset funtion isn't implemented yet.",
                buttons: Ext.Msg.OK,
                fn: function(choice) {
                    // do nothing.
                },
                icon: Ext.Msg.QUESTION
            });
        });

    },

    doEditProfile: function(item, e, eOpts) {

        /* Edit My Account */
        var sessionInfo = Ext.getStore('SessionStore');

        userConstants.me.showUserWindow('myAccount', sessionInfo.getAt(0).get("userId"));
    },

    doLogout: function(item, e, eOpts) {

        Ext.Ajax.request({
            url: GLOBAL.urlPrefix + 'user/logout',
            disableCaching : true,
            success: function(response){

                var sessionInfo = Ext.getStore('SessionStore');
                sessionInfo.removeAll();
                sessionInfo.sync();

                window.location.reload();

            }
        });

    },

    doSettings: function(item, e, eOpts) {
        Ext.getCmp("centerContainer").layout.setActiveItem(1);
    },

    introPanelActivate: function(component, eOpts) {
        //Login Session Check
        var sessionInfo = Ext.getStore('SessionStore');
        sessionInfo.load();

        if(null != sessionInfo.getAt(0)){
            this.successfulLogin(sessionInfo.getAt(0), "model");

        } else {

            // Create new login form window
            var login = Ext.create("widget.loginWindow");

            // Show window
            login.show();

            this.getUserName().focus();

        }

    },

    successfulLogin: function(session, ops) {

        //Login Session 설정
        this.session = session;

        var sessionInfo = Ext.getStore('SessionStore');
        sessionInfo.removeAll();
        sessionInfo.sync();

        var newRecord;
        if(ops == 'json') {

            newRecord = new MyApp.model.SessionModel({
                userId		: this.session.userId,
                loginId		: this.session.loginId,
                userName	: this.session.userName,
                deptName	: this.session.deptName,
                email		: this.session.email,
                lastLogon	: this.session.lastLogon,
                authorities : this.session.authorities
            });

        } else {

            newRecord = new MyApp.model.SessionModel({
                userId		: this.session.get("userId"),
                loginId		: this.session.get("loginId"),
                userName	: this.session.get("userName"),
                deptName	: this.session.get("deptName"),
                email		: this.session.get("email"),
                lastLogon	: this.session.get("lastLogon"),
                authorities : this.session.get("authorities")
            });

        }

        sessionInfo.add(newRecord);
        sessionInfo.sync();

        // Close window
        var loginWindow = Ext.getCmp('loginWindow');
        if(loginWindow != null) {
            Ext.getCmp('loginWindow').destroy();
        }

        //Main Layout 설정
        Ext.getCmp("peacockViewport").layout.setActiveItem(1);
        this.getUserSplitBtn().setText(newRecord.get("userName"));
        Ext.getCmp("topLastLogonLabel").setText("(최근 접속시간 : "+newRecord.get("lastLogon")+")");

        //Menu 권한 설정
        this.initMenuAuthSetting();
    },

    initMenuAuthSetting: function() {

        var menuTreeStore = Ext.getStore("MenuTreeStore");

        var sessionStore = Ext.getStore('SessionStore');
        var authorities = sessionStore.getAt(0).get("authorities");

        var adminFlag = false;

        Ext.each(authorities, function (auth){

            if(auth.authority == "ROLE_ADMIN") {
                adminFlag = true;
                return true;
            }

        });

        if(adminFlag) {

            instancesConstants.writeMenuAuth = true;
            RHEVMConstants.writeMenuAuth = true;
            almConstants.writeMenuAuth01 = true;
            almConstants.writeMenuAuth02 = true;
            almConstants.writeMenuAuth03 = true;
            almConstants.writeMenuAuth04 = true;
            userConstants.writeMenuAuth01 = true;
            userConstants.writeMenuAuth02 = true;

        } else {

            //Left Menu Read 권한 설정
            Ext.getCmp("menuTreePanel").getRootNode().cascadeBy(function(n) {

                var displayFlag = false;

                if(n.id.indexOf("DASHBOARD") > -1) {

                    displayFlag = true;

                } else {

                    Ext.each(authorities, function (auth){

                        if(n.id.indexOf(auth.authority) > -1) {
                            displayFlag = true;
                            return false;
                        }

                    });

                    var el = Ext.fly(Ext.getCmp("menuTreePanel").getView().getNodeByRecord(n));
                    if (el != null) {
                        el.setDisplayed(displayFlag);
                    }
                }

            });

            //그 외 설정
            Ext.getCmp("almTabPanel").items.each(function(item, idx){
                Ext.getCmp("almTabPanel").items.getAt(idx).setDisabled(true);
            });

            Ext.getCmp("adminTabPanel").items.each(function(item, idx){
                Ext.getCmp("adminTabPanel").items.getAt(idx).setDisabled(true);
            });

            Ext.get("instancesContainer").select(".auth-write").hide();
            Ext.get("rhevmContainer").select(".auth-write").hide();

            Ext.each(authorities, function (auth){

                if(auth.authority == "ROLE_B1_WRITE") {

                    instancesConstants.writeMenuAuth = true;
                    Ext.get("instancesContainer").select(".auth-write").show();

                } else if(auth.authority == "ROLE_B2_WRITE") {

                    RHEVMConstants.writeMenuAuth = true;
                    Ext.get("rhevmContainer").select(".auth-write").show();

                } else if(auth.authority == "ROLE_B301_READ") {

                    Ext.getCmp("almTabPanel").items.getAt(0).setDisabled(false);

                } else if(auth.authority == "ROLE_B301_WRITE") {

                    almConstants.writeMenuAuth01 = true;

                } else if(auth.authority == "ROLE_B302_READ") {

                    Ext.getCmp("almTabPanel").items.getAt(1).setDisabled(false);

                } else if(auth.authority == "ROLE_B302_WRITE") {

                    almConstants.writeMenuAuth02 = true;

                } else if(auth.authority == "ROLE_B303_READ") {

                    Ext.getCmp("almTabPanel").items.getAt(2).setDisabled(false);

                } else if(auth.authority == "ROLE_B303_WRITE") {

                    almConstants.writeMenuAuth03 = true;

                } else if(auth.authority == "ROLE_B304_READ") {

                    Ext.getCmp("almTabPanel").items.getAt(3).setDisabled(false);

                } else if(auth.authority == "ROLE_B304_WRITE") {

                    almConstants.writeMenuAuth04 = true;

                } else if(auth.authority == "ROLE_B401_READ") {

                    Ext.getCmp("adminTabPanel").items.getAt(0).setDisabled(false);

                } else if(auth.authority == "ROLE_B401_WRITE") {

                    userConstants.writeMenuAuth01 = true;

                } else if(auth.authority == "ROLE_B402_READ") {

                    Ext.getCmp("adminTabPanel").items.getAt(1).setDisabled(false);

                } else if(auth.authority == "ROLE_B402_WRITE") {

                    userConstants.writeMenuAuth02 = true;

                }

            });

        }

        Ext.getCmp("menuTreeView").selModel.select(0);
        Ext.getCmp("menuTreeView").fireEvent('cellclick', Ext.getCmp("menuTreeView"), null, null, menuTreeStore.getRootNode().firstChild);

    },

    init: function(application) {
        this.control({
            "#loginBtn": {
                click: this.doLogin
            },
            "#password": {
                specialkey: this.detectPasswordSpecialkey
            },
            "#userName": {
                specialkey: this.detectUsernameSpecialkey
            },
            "#topLoginBtn": {
                click: this.popupLoginWindow
            },
            "#editProfileMenu": {
                click: this.doEditProfile
            },
            "#logoutMenu": {
                click: this.doLogout
            },
            "#adminMenu": {
                click: this.doSettings
            },
            "#introPanel": {
                activate: this.introPanelActivate
            }
        });
    }

});
