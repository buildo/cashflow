/** @jsx React.DOM */

'use strict';

const React = require('react');

const CashflowPayment = React.createClass({

  render: function () {

    const payment = this.props.payment;
    // console.log(payment);
    const currencies = {
      EUR: '€',
      USD: '$',
      GBP: '£',
    };

    const currency = currencies[payment.currency.name];

    switch (payment.flowDirection) {

      case 'in':
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

      case 'out':
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

