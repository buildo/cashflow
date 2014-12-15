/** @jsx React.DOM */

'use strict';

const React = require('react');
const MatchesStore = require('../../../store/MatchesStore.js');


const getStateFromStores = function () {
  return {
    matchesData: MatchesStore.getMatchesData() || {},
  };
};

const TodoMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    MatchesStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MatchesStore.removeChangeListener(this._onChange);
  },

  render: function() {

    console.log(this.state.matchesData);

    return (
      <div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = TodoMain;
