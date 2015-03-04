/** @jsx React.DOM */

'use strict';

const React = require('react');
const List = require('../List.jsx');

const MatchView = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    const data = this.props.data || {};
    return (
      <div>
        <div>Avversario: {data.opponentName} {'(' + data.opponentRanking + ')'}</div>
        <div>Set 1: {data.firstSetMe}-{data.firstSetOpponent}</div>
        <div>Set 2: {data.secondSetMe}-{data.secondSetOpponent}</div>
        {data.thirdSetMe && data.thirdSetOpponent ? <div>Set 3: {data.thirdSetMe}-{data.thirdSetOpponent}</div> : ''}
      </div>
    );
  },

});

module.exports = MatchView;