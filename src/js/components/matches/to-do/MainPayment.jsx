/** @jsx React.DOM */

'use strict';

const React = require('react');
const TodoActions = require('../../../actions/TodoActions.js');
const utils = require('../../../utils/utils.js');

const MainPayment = React.createClass({

  render: function() {
    const mainPayment = this.props.mainPayment;
    const isInvoice = mainPayment.info.flowDirection === 'in';
    const currency = utils.getCurrency(mainPayment.info.currency.name);

    return (
      <div>
        <div><strong>Valore:</strong> {isInvoice ? '' : '-'}{mainPayment.grossAmount || mainPayment.expectedGrossAmount[0]}{currency}</div>
        <div><strong>Data:</strong> {utils.formatDate(mainPayment.date || mainPayment.expectedDate[0])}</div>
        <div><strong>{isInvoice ? 'Cliente' : 'Fornitore'}:</strong> {mainPayment.info.company.description}</div>
        <div><strong>Metodo:</strong> {mainPayment.method}</div>
        <div><strong>Descrizione:</strong> {mainPayment.info.description}</div>
      </div>
    );
  },

});

module.exports = MainPayment;
