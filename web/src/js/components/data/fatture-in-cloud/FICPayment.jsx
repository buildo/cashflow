/** @jsx React.DOM */

'use strict';

const React = require('react');
const utils = require('../../../utils/utils.js');

const Expense = React.createClass({

  propTypes: {
    line: React.PropTypes.object.isRequired
  },

  render: function () {
    const line = this.props.line;
    const isInvoice = line.flowDirection === 'in';
    const currency = utils.getCurrency(line.currency.name);
    const link = ('https://secure.fattureincloud.it/' + line.id.replace('inv_', 'invoices-edit-').replace('exp_', 'expenses-edit-'));
    const label = (
      <a href={link} className='ui black corner label'>
        <i className='level up icon'></i>
      </a>
    );

    return (
      <div className='ui segment line'>
        <div className={'ui dividing ' + (isInvoice ? 'green' : 'red') + ' header'}>
          {label}
          <i className={(isInvoice ? 'money' : 'tags') + ' icon'}></i>
          <h4 className='content'>{line.description}</h4>
        </div>
        <div><strong>ID:</strong> {line.id}</div>
        <div><strong>Lordo:</strong> {(line.amount.gross * line.currency.conversion).toFixed(2)}{currency}</div>
        <div><strong>Netto:</strong> {(line.amount.net * line.currency.conversion).toFixed(2)}{currency}</div>
        <div><strong>Data:</strong> {line.invoice.date}</div>
        <div><strong>{isInvoice ? 'Cliente:' : 'Fornitore:'}</strong> {line.company.description}</div>
      </div>
    );
  }

});

module.exports = Expense;

