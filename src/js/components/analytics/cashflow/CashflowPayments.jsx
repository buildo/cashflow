/** @jsx React.DOM */

'use strict';

const React = require('react');
const CashflowPayment = require('./CashflowPayment.jsx');

const CashflowPayments = React.createClass({

  propTypes: {
    payments: React.PropTypes.array
  },

  render: function () {
    if (!this.props.payments) {
      return (
        <div className="ui ignored message">
          <div className="payments-placeholder">
            Seleziona un punto del grafico per vederne qui i dettagli.
          </div>
        </div>
      );
    }

    const payments = this.props.payments.map((payment, index) => <CashflowPayment payment={payment} key={index}/>);

    return (
      <div>
        {payments}
        <br></br>
      </div>
    );
  },

});


module.exports = CashflowPayments;
