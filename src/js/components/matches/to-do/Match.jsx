/** @jsx React.DOM */

'use strict';

const React = require('react');
const MainPayment = require('./MainPayment.jsx');
const DataPayments = require('./DataPayments.jsx');
const MatchesTodoActions = require('../../../actions/MatchesTodoActions.js');

const Match = React.createClass({

  setAsSelected: function() {
    const index = this.props.index;
    MatchesTodoActions.selectMatch(index);
  },

  render: function() {

    if (!this.props.isSelected) {
      return (
        <div className="ui segment" onClick={this.setAsSelected}>
          PREVIEW
        </div>
      );
    }

    const mainPayment = this.props.mainPayment;
    const matchingDataPayments = this.props.matchingDataPayments;
    const dataPayments = this.props.dataPayments;
    // <DataPayments dataPayments={dataPayments}/>
    return (
      <div>
        <MainPayment mainPayment={mainPayment}/>
      </div>
    );
  },

});

module.exports = Match;
