/** @jsx React.DOM */

'use strict';

const React = require('react');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const DoneDataStore = require('../../../store/DoneDataStore.js');
const Match = require('./Match.jsx');

const getStateFromStores = function () {
  return {matches: DoneDataStore.getAll()};
};

const DoneMain = React.createClass({

  mixins: [ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(DoneDataStore, this._onChange);
  },

  render: function() {

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
