/** @jsx React.DOM */

'use strict';

const React = require('react');
const CashflowGraph = require('./CashflowGraph.jsx');
const CashflowPayments = require('./CashflowPayments.jsx');


const CashflowMain = React.createClass({

  render: function() {

    console.log('RENDER_CASHFLOW');

    if (this.props.isLoadingMainCFF) {
      return (
        <div className="ui segment">
          <div className="ui active inverted dimmer">
            <div className="ui indeterminate text active loader">
              Caricamento...
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
        </div>
      );
    }

    return (
      <div>
        <div className='cashflow-graph ui segment'>
          <CashflowGraph/>
        </div>
        <h4 className='ui top attached inverted header'>
          Pagamenti
        </h4>
        <br></br>
        <div className='cashflow-payments'>
          <CashflowPayments/>
        </div>
      </div>
    );
  },

});

module.exports = CashflowMain;

