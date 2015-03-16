/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const MatchBody = require('./MatchBody.jsx');
const MatchRightColumn = require('./MatchRightColumn.jsx');
const TodoActions = require('../../../actions/TodoActions.js');
const MatchActions = require('../../../actions/MatchActions.js');

const Match = React.createClass({

  propTypes: {
    match: React.PropTypes.object.isRequired,
    secondaryPayments: React.PropTypes.array.isRequired,
    selectedPaymentId: React.PropTypes.string,
  },

  deselectMatch: function() {
    TodoActions.selectMatch(undefined);
  },

  stageMatch: function() {
    const secondaryPayments = Immutable.fromJS(this.props.secondaryPayments);
    const selectedPayment = secondaryPayments.find((secondaryPayment) => secondaryPayment.get('id') === this.props.selectedPaymentId);
    const mainPayment = Immutable.fromJS(this.props.match);
    const list = Immutable.List([mainPayment, selectedPayment]);

    const main = list.find((p) => p.get('type') !== 'data');
    const data = list.find((p) => p.get('type') === 'data');

    const match = Immutable.fromJS({
      id: (main.get('id') + data.get('id')),
      main: main.set('matches', main.get('matches').map((m) => m.get('id'))), // recreate array of IDs
      data: data,
    });
    MatchActions.stageMatchOptimistic(match);
  },

  render: function() {
    const match = this.props.match;
    const matches = this.props.match.matches;
    const secondaryPayments = this.props.secondaryPayments;
    const selectedPaymentId = this.props.selectedPaymentId;
    const selectedPayment = secondaryPayments.find((secondaryPayment) => secondaryPayment.id === selectedPaymentId);

    return (
      <div className='ui relaxed fitted grid match selected'>
        <div className='twelve wide Left column'>
          <MatchBody match={match} selectedPayment={selectedPayment}/>
        </div>
        <div className='four wide Right column'>
          <MatchRightColumn secondaryPayments={secondaryPayments} selectedPaymentId={selectedPaymentId} matches={matches} flowDirection={match.info.flowDirection}/>
        </div>
      </div>
    );
  },

});

module.exports = Match;
