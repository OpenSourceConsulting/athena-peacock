/*
 * File: app/view/monitoringChartWindow.js
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

Ext.define('MyApp.view.monitoringChartWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.monitoringChartWindow',

    requires: [
        'Ext.panel.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Spacer',
        'Ext.form.field.ComboBox',
        'Ext.chart.Chart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'Ext.chart.Legend'
    ],

    height: 400,
    id: 'monitoringChartWindow',
    itemId: 'monitoringChartWindow',
    width: 450,
    layout: 'border',
    title: 'CPU',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    region: 'center',
                    header: false,
                    title: 'chartPanel',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'tbspacer',
                                    flex: 1
                                },
                                {
                                    xtype: 'combobox',
                                    width: 200,
                                    fieldLabel: 'Time Range',
                                    labelWidth: 80
                                },
                                {
                                    xtype: 'combobox',
                                    padding: '0 0 0 10',
                                    width: 150,
                                    fieldLabel: 'Period',
                                    labelWidth: 60
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                            xtype: 'panel',
                            id: 'cpuPanel3',
                            padding: '20 0 0 0',
                            width: 430,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'chart',
                                    height: 300,
                                    id: 'cpuChart1',
                                    itemId: 'cpuChart',
                                    width: 430,
                                    shadow: true,
                                    animate: true,
                                    insetPadding: 20,
                                    store: 'instanceMonitoringChartStore',
                                    axes: [
                                        {
                                            type: 'Category',
                                            constrain: true,
                                            fields: [
                                                'date'
                                            ],
                                            label: {
                                                rotate: {
                                                    degrees: 315
                                                }
                                            },
                                            hidden: true,
                                            position: 'bottom'
                                        },
                                        {
                                            type: 'Numeric',
                                            fields: [
                                                'cpu_use',
                                                'cpu_free'
                                            ],
                                            maximum: 100,
                                            position: 'left'
                                        }
                                    ],
                                    series: [
                                        {
                                            type: 'line',
                                            label: {
                                                display: 'none',
                                                field: 'visits',
                                                renderer: function(v) { return v >> 0; },
                                                'text-anchor': 'middle'
                                            },
                                            title: 'Idle CPU',
                                            xField: 'date',
                                            yField: 'cpu_use',
                                            markerConfig: {
                                                radius: 3,
                                                size: 3
                                            },
                                            showMarkers: false,
                                            style: {
                                                stroke: '#ff0000',
                                                fill: '#ff0000'
                                            }
                                        },
                                        {
                                            type: 'line',
                                            label: {
                                                display: 'none',
                                                field: 'visits',
                                                renderer: function(v) { return v >> 0; },
                                                'text-anchor': 'middle'
                                            },
                                            title: 'Combined CPU',
                                            xField: 'date',
                                            yField: 'cpu_free',
                                            markerConfig: {
                                                radius: 3,
                                                size: 3
                                            },
                                            showMarkers: false,
                                            style: {
                                                stroke: '#0000ff',
                                                fill: '#0000ff'
                                            }
                                        }
                                    ],
                                    legend: {

                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});