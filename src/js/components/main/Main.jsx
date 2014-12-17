/** @jsx React.DOM */

'use strict';

const React = require('react');
const TopBar = require('./TopBar.jsx');
const RouteHandler = require('react-router').RouteHandler;
const State = require('react-router').State;
const C = require('../../constants/AppConstants').ActionTypes;
const RouteNames = require('../../constants/RouteNames.js');
const TopBarStore = require('../../store/TopBarStore.js');


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

const getStateFromStores = function () {
  return {
    selectedPage: TopBarStore.getSelectedPage(),
    selectedTab: TopBarStore.getSelectedTab()
  };
};

const Main = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TopBarStore.addChangeListener(this._onChange);
  },

  render: function () {

    console.log('RENDER_MAIN');
    // return (
    //   <div className='ui page grid'>
    //     <div className='row'>
    //       <div className='column'>
    //       </div>
    //     </div>
    //     <div className='row'>
    //       <div className='three wide Left floated column'>
    //         <SideBar pages={pages} selectedPage={this.state.selectedPage}/>
    //       </div>
    //       <div className='thirteen wide Right floated column'>
    //         <RouteHandler/>
    //       </div>
    //     </div>
    //   </div>
    // );

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
