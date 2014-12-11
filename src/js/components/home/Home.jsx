/** @jsx React.DOM */

'use strict';

const React = require('react'),
  SideBar = require('./SideBar.jsx'),
  MainContent = require('./MainContent.jsx');

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

let Home = React.createClass({

  render: () => {
    return (
      <div className='ui page grid'>
        <div className='row'>
          <div className='column'>
          </div>
        </div>
        <div className='row'>
          <div className='three wide column'>
            <SideBar pages={pages}/>
          </div>
          <div className='ten wide column'>
            <MainContent/>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Home;
