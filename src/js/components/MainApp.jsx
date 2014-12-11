/** @jsx React.DOM */

'use strict';

const React = require('react');
const SideBar = require('./home/SideBar.jsx');
const RouteHandler = require('react-router').RouteHandler;
const CFFStore = require('../store/CFFStore.js');
const ServerActions = require('../actions/ServerActions.js');

const pages = [
  {
    name: 'Analytics',
    isSelected: false,
    tabs: [
      {
        name: 'Cashflow'
      },
      {
        name: 'Progetti'
      },
      {
        name: 'Risorse'
      }
    ]
  },
  {
    name: 'Data',
    isSelected: true,
    tabs: [
      {
        name: 'Fatture in cloud'
      },
      {
        name: 'Banca'
      },
      {
        name: 'Progetti'
      },
      {
        name: 'Risorse'
      }
    ]
  },
  {
    name: 'Magic Match',
    isSelected: false,
    tabs: [
      {
        name: 'Da fare'
      },
      {
        name: 'Da salvare'
      },
      {
        name: 'Archiviati'
      }
    ]
  }
];

const getStateFromStores = function () {
  return {
    mainCFF: CFFStore.getMainCFF(),
    bankCFF: CFFStore.getBankCFF()
  };
};

const MainApp = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    ServerActions.updateMain();
  },

  render: function () {
    return (
      <div className='ui page grid'>
        <div className='row'>
          <div className='column'>
          </div>
        </div>
        <div className='row'>
          <div className='three wide Left floated column'>
            <SideBar pages={pages}/>
          </div>
          <div className='thirteen wide Right floated column'>
            <RouteHandler/>
          </div>
        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = MainApp;