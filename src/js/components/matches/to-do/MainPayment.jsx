/** @jsx React.DOM */

'use strict';

const React = require('react');

const MainPayment = React.createClass({

  render: function() {

    const payment = this.props.mainPayment;

    const currencies = {
      EUR: '€',
      USD: '$',
      GBP: '£',
    };
    const info = payment.info;
    const currency = currencies[info.currency.name];

    return (
      <div>
        <div><strong>Valore:</strong> {payment.grossAmount}{currency}</div>
        <div><strong>Data:</strong> {payment.date}</div>
        <div><strong>Cliente:</strong> {info.company.description}</div>
        <div><strong>Metodo:</strong> {payment.method}</div>
      </div>
    );
  },

});

module.exports = MainPayment;
