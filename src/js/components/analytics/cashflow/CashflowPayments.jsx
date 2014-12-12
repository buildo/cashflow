/** @jsx React.DOM */

'use strict';

const React = require('react');
const CashflowPayment = require('./CashflowPayment.jsx');
const CashflowStore = require('../../../store/CashflowStore.js');
const CashflowPaymentsStore = require('../../../store/CashflowPaymentsStore.js');

const getStateFromStores = function() {
  return {
    cashflows: CashflowStore.getCashflowData(),
    payments: CashflowPaymentsStore.getCurrentSelectedPayments()
  };
};

const CashflowPayments = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CashflowStore.addChangeListener(this._onChange);
    CashflowPaymentsStore.addChangeListener(this._onChange);
  },

  render: function () {
    if (!this.state.payments) {
      return (
        <div className="ui ignored message">
          <div className="payments-placeholder">
            Seleziona un punto del grafico per vederne qui i dettagli.
          </div>
        </div>
      );
    }

    const payments = this.state.payments.map((payment, index) => <CashflowPayment payment={payment} key={index}/>);

    return (
      <div>
        {payments}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});


module.exports = CashflowPayments;
