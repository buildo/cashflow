/** @jsx React.DOM */

'use strict';

const React = require('react');
const MatchesTodoActions = require('../../../actions/MatchesTodoActions.js');
const utils = require('../../../utils/utils.js');

const MainPayment = React.createClass({

  deselectPayment: function() {
    MatchesTodoActions.deselectPayment();
  },

  render: function() {

    const payment = this.props.mainPayment;
    const selectedPayment = this.props.selectedPayment;

    const isInvoice = payment.info.flowDirection === 'in';

    const currencies = {
      EUR: '€',
      USD: '$',
      GBP: '£',
    };

    const currency = currencies[payment.info.currency.name];

    const mainPaymentDiv = (
      <div>
        <div><strong>Valore:</strong> {isInvoice ? '' : '-'}{payment.grossAmount}{currency}</div>
        <div><strong>Data:</strong> {utils.formatDate(payment.date)}</div>
        <div><strong>{isInvoice ? 'Cliente' : 'Fornitore'}:</strong> {payment.info.company.description}</div>
        <div><strong>Metodo:</strong> {payment.method}</div>
        <div><strong>Descrizione:</strong> {payment.info.description}</div>
      </div>
    );

    const selectedPaymentDiv = !selectedPayment ? '' :
    (
      <div className='ui segment'>
        <div className="ui top right attached label">
          <i className="delete icon" onClick={this.deselectPayment}></i>
        </div>
        <div><strong>Valore:</strong> {isInvoice ? '' : '-'}{selectedPayment.grossAmount}{currency}</div>
        <div><strong>Data:</strong> {utils.formatDate(selectedPayment.date)}</div>
        <div><strong>Descrizione:</strong> {selectedPayment.info.description}</div>
      </div>
    );

    return (
      <div>
        {mainPaymentDiv}
        {selectedPaymentDiv}
      </div>
    );
  },

});

module.exports = MainPayment;
