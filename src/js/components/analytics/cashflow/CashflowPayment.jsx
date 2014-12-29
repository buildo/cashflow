/** @jsx React.DOM */

'use strict';

const React = require('react');
const utils = require('../../../utils/utils.js');

const CashflowPayment = React.createClass({

  render: function () {

    const payment = this.props.payment;
    const isIncome = payment.flowDirection === 'in';

    const currency = utils.getCurrency(payment.currency.name);
    const iconClasses = isIncome ? 'money icon' : 'tags icon';
    const divClasses = isIncome ? 'ui dividing green header' : 'ui dividing red header';

    const client = typeof payment.company === 'undefined' ? '' :
      <div><strong>{isIncome ? 'Cliente' : 'Fornitore'}:</strong> {payment.company.description}</div>;

    return (
      <div className='ui segment payment-in'>
        <div className={divClasses}>
          <i className={iconClasses}></i>
          <h4 className='content'>{payment.description}</h4>
        </div>
        <div><strong>Valore:</strong> {payment.grossAmount}{currency}</div>
        <div><strong>Data:</strong> {payment.date}</div>
        {client}
        <div><strong>Metodo:</strong> {payment.method ? payment.method : payment.methodType}</div>
      </div>
    );
  }

});

module.exports = CashflowPayment;

