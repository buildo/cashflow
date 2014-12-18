/** @jsx React.DOM */

'use strict';

const React = require('react');
const utils = require('../../../utils/utils.js');

const CashflowPayment = React.createClass({

  render: function () {

    const payment = this.props.payment;
    const currency = utils.getCurrency(payment.currency.name);

    switch (payment.flowDirection) {

      case 'in':
        return (
          <div className='ui segment payment-in'>
            <div className="ui dividing green header">
              <i className="money icon"></i>
              <h4 className="content">{payment.description}</h4>
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
              <h4 className="content">{payment.description}</h4>
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

