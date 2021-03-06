/*
 * File: app/model/NetworkModel.js
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

Ext.define('MyApp.model.NetworkModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    fields: [
        {
            name: 'hypervisorId',
            type: 'int'
        },
        {
            name: 'rhevmId',
            type: 'string'
        },
        {
            name: 'vmId',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'networkName',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'macAddress',
            type: 'string'
        },
        {
            name: 'speed',
            type: 'string'
        },
        {
            name: 'active',
            type: 'string'
        },
        {
            name: 'plugged',
            type: 'string'
        },
        {
            name: 'linked',
            type: 'string'
        }
    ]
});