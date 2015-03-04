/** @jsx React.DOM */

'use strict';

const React = require('react');
const ManualCffEditor = require('./ManualCffEditor.jsx');
const Line = require('./Line.jsx');
const NewLine = require('./NewLine.jsx');
const ManualCFFDataStore = require('../../../store/ManualCFFDataStore.js');
const CFFStore = require('../../../store/CFFStore.js');
const ServerActions = require('../../../actions/ServerActions.js');
const ManualCFFActions = require('../../../actions/ManualCFFActions.js');


const getStateFromStores = function () {
  return {
    isLoadingManualCFF: CFFStore.isLoadingManual(),
    lines: ManualCFFDataStore.getAll()
  };
};

const ManualMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CFFStore.addChangeListener(this._onChange);
    ManualCFFDataStore.addChangeListener(this._onChange);
    ServerActions.getManual();
  },

  componentWillUnmount: function() {
    CFFStore.removeChangeListener(this._onChange);
    ManualCFFDataStore.removeChangeListener(this._onChange);
  },

  addLine: function() {
    ManualCFFActions.addLine();
  },

  render: function() {

    if (this.state.isLoadingManualCFF) {
      return <div/>;
    }

    const manualCFFLines = this.state.manualCFF && this.state.manualCFF.lines ? this.state.manualCFF.lines : [];
    const lines = manualCFFLines.map((line, index) => <Line line={line} key={index}/>);

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          Manuale
        </h4>
        <br></br>
        <NewLine/>
        {lines}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = ManualMain;

