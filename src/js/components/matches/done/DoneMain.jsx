/** @jsx React.DOM */

'use strict';

const React = require('react');
const ServerActions = require('../../../actions/ServerActions');
const MatchesDoneStore = require('../../../store/MatchesDoneStore.js');

const getStateFromStores = function () {
  return {
    matchesDone: MatchesDoneStore.getMatchesDone(),
    isLoading: MatchesDoneStore.isLoading(),
  };
};

const TodoMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    MatchesDoneStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MatchesDoneStore.removeChangeListener(this._onChange);
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

    const emptyDone = (
      <div className="ui ignored message">
        <div className="stage-placeholder">
          Non hai nessun pagamento da sincronizzare :)
        </div>
      </div>
    );

    const matches = <div/>; // TODO

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          TODO
        </h4>
        {this.state.matchesDone.length > 0 ? matches : emptyDone.length > 0}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = TodoMain;
