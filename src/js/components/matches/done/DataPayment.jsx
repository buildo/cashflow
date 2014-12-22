/** @jsx React.DOM */

'use strict';

const React = require('react');
const utils = require('../../../utils/utils.js');

const DataPayment = React.createClass({

  render: function() {

    const dataPayment = this.props.dataPayment;
    const isInvoice = dataPayment.info.flowDirection === 'in';

    return (
      <div>
        <div><strong>Valore:</strong> {isInvoice ? '' : '-'}{dataPayment.grossAmount}€</div>
        <div><strong>Data:</strong> {utils.formatDate(dataPayment.date)}</div>
        <div><strong>Descrizione:</strong> {dataPayment.info.description}</div>
      </div>
    );
  },

});

module.exports = DataPayment;
