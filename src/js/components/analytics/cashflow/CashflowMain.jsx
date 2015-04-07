/** @jsx React.DOM */

'use strict';

const React = require('react');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const CashflowStore = require('../../../store/CashflowStore.js');
const CashflowGraph = require('./CashflowGraph.jsx');
const CashflowPayments = require('./CashflowPayments.jsx');

const getStateFromStores = function () {
  return CashflowStore.getState();
};

const CashflowMain = React.createClass({

  propTypes: {
    isLoadingData: React.PropTypes.bool
  },

  mixins: [ListenerMixin],


  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(CashflowStore, this._onChange);
  },

  getSelectedPayments: function() {
    return this.state.cashflowData && this.state.pathId && this.state.index > -1 ? this.state.cashflowData[this.state.pathId][this.state.index].info : undefined;
  },

  render: function() {

    if (this.props.isLoadingData || !this.state.cashflowData) {
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

    const cumulativeAmountOfDay = this.getSelectedPayments() ? 'TOTAL: '+this.getSelectedPayments().reduce((amount, p) => amount + (p.grossAmount), 0).toFixed(2) : null;
    return (
      <div>
        <div className='cashflow-graph ui segment'>
          <CashflowGraph cashflows={this.state.cashflowData}/>
        </div>
        <h4 className='ui top attached inverted header'>
          Pagamenti
        </h4>
        <br></br>
        {cumulativeAmountOfDay}
        <div className='cashflow-payments'>
          <CashflowPayments payments={this.getSelectedPayments()}/>
        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = CashflowMain;

