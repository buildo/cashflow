/** @jsx React.DOM */

'use strict';

const React = require('react');
const State = require('react-router').State;
const FICInvoice = require('./FICInvoice.jsx');
const FICExpense = require('./FICExpense.jsx');
const CFFStore = require('../../../store/CFFStore.js');



const getStateFromStores = function () {
  return {
    isLoading: CFFStore.isLoadingMain(),
    cff: CFFStore.getMainCFF() || {},
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
    const lines = cffLines.map((line, index) => line.flowDirection === 'in' ? <FICInvoice line={line} key={index}/> : <FICExpense line={line} key={index}/>);

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          Fatture In Cloud
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

