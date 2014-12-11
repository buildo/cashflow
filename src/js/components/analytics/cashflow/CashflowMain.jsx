/** @jsx React.DOM */

'use strict';

const React = require('react');
const CashflowGraph = require('./CashflowGraph.jsx');
const CashflowPayments = require('./CashflowPayments.jsx');
const CFFStore = require('../../../store/CFFStore.js');

const getStateFromStores = function () {
  return {
    isLoading: CFFStore.isLoading()
  };
};

const CashflowMain = React.createClass({

  getInitialState: function() {
    return {
      isLoading: true
    };
  },

  componentDidMount: function() {
    CFFStore.addChangeListener(this._onChange);
  },

  render: function() {

    if (this.state.isLoading) {
      return (
        <div className="ui segment">
          <div className="ui active inverted dimmer">
            <div className="ui indeterminate text active loader">
              Preparing...
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
        <div className='cashflow-payments'>
          <CashflowPayments/>
        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = CashflowMain;

