/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ListenerMixin = require('alt/mixins/ListenerMixin');
const RouteNames = require('../../constants/RouteNames.js');
const NavStore = require('../../store/NavStore.js');
const TopBar = require('./TopBar.jsx');

const pages = [
  {
    name: 'Analytics',
    id: RouteNames.ANALYTICS,
    tabs: [
      {
        name: 'Cashflow',
        id: RouteNames.ANALYTICS_CASHFLOW
      },
      {
        name: 'Progetti',
        id: RouteNames.ANALYTICS_PROGETTI
      },
      {
        name: 'Risorse',
        id: RouteNames.ANALYTICS_RISORSE
      }
    ]
  },
  {
    name: 'Data',
    id: RouteNames.DATA,
    tabs: [
      {
        name: 'Fatture in cloud',
        id: RouteNames.DATA_FATTURE_IN_CLOUD
      },
      {
        name: 'Banca',
        id: RouteNames.DATA_BANCA
      },
      {
        name: 'Manuale',
        id: RouteNames.DATA_MANUAL
      },
      {
        name: 'Progetti',
        id: RouteNames.DATA_PROGETTI
      },
      {
        name: 'Risorse',
        id: RouteNames.DATA_RISORSE
      }
    ]
  },
  {
    name: 'Magic Match',
    id: RouteNames.MATCH,
    tabs: [
      {
        name: 'Da fare',
        id: RouteNames.MATCH_DA_FARE
      },
      {
        name: 'Da salvare',
        id: RouteNames.MATCH_DA_SALVARE
      },
      {
        name: 'Archiviati',
        id: RouteNames.MATCH_ARCHIVIATI
      }
    ]
  }
];

const getStateFromStores = () => {
  return NavStore.getState();
};

const Main = React.createClass({

  mixins: [ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(NavStore, this._onChange);
  },

  render: function () {
    // console.log('MAIN');
    return (
      <div className='ui center aligned'>
        <div className='ui fixed main menu'>
          <TopBar pages={pages} selectedPage={this.state.selectedPage}/>
        </div>
        <div className='main-body'>
          <RouteHandler/>
        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = Main;
