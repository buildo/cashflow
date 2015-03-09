/** @jsx React.DOM */

'use strict';

const React = require('react');
const ServerActions = require('../../../actions/ServerActions');
// const DoneStore = require('../../../store/DoneStore.js');
const DoneDataStore = require('../../../store/DoneDataStore.js');
const Match = require('./Match.jsx');

const getStateFromStores = function () {
  return {
    // matches: DoneStore.getMatches() || {},
    // isLoading: DoneStore.isLoading()
  };
};

const DoneMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    // DoneStore.addChangeListener(this._onChange);
    DoneDataStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    // DoneStore.removeChangeListener(this._onChange);
    DoneDataStore.removeChangeListener(this._onChange);
  },

  render: function() {

    if (this.state.isLoading) {
      return (
        <div className="ui segment">
          <div className="ui active inverted dimmer">
            <div className="ui indeterminate text active loader">
              Caricamento...
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
        </div>
      );
    }

    const empty = (
      <div className="ui ignored message">
        <div className="stage-placeholder">
          Non hai nessun match salvato.
        </div>
      </div>
    );

    const matches = this.state.matches.map((match, index) =>
      <Match match={match} key={index}/>);

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          ARCHIVIATI
        </h4>
        {this.state.matches.length > 0 ? matches : empty}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = DoneMain;
