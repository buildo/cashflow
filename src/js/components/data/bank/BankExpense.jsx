/** @jsx React.DOM */

'use strict';

const React = require('react');

const Expense = React.createClass({

  render: function () {

    const line = this.props.line;

    return (
      <div className='ui segment line expense'>
        <div className="ui dividing red header">
          <i className="tags icon"></i>
          <h4 className="content">{line.description}</h4>
        </div>
        <div><strong>Valore:</strong> {line.payments[0].grossAmount}€</div>
        <div><strong>Data:</strong> {line.payments[0].date}</div>
      </div>
    );
  }

});

module.exports = Expense;

