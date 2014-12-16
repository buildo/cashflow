/** @jsx React.DOM */

'use strict';

const React = require('react');
const ServerActions = require('../../../actions/ServerActions');
const MatchesTodoStore = require('../../../store/MatchesTodoStore.js');
const Match = require('./Match.jsx');

const getStateFromStores = function () {
  return {
    matchesTodo: MatchesTodoStore.getMatchesTodo(),
    isLoading: MatchesTodoStore.isLoading(),
    selectedMatch: MatchesTodoStore.getSelectedMatch(),
  };
};

const TodoMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    MatchesTodoStore.addChangeListener(this._onChange);
    ServerActions.getMatchesTodo();
  },

  componentWillUnmount: function() {
    MatchesTodoStore.removeChangeListener(this._onChange);
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

    const emptyTodo = (
      <div className="ui ignored message">
        <div className="stage-placeholder">
          Non hai nessun pagamento da sincronizzare :)
        </div>
      </div>
    );

    const dataPayments = this.state.matchesTodo.data;
    const selectedMatch = this.state.selectedMatch;

    const matching = this.state.matchesTodo.matching.map(function(matches, index) {
      const mainPayment = matches[0].main;
      const matchingDataPayments = matches.map(function(match) {return match.data;});
      const key = index;
      return <Match isSelected={key === selectedMatch} mainPayment={mainPayment} matchingDataPayments={matchingDataPayments} dataPayments={dataPayments} key={key}/>;
    });

    const notMatching = this.state.matchesTodo.notMatching.map(function(payment, index) {
      const key = matching.length + index;
      return <Match isSelected={key === selectedMatch} mainPayment={payment} matchingDataPayments={[]} dataPayments={dataPayments} key={key}/>;
    });

    const matches = matching.concat(notMatching);

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          TODO
        </h4>
        <br></br>
        {matches.length > 0 ? matches : emptyTodo}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = TodoMain;
