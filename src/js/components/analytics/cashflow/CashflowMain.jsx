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


  getInitialState() {
    return this.getStateFromStores();
  },

  getStateFromStores() {
    return CashflowStore.getState();
  },

  componentDidMount() {
    this.listenTo(CashflowStore, this._onChange);
  },

  getSelectedPayments() {
    return this.state.cashflowData && this.state.pathId && this.state.index > -1 ? this.state.cashflowData[this.state.pathId][this.state.index].info : undefined;
  },

  refresh() {
    CFFActions.getMain();
    CFFActions.getBank();
    CFFActions.getManual();
  },

  render() {

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
        <div className='ui top attached button' onClick={this.refresh}>Refresh</div>
        <CashflowGraph cashflows={this.state.cashflowData}/>
        <h4 className='ui top attached inverted header'>Pagamenti</h4>
        <br></br>
        {cumulativeAmountOfDay}
        <CashflowPayments payments={this.getSelectedPayments()}/>
      </div>
    );
  },

  _onChange() {
    this.setState(this.getStateFromStores());
  }

});

module.exports = CashflowMain;

