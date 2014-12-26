/** @jsx React.DOM */

'use strict';

const React = require('react');
const TodoActions = require('../../../actions/TodoActions.js');
const utils = require('../../../utils/utils.js');

const DataPayment = React.createClass({

  setAsSelected: function() {
    const id = this.props.payment.id;
    TodoActions.selectPayment(id);
  },

  render: function() {

    const payment = this.props.payment;
    const isSelected = this.props.isSelected;
    const isInvoice = this.props.flowDirection === 'in';
    const currency = utils.getCurrency(payment.info.currency.name);

    const divClasses = isSelected ? 'ui segment green selectable data-payment' : 'ui segment selectable data-payment';

    return (
      <div className={divClasses} onClick={this.setAsSelected}>
        <div><strong>Valore:</strong> {isInvoice ? '' : '-'}{payment.grossAmount}{currency}</div>
        <div><strong>Data:</strong> {utils.formatDate(payment.date)}</div>
      </div>
    );
  },

});

module.exports = DataPayment;
