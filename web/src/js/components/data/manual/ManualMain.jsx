/** @jsx React.DOM */

'use strict';

const React = require('react');
const _ = require('lodash');
const Immutable = require('immutable');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const validateCFF = require('cashflow-core').validateCFF;
const Line = require('./Line.jsx');
const NewLine = require('./NewLine.jsx');
const ManualCFFDataStore = require('../../../store/ManualCFFDataStore.js');
const CFFStore = require('../../../store/CFFStore.js');
const ManualActions = require('../../../actions/ManualActions.js');
const Loader = require('../../Loader.jsx');

const NEW_LINE_ID = 'new-line';

const getStateFromStores = function () {
  return _.extend({loading: CFFStore.getState().isLoadingManual}, {lines: ManualCFFDataStore.getAll()}, ManualCFFDataStore.getState());
};

const ManualMain = React.createClass({

  mixins: [ListenerMixin],

  getInitialState() {
    return getStateFromStores();
  },

  componentDidMount() {
    this.listenTo(CFFStore, this._onChange);
    this.listenTo(ManualCFFDataStore, this._onChange);
  },

  isLineValid(_id, line) {
    const sendError = _id === NEW_LINE_ID ? ManualActions.setNewLineError : ManualActions.setLineError;

    // const lines = this.state.lines.map((l) => l._id === _id ? line : l.line);
    // const fakeCFF = {
    //   sourceId: 'MANUAL',
    //   sourceDescription: 'manual inputs from user',
    //   lines: lines
    // };
    // const immutableJSON = Immutable.fromJS(fakeCFF);
    // const validationReport = validateCFF(immutableJSON);

    // if (validationReport.has('errors')) {
    //   console.log(validationReport.toJS().errors);
    //   const error = validationReport.toJS().errors.map((e) => e.msg).join('\n');
    //   sendError(_id, error);
    //   return false;

    // } else

    // if (!line.id || typeof line.id !== 'string') {
    //   sendError(_id, '"id" missing or not a string');
    //   return false;

    // }
    if (!line.payments || !Array.isArray(line.payments)) {
      sendError(_id, '"payments" missing or not an array');
      return false;
    }
    return true;
  },

  fixImplicitValues(obj) {
    try {
      obj.line.payments = obj.line.payments.map((p) => {
        p.expectedDate = typeof p.expectedDate === 'string' ?
          [p.expectedDate, p.expectedDate] : p.expectedDate;
        p.expectedGrossAmount = typeof p.expectedGrossAmount === 'number' ?
          [p.expectedGrossAmount, p.expectedGrossAmount] : p.expectedGrossAmount;
        return p;
      });
    } catch (e) {}
  },

  saveLine(obj) {
    this.fixImplicitValues(obj);
    if (this.isLineValid(obj.id, obj.line)) {
      ManualActions.saveManualLine({_id: obj.id, line: obj.line});
    }
  },

  deleteLine(obj) {
    ManualActions.deleteManualLine(obj.id);
  },

  createLine(obj) {
    this.fixImplicitValues(obj);
    if (this.isLineValid(obj.id, obj.line)) {
      ManualActions.createManualLine(obj.line);
    }
  },

  getLines() {
    console.log(this.state.lines);
    return this.state.lines.map((line, i) =>
      <Line
        line={line.line}
        _id={line._id}
        onSave={this.saveLine}
        onDelete={this.deleteLine}
        loading={line.loading}
        error={line.error}
        key={i}
      />
    );
  },

  getNewLine() {
    return (
      <NewLine
        onSave={this.createLine}
        _id={NEW_LINE_ID}
        show={this.state.newLine.show}
        loading={this.state.newLine.loading}
        error={this.state.newLine.error}
        />
    );
  },

  render() {
    if (this.state.isLoadingManual) {
      return <Loader />;
    }

    return (
      <div>
        <h4 className='ui top attached inverted header'>Manuale</h4>
        <br></br>
        {this.getNewLine()}
        <div className='ui horizontal divider'>Linee</div>
        {this.getLines()}
        <br></br>
      </div>
    );
  },

  _onChange() {
    // const _creatingStatus = this.state.creatingStatus;
    this.setState(getStateFromStores());
    // if (_creatingStatus !== this.state.creatingStatus) {
    //   this.updateNewLine();
    // }
  }

});

module.exports = ManualMain;

