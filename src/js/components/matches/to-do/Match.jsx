/** @jsx React.DOM */

'use strict';

const React = require('react');
const MatchBody = require('./MatchBody.jsx');
const MatchRightColumn = require('./MatchRightColumn.jsx');
const TodoActions = require('../../../actions/TodoActions.js');

const Match = React.createClass({

  deselectMatch: function() {
    TodoActions.deselectMatch();
  },

  saveMatchToStageArea: function() {
    const match = {
      main: this.props.match.id,
      data: this.props.selectedPaymentId
    };
  },

  render: function() {

    const match = this.props.match;
    const matches = this.props.match.matches;
    const dataPayments = this.props.dataPayments;
    const selectedPaymentId = this.props.selectedPaymentId;
    const selectedPayment = dataPayments.filter((dataPayment) => dataPayment.id === selectedPaymentId)[0];

    const saveButtonClasses = selectedPaymentId ? 'ui positive button' : 'ui disabled positive button';

    return (
      <div>
        <div className='ui segment'>
          <div>
            <div className='ui relaxed fitted grid match selected'>
              <div className='twelve wide Left column'>
                <MatchBody mainPayment={match} selectedPayment={selectedPayment}/>
              </div>
              <div className='ui vertical divider' id='match-divider'>
              O
              </div>
              <div className='four wide Right column'>
                <MatchRightColumn dataPayments={dataPayments} selectedPaymentId={selectedPaymentId} matches={matches} flowDirection={match.info.flowDirection}/>
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
