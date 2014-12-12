/** @jsx React.DOM */

'use strict';

const React = require('react');

const CashflowPayment = React.createClass({

  render: function () {

    const payment = this.props.payment;
    // console.log(payment);
    let currency;
    switch(payment.currency.name) {
      case 'EUR':
        currency = '€';
        break;

      case 'USD':
        currency = '$';
        break;

      case 'GBP':
        currency = '£';
        break;

      default:
        currency = '';
    }

    if (payment.flowDirection === 'in') {
      return (
        <div className='ui segment payment-in'>
          <div className="ui dividing green header">
            <i className="money icon"></i>
            <div className="content">
              {payment.description}
            </div>
          </div>
          <div><strong>Valore:</strong> {payment.grossAmount}{currency}</div>
          <div><strong>Data:</strong> {payment.date}</div>
          <div><strong>Cliente:</strong> {payment.company.description}</div>
          <div><strong>Metodo:</strong> {payment.method}</div>
        </div>
      );
    } else {
      return (
        <div className='ui segment payment-out'>
          <div className="ui dividing red header">
            <i className="tags icon"></i>
            <div className="content">
              {payment.description}
            </div>
          </div>
          <div><strong>Valore:</strong> {payment.grossAmount}{currency}</div>
          <div><strong>Data:</strong> {payment.date}</div>
          <div><strong>Fornitore:</strong> {payment.company.description}</div>
          <div><strong>Metodo:</strong> {payment.method}</div>
        </div>
      );
    }
  }

});

module.exports = CashflowPayment;

