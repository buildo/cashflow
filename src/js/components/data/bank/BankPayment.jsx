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

    console.log(line);
    return (
      <div className='ui segment line'>
        <div className={'ui dividing ' + (isInvoice ? 'green' : 'red') + ' header'}>
          <i className={(isInvoice ? 'money' : 'tags') + ' icon'}></i>
          <h4 className='content'>{line.description}</h4>
        </div>
        <div><strong>Valore:</strong> {line.payments[0].grossAmount}{utils.getCurrency(line.currency.name)}</div>
        <div><strong>Data:</strong> {line.payments[0].date}</div>
        <div><strong>Metodo:</strong> {line.payments[0].method ? line.payments[0].method : line.payments[0].methodType}</div>
      </div>
    );
  }

});

module.exports = Expense;

