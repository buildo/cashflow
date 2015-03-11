/** @jsx React.DOM */

'use strict';

const React = require('react');
const _ = require('lodash');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const Line = require('./Line.jsx');
const NewLine = require('./NewLine.jsx');
const ManualCFFDataStore = require('../../../store/ManualCFFDataStore.js');
const CFFStore = require('../../../store/CFFStore.js');
const CFFActions = require('../../../actions/CFFActions.js');


const getStateFromStores = function () {
  return _.extend(CFFStore.getState(), {lines: ManualCFFDataStore.getAll()});
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

  addLine: function() {
    CFFActions.addLine();
  },

  render: function() {

    if (this.state.isLoadingManual) {
      return null;
    }

    const lines = this.state.lines.map((line, index) => <Line line={line} key={index} id={index}/>);

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

