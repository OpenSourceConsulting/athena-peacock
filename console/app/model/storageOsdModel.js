/*
 * File: app/model/storageOsdModel.js
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

Ext.define('MyApp.model.storageOsdModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    fields: [
        {
            name: 'name'
        },
        {
            name: 'id'
        },
        {
            name: 'status'
        },
        {
            name: 'ip'
        },
        {
            name: 'port'
        },
        {
            name: 'pid'
        },
        {
            name: 'up_from'
        },
        {
            name: 'host'
        },
        {
            name: 'public_addr'
        },
        {
            name: 'cluster_addr'
        },
        {
            name: 'heartbeat_back_addr'
        },
        {
            name: 'heartbeat_front_addr'
        }
    ]
});