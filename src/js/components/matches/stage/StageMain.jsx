/** @jsx React.DOM */

'use strict';

const React = require('react');
const ServerActions = require('../../../actions/ServerActions');
const StageDataStore = require('../../../store/StageDataStore.js');
const CFFStore = require('../../../store/CFFStore.js');


const getStateFromStores = function () {
  return {
    stagedLines: StageDataStore.getStagedLines() || {},
    isLoading: StageDataStore.isLoading()
  };
};

const StageMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    StageDataStore.addChangeListener(this._onChange);
    CFFStore.addChangeListener(this.CFFStoreChanged);
    if (!StageDataStore.getStagedLines()) {
      ServerActions.getStagedLines();
    }
  },

  componentWillUnmount: function() {
    StageDataStore.removeChangeListener(this._onChange);
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

    const emptyStage = (
      <div className="ui ignored message">
        <div className="stage-placeholder">
          Non hai nessun match da salvare.
        </div>
      </div>
    );

    const stagedLines = <div/>; // TODO

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          STAGE
        </h4>
        {this.state.stagedLines.length > 0 ? stagedLines : emptyStage}
      </div>
    );
  },

  CFFStoreChanged: function() {
    if (!CFFStore.isLoading()) {
      ServerActions.getStagedLines();
    }
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = StageMain;
