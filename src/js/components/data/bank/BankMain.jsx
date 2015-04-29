/** @jsx React.DOM */

'use strict';

const React = require('react');
const State = require('react-router').State;
const BankPayment = require('./BankPayment.jsx');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const CFFStore = require('../../../store/CFFStore.js');
const CFFActions = require('../../../actions/CFFActions.js');
const Loader = require('../../Loader.jsx');


const getStateFromStores = function () {
  return CFFStore.getState();
};

const CFFMain = React.createClass({

  mixins: [State, ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(CFFStore, this._onChange);
  },

  pullBank: function() {
    CFFActions.pullBank();
  },

  getLineType: function(line) {
    return line.flowDirection === 'in' ? 'invoice' : 'expense';
  },

  render: function() {

    if (this.state.isLoadingBank) {
      return <Loader />;
    }

    const cffLines = this.state.bank ? this.state.bank.lines : [];
    const paymentsCFFLines = cffLines.filter((line) => (line.payments[0].methodType !== 'bank fee' && line.payments[0].methodType !== 'ignore'));
    // const costsCFFLines = cffLines.filter((line) => line.payments[0].methodType === 'cost');
    const lines = paymentsCFFLines.map((line, index) => <BankPayment line={line} key={index}/>);

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          Banca
        </h4>
        <br></br>
        <div className='ui right align blue button' onClick={this.pullBank}>Aggiorna</div>
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

