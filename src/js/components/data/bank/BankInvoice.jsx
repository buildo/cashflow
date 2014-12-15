/** @jsx React.DOM */

'use strict';

const React = require('react');

const Invoice = React.createClass({

  render: function () {

    const line = this.props.line;

    return (
      <div className='ui segment line invoice'>
        <div className="ui dividing green header">
          <i className="tags icon"></i>
          <div className="content">
            {line.description}
          </div>
        </div>
        <div><strong>Valore:</strong> {line.payments[0].grossAmount}€</div>
        <div><strong>Data:</strong> {line.payments[0].date}</div>
      </div>
    );
  }

});

module.exports = Invoice;

