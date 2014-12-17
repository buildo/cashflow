/** @jsx React.DOM */

'use strict';

const React = require('react');
const MatchesTodoActions = require('../../../actions/MatchesTodoActions.js');

const MatchPreview = React.createClass({

  setAsSelected: function() {
    const index = this.props.index;
    MatchesTodoActions.selectMatch(index);
  },

  render: function() {

    const mainPayment = this.props.mainPayment;
    const matchingDataPayments = this.props.matchingDataPayments;

    const lineId = mainPayment.info.lineId;
    const type = mainPayment.info.flowDirection === 'in' ? 'Invoice' : 'Expense';
    const idNumber = lineId.replace('exp_', '').replace('inv_', '');
    const paymentNumber = parseInt(mainPayment.scraperInfo.tranId.replace('tran_', '').replace('_', '')) + 1;

    return (
      <div className='ui segment center aligned selectable' onClick={this.setAsSelected}>
        <div className='ui mini statistic'>
          <div className='value'>
            {type} {idNumber}
          </div>
          <div className='label'>
            {paymentNumber}º payment
          </div>
        </div>
        <div className='ui mini statistic'>
          <div className='value'>
            {matchingDataPayments.length}
          </div>
          <div className='label'>
            {matchingDataPayments.length === 1 ? 'match' : 'matches'}
          </div>
        </div>
      </div>
    );
  },

});

module.exports = MatchPreview;
