/** @jsx React.DOM */

'use strict';

const React = require('react');
const TodoActions = require('../../../actions/TodoActions.js');
const utils = require('../../../utils/utils.js');

const MainPayment = React.createClass({

  deselectPayment: function() {
    TodoActions.deselectPayment();
  },

  render: function() {

    const dataPayment = this.props.dataPayment;
    const isInvoice = dataPayment.info.flowDirection === 'in';

    return (
      <div className='ui segment'>
        <div className="ui top right attached label">
          <i className="delete icon" onClick={this.deselectPayment}></i>
        </div>
        <div><strong>Valore:</strong> {isInvoice ? '' : '-'}{dataPayment.grossAmount}€</div>
        <div><strong>Data:</strong> {utils.formatDate(dataPayment.date)}</div>
        <div><strong>Descrizione:</strong> {dataPayment.info.description}</div>
      </div>
    );
  },

});

module.exports = MainPayment;
