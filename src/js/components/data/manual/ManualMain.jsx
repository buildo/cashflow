/** @jsx React.DOM */

'use strict';

const React = require('react');
const _ = require('lodash');
const Immutable = require('immutable');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const validateCFF = require('cashflow').validateCFF;
const Line = require('./Line.jsx');
const NewLine = require('./NewLine.jsx');
const ManualCFFDataStore = require('../../../store/ManualCFFDataStore.js');
const CFFStore = require('../../../store/CFFStore.js');
const CFFActions = require('../../../actions/CFFActions.js');
const Loader = require('../../Loader.jsx');


const getStateFromStores = function () {
  return _.extend(CFFStore.getState(), {lines: ManualCFFDataStore.getAll()}, ManualCFFDataStore.getState());
};

const ManualMain = React.createClass({

  mixins: [ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(CFFStore, this._onChange);
    this.listenTo(ManualCFFDataStore, this._onChange);
  },

  isLineValid: function(line) {
    const fakeCFF = {
      sourceId: 'MANUAL',
      sourceDescription: 'manual inputs from user',
      lines: [line]
    };
    const immutableJSON = Immutable.fromJS(fakeCFF);
    const validationReport = validateCFF(immutableJSON);
    if (validationReport.has('errors')) {
      console.log('invalid CFF');
      console.log(validationReport.toJS().errors);
      return false;
    }
    return true;
  },

  saveLine: function(obj) {
    if (this.isLineValid(obj.line)) {
      CFFActions.saveManualLine({id: obj.id, line: obj.line});
    }
  },

  deleteLine: function(obj) {
    CFFActions.deleteManualLine(obj.id);
  },

  createLine: function(obj) {
    if (this.isLineValid(obj.line)) {
      CFFActions.createManualLine({id: obj.id, line: obj.line});
    }
  },

  isLineLoading: function(lineId) {
    return this.state.loadingLines.indexOf(lineId) > -1;
  },

  updateNewLine: function() {
    this.setState({isCreating: this.state.creatingStatus === 'CREATE'});
    if (this.state.creatingStatus === 'CREATE_SUCCESS') {
      this.refs.newLine.hide();
    }
  },

  render: function() {

    if (this.state.isLoadingManual) {
      return <Loader />;
    }

    const lines = this.state.lines.map((line, index) =>
      <Line
        line={line.line}
        id={line.id}
        onSave={this.saveLine}
        onDelete={this.deleteLine}
        isLoading={this.isLineLoading(line.id)}
        key={index}
      />
    );

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          Manuale
        </h4>
        <br></br>
        <NewLine onSave={this.createLine} isCreating={this.state.isCreating} ref='newLine'/>
        <div className='ui horizontal divider'>Linee</div>
        {lines}
        <br></br>
      </div>
    );
  },

  _onChange: function() {
    const _creatingStatus = this.state.creatingStatus;
    this.setState(getStateFromStores());
    if (_creatingStatus !== this.state.creatingStatus) {
      this.updateNewLine();
    }
  }

});

module.exports = ManualMain;

