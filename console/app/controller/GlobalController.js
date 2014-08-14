/*
 * File: app/controller/GlobalController.js
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

Ext.define('MyApp.controller.GlobalController', {
    extend: 'Ext.app.Controller',

    init: function(application) {
        Ext.define('GLOBAL', {
            singleton: true,
            lastSelectedMenuId: null,
            urlPrefix:""//http://localhost:8080"
        });


        /*
         * Global Ajax Config
         */

        Ext.Ajax.timeout = 20000;// default is 30000.
        Ext.Ajax.on("requestexception", function(conn, response, options, eOpts){

            if(response.timedout){

                Ext.Msg.show({
                    title:'Request Timeout',
                    msg: options.url +' request is timeout.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });

            }else{

                Ext.Msg.show({
                    title:'Server Error',
                    msg: 'server-side failure with status code ' + response.status,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });


        /*
         * Global Validation(VTypes) Config
         */
        Ext.apply(Ext.form.field.VTypes, {
            daterange: function(val, field) {
                var date = field.parseDate(val);

                if (!date) {
                    return false;
                }
                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                    var start = field.up('form').down('#' + field.startDateField);
                    start.setMaxValue(date);
                    start.validate();
                    this.dateRangeMax = date;
                }
                else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                    var end = field.up('form').down('#' + field.endDateField);
                    end.setMinValue(date);
                    end.validate();
                    this.dateRangeMin = date;
                }
                /*
                 * Always return true since we're only using this vtype to set the
                 * min/max allowed values (these are tested for after the vtype test)
                 */
                return true;
            },

            daterangeText: 'Start date must be less than end date',

            password: function(val, field) {
                //var pwd = field.up('form').down('#passwd');
                pwd = field.previousNode('textfield');
                return (val == pwd.getValue());
            },

            passwordText: 'Passwords do not match',

            numeric: function(val, field) {
                var numericRe = /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;
                return numericRe.test(val);
            },
            numericText : 'Not a valid numeric number. Must be numbers',
            numericMask : /[.0-9]/,

            template: function(val, field) {
                var templateRe = /^[a-zA-Z0-9_\.\-]*$/;
                return templateRe.test(val);
            },
            templateText : "영문 대소문자, 숫자, '_', '-', '.' 만 가능합니다."
        });


        //store url에 GLOBAL.urlPrefix 추가
        var stores = MyApp.getApplication().stores;

        for(var i = 0; i < stores.length ; i++ ) {

            var store = Ext.getStore(stores[i]);

            if(store.getProxy().url != null) {
                store.getProxy().url = GLOBAL.urlPrefix + store.getProxy().url;
            }

        }

    }

});
