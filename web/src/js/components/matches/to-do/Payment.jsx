/** @jsx React.DOM */

'use strict';

const React = require('react');
const TodoActions = require('../../../actions/TodoActions.js');
const utils = require('../../../utils/utils.js');

const Payment = React.createClass({

  propTypes: {
    payment: React.PropTypes.object.isRequired
  },

  deselectPayment: function() {
    TodoActions.selectPayment(undefined);
  },

  render: function() {
    const payment = this.props.payment;
    // console.log(payment);
    const isInvoice = payment.info.flowDirection === 'in';
    const currency = utils.getPaymentCurrency(payment);

    const client = typeof payment.info.company === 'undefined' ? '' :
      <div><strong>{isInvoice ? 'Cliente' : 'Fornitore'}:</strong> {payment.info.company.description}</div>;

    const labelX = (
      <div className="ui top right attached label">
        <i className="delete icon" onClick={this.deselectPayment}></i>
      </div>
    );

    return (
      <div className={this.props.isPrimary ? '' : 'ui segment'}>
        {this.props.isPrimary ? '' : labelX}
        <div><strong>Valore:</strong> {isInvoice ? '' : '-'}{payment.grossAmount || payment.expectedGrossAmount[0]}{currency}</div>
        <div><strong>Data:</strong> {utils.formatDate(payment.date || payment.expectedDate[0])}</div>
        <div><strong>Metodo:</strong> {payment.method}</div>
        {client}
        <div><strong>Descrizione:</strong> {payment.info.description}</div>
      </div>
    );
  },

});

module.exports = Payment;
