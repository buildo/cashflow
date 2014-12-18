/** @jsx React.DOM */

'use strict';

const React = require('react');
const ServerActions = require('../../../actions/ServerActions');
const StageStore = require('../../../store/StageStore.js');
const Match = require('./Match.jsx');

const getStateFromStores = function () {
  return {
    stagedMatches: StageStore.getStagedMatches() || {},
    isLoading: StageStore.isLoading()
  };
};

const StageMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    StageStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    StageStore.removeChangeListener(this._onChange);
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

    const matches = this.state.stagedMatches.map((match, index) =>
      <Match match={match} key={index}/>);

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          STAGE
        </h4>
        {this.state.stagedMatches.length > 0 ? matches : emptyStage}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = StageMain;
