/** @jsx React.DOM */

'use strict';

const React = require('react');

const Invoice = React.createClass({

  propTypes: {
    line: React.PropTypes.object
  },

  render: function () {

    const line = this.props.line;

    const currencies = {
      EUR: '€',
      USD: '$',
      GBP: '£',
    };

    const currency = currencies[line.currency.name];

    return (
      <div className='ui segment line invoice'>
        <div className="ui dividing green header">
          <i className="tags icon"></i>
          <div className="content">
            {line.description}
          </div>
        </div>
        <div><strong>ID:</strong> {line.id}</div>
        <div><strong>Lordo:</strong> {line.amount.gross}{currency}</div>
        <div><strong>Netto:</strong> {line.amount.net}{currency}</div>
        <div><strong>Data:</strong> {line.invoice.date}</div>
        <div><strong>Cliente:</strong> {line.company.description}</div>
      </div>
    );
  }

});

module.exports = Invoice;

