/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const MatchBody = require('./MatchBody.jsx');
const MatchRightColumn = require('./MatchRightColumn.jsx');
const TodoActions = require('../../../actions/TodoActions.js');
const ServerActions = require('../../../actions/ServerActions.js');

const Match = React.createClass({

  deselectMatch: function() {
    TodoActions.deselectMatch();
  },

  saveMatchToStageArea: function() {
    const secondaryPayments = Immutable.fromJS(this.props.secondaryPayments);
    const selectedPaymentId = this.props.selectedPaymentId;
    const selectedPayment = secondaryPayments.find((secondaryPayment) => secondaryPayment.get('id') === selectedPaymentId);
    const main = Immutable.fromJS(this.props.match);

    const actionData = Immutable.fromJS({
      main: main,
      data: selectedPayment,
      match: {
        id: (this.props.match.id + this.props.selectedPaymentId),
        main: main.remove('matches'),
        data: selectedPayment.remove('matches')
      }
    });

    // console.log(actionData.toJS());
    ServerActions.saveMatch(actionData);
  },

  render: function() {

    const match = this.props.match;
    const matches = this.props.match.matches;
    const secondaryPayments = this.props.secondaryPayments;
    const selectedPaymentId = this.props.selectedPaymentId;
    const selectedPayment = secondaryPayments.find((secondaryPayment) => secondaryPayment.id === selectedPaymentId);
    const saveButtonClasses = selectedPaymentId ? 'ui positive button' : 'ui disabled positive button';

    return (
      <div>
        <div className='ui segment'>
          <div>
            <div className='ui relaxed fitted grid match selected'>
              <div className='twelve wide Left column'>
                <MatchBody match={match} selectedPayment={selectedPayment}/>
              </div>
              <div className='ui vertical divider' id='match-divider'>
              O
              </div>
              <div className='four wide Right column'>
                <MatchRightColumn secondaryPayments={secondaryPayments} selectedPaymentId={selectedPaymentId} matches={matches} flowDirection={match.info.flowDirection}/>
              </div>
            </div>
          </div>
          <div className='ui bottom attached'>
            <div className='ui buttons'>
              <div className='ui negative button' onClick={this.deselectMatch}>Cancel</div>
              <div className='or'></div>
              <div className={saveButtonClasses} onClick={this.saveMatchToStageArea}>Save</div>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Match;
