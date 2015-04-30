/** @jsx React.DOM */

'use strict';

const React = require('react');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const CashflowStore = require('../../../store/CashflowStore.js');
const CFFActions = require('../../../actions/CFFActions.js');
const CashflowGraph = require('./CashflowGraph.jsx');
const CashflowPayments = require('./CashflowPayments.jsx');
const Loader = require('../../Loader.jsx');

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

  getErrorMessage() {
    
  },

  render() {

    if (this.props.isLoadingData || !this.state.cashflowData) {
      return <Loader />;
    }

    if (this.state.errors) {

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

