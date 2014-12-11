/** @jsx React.DOM */

'use strict';

const React = require('react');
const SideBar = require('./SideBar.jsx');
const RouteHandler = require('react-router').RouteHandler;
const CurrentUserStore = require('../../store/CurrentUserStore.js');
const ServerActions = require('../../actions/ServerActions.js');

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


const Home = React.createClass({

  componentDidMount: function() {
    ServerActions.getCurrentUser();
  },

  render: function () {
    if (!CurrentUserStore.getCurrentUser()) {
      return <div/>;
    }

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

});

module.exports = Home;
