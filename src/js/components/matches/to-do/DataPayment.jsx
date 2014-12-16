/** @jsx React.DOM */

'use strict';

const React = require('react');

const DataPayment = React.createClass({

  render: function() {

    const payment = this.props.dataPayment;

    return (
      <div>
        <div><strong>Valore:</strong> {payment.grossAmount}€</div>
        <div><strong>Data:</strong> {payment.date}</div>
      </div>
    );
  },

});

module.exports = DataPayment;
