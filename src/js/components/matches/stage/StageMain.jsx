/** @jsx React.DOM */

'use strict';

const React = require('react');
const MatchActions = require('../../../actions/MatchActions');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const StageDataStore = require('../../../store/StageDataStore.js');
const Match = require('./Match.jsx');

const getStateFromStores = function () {
  return {
    stagedMatches: StageDataStore.getAll(),
    isCommitting: StageDataStore.getState().isCommitting
  };
};

const StageMain = React.createClass({

  mixins: [ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(StageDataStore, this._onChange);
  },

  commitMatches: function() {
    MatchActions.commitMatches();
  },

  render: function() {

    if (this.state.isCommitting) {
      return (
        <div className="ui segment">
          <div className="ui active inverted dimmer">
            <div className="ui indeterminate text active loader">
              Commit in corso
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

    const commitButton = <div className='ui right align positive button' onClick={this.commitMatches}>Salva modifiche su Fatture In Cloud</div>;

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          STAGE
        </h4>
        {this.state.stagedMatches.length > 0 ? commitButton : ''}
        {this.state.stagedMatches.length > 0 ? matches : emptyStage}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = StageMain;
