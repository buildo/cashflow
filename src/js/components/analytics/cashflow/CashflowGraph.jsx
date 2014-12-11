/** @jsx React.DOM */

'use strict';

const React = require('react');
const c3 = require('c3');
const CashflowStore = require('../../../store/CashflowStore.js');
const CashflowActions = require('../../../actions/CashflowActions.js');

const tooltipContentHandler = function (d, defaultTitleFormat, defaultValueFormat, color) {
  /* jshint ignore:start */
  var $$ = this, config = $$.config,
    titleFormat = config.tooltip_format_title || defaultTitleFormat,
    nameFormat = config.tooltip_format_name || function (name) { return name; },
    valueFormat = config.tooltip_format_value || defaultValueFormat,
    text, i, title, value, name, bgcolor;
  for (i = 0; i < d.length; i++) {
    if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

    if (! text) {
        title = titleFormat ? titleFormat(d[i].x) : d[i].x;
        text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
    }

    name = nameFormat(d[i].name);
    value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
    bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

    text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
    text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
    text += "<td class='value'>" + value + "</td>";
    text += "</tr>";
  }
  return text + "</table>";
  /* jshint ignore:end */
};

const getStateFromStores = function () {
  return {
    cashflows: CashflowStore.getCashflowData()
  };
};

const CasflowAnalytics = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CashflowStore.addChangeListener(this._onChange);
  },

  render: function() {

    const data = this.state.cashflows;
    // init graph only if data is not undefined
    if(data){

      const paths = ['History', 'Best', 'Worst'];
      // repeat last History value inside Best and Worst to show continued line
      data.best = [data.history[data.history.length - 1]].concat(data.best);
      data.worst = [data.history[data.history.length - 1]].concat(data.worst);

      const columnsX = paths.map((path) => [('x-' + path)].concat(data[path.toLowerCase()].map((d) => new Date(d.date).getTime())));
      const columnsY = paths.map((path) => [path].concat(data[path.toLowerCase()].map((d) => d.grossAmount)));

      let chart = c3.generate({
        size: {
          height: 480
        },
        data: {
          xs: {
            'History': 'x-History',
            'Best': 'x-Best',
            'Worst': 'x-Worst',
          },
          columns: columnsX.concat(columnsY),
          selection: {
            enabled: true,
            multiple: false,
            grouped: false
          },
          onclick: CashflowActions.selectPoint,
        },
        zoom: {
          enabled: true
        },
        subchart: {
          show: true
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%d-%m-%y',
              fit: false,
            },
          }
        },
        grid: {
          x: {
            lines: [{value: new Date().getTime(), class: 'grid-today', text: 'TODAY'}]
          },
          y: {
            lines: [{value: 18000, class: 'grid-alert', text: '18000€'}]
          }
        },
        transition: {
          duration: 500
        },
        color: {
          pattern: ['blue', 'orange', 'green']
        },
        tooltip: {
          grouped: false,
          format: {
            value: (value, ratio, id) => value + ' €',
          },
          contents: tooltipContentHandler
        }
      });
    }

    return (
      <div >
        <h5 className='ui top dividing header'>
          Cashflow
        </h5>
        <div id='chart'>
        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = CasflowAnalytics;

