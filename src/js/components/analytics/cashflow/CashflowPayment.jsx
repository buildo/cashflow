/** @jsx React.DOM */

'use strict';

const React = require('react');

const CashflowPayment = React.createClass({

  render: function () {

    const payment = this.props.payment;

    return (
      <div className='ui segment'>
        <div className='title'>
          {payment.grossAmount}
        </div>
      </div>
    );
  }

});

module.exports = CashflowPayment;

