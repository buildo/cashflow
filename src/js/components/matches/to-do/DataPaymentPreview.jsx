/** @jsx React.DOM */

'use strict';

const React = require('react');
const MatchesTodoActions = require('../../../actions/MatchesTodoActions.js');
const utils = require('../../../utils/utils.js');

const DataPayment = React.createClass({

  setAsSelected: function() {
    const id = this.props.dataPayment.id;
    MatchesTodoActions.selectPayment(id);
  },

  render: function() {

    const payment = this.props.dataPayment;
    const isInvoice = this.props.flowDirection === 'in';

    return (
      <div className='ui segment selectable data-payment' onClick={this.setAsSelected}>
        <div><strong>Valore:</strong> {isInvoice ? '' : '-'}{payment.grossAmount}€</div>
        <div><strong>Data:</strong> {utils.formatDate(payment.date)}</div>
      </div>
    );
  },

});

module.exports = DataPayment;
