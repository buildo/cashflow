/** @jsx React.DOM */

'use strict';

const React = require('react');

const Expense = React.createClass({

  render: function () {

    const line = this.props.line;

    const currencies = {
      EUR: '€',
      USD: '$',
      GBP: '£',
    };

    const currency = line.currency ? currencies[line.currency.name] : '€';

    return (
      <div className='ui segment line expense'>
        <div className="ui dividing red header">
          <i className="tags icon"></i>
          <div className="content">
            {line.description}
          </div>
        </div>
        <div><strong>ID:</strong> {line.id}</div>
        <div><strong>Lordo:</strong> {line.amount.gross}{currency}</div>
        <div><strong>Netto:</strong> {line.amount.net}{currency}</div>
        <div><strong>Data:</strong> {line.invoice.date}</div>
        <div><strong>Fornitore:</strong> {line.company.description}</div>
      </div>
    );
  }

});

module.exports = Expense;

