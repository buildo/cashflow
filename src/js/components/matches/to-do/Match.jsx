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

    const mainPayment = this.props.mainPayment;
    const matchingDataPayments = this.props.matchingDataPayments;
    const dataPayments = this.props.dataPayments;
    const selectedPaymentId = this.props.selectedPaymentId;

    const selectedPayment = dataPayments.filter((dataPayment) => dataPayment.id === selectedPaymentId)[0];

    const lineId = mainPayment.info.lineId;
    const type = mainPayment.info.flowDirection === 'in' ? 'Invoice' : 'Expense';
    const idNumber = lineId.replace('exp_', '').replace('inv_', '');
    const paymentNumber = parseInt(mainPayment.scraperInfo.tranId.replace('tran_', '').replace('_', '')) + 1;

    if (!this.props.isSelected) {
      return (
        <div className="ui segment center aligned" onClick={this.setAsSelected}>
          <div className="ui mini statistic">
            <div className="value">
              {type} {idNumber}
            </div>
            <div className="label">
              {paymentNumber}º payment
            </div>
          </div>
          <div className="ui mini statistic">
            <div className="value">
              {matchingDataPayments.length}
            </div>
            <div className="label">
              {matchingDataPayments.length === 1 ? 'match' : 'matches'}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className='ui segment'>
          <div className='ui relaxed fitted grid match selected'>
            <div className='twelve wide Left column'>
              <MainPayment mainPayment={mainPayment} selectedPayment={selectedPayment}/>
            </div>
            <div className='ui vertical divider' id='match-divider'>
            O
            </div>
            <div className='four wide Right column'>
              <DataPayments dataPayments={dataPayments} selectedPaymentId={selectedPaymentId} matchingDataPayments={matchingDataPayments} flowDirection={mainPayment.info.flowDirection}/>
            </div>
          </div>
        </div>
        <div className='ui bottom attached'>
        </div>
      </div>
    );
  },

});

module.exports = Match;
