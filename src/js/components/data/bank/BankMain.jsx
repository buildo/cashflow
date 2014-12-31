/** @jsx React.DOM */

'use strict';

const React = require('react');
const State = require('react-router').State;
const BankInvoice = require('./BankInvoice.jsx');
const BankExpense = require('./BankExpense.jsx');
const CFFStore = require('../../../store/CFFStore.js');



const getStateFromStores = function () {
  return {
    isLoading: CFFStore.isLoadingBank(),
    cff: CFFStore.getBankCFF() || {},
  };
};

const CFFMain = React.createClass({

  mixins: [State],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CFFStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CFFStore.removeChangeListener(this._onChange);
  },

  render: function() {

    if (this.state.isLoading) {
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

    const cffLines = this.state.cff.lines || [];
    const paymentsCFFLines = cffLines.filter((line) => line.payments[0].methodType !== 'cost' && line.payments[0].methodType !== 'ignore');
    const costsCFFLines = cffLines.filter((line) => line.payments[0].methodType === 'cost');
    const lines = paymentsCFFLines.map((line, index) => line.flowDirection === 'in' ? <BankInvoice line={line} key={index}/> : <BankExpense line={line} key={index}/>);

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          Banca
        </h4>
        <br></br>
        <div className='cff-lines'>
          {lines}
        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = CFFMain;

