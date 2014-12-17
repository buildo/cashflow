/** @jsx React.DOM */

'use strict';

const React = require('react');
const ServerActions = require('../../../actions/ServerActions');
const MatchesTodoStore = require('../../../store/MatchesTodoStore.js');
const Match = require('./Match.jsx');
const MatchPreview = require('./MatchPreview.jsx');

const getStateFromStores = function () {
  return {
    matchesTodo: MatchesTodoStore.getMatchesTodo(),
    isLoading: MatchesTodoStore.isLoading(),
    selectedMatchIndex: MatchesTodoStore.getSelectedMatchIndex(),
    selectedPaymentId: MatchesTodoStore.getSelectedPaymentId(),
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
        <div className='ui segment'>
          <div className='ui active inverted dimmer'>
            <div className='ui indeterminate text active loader'>
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
      <div className='ui ignored message'>
        <div className='stage-placeholder'>
          Non hai nessun pagamento da sincronizzare :)
        </div>
      </div>
    );

    const dataPayments = this.state.matchesTodo.data;
    const selectedMatchIndex = this.state.selectedMatchIndex;
    const selectedPaymentId = this.state.selectedPaymentId;

    const array = this.state.matchesTodo.matching.concat(this.state.matchesTodo.notMatching);

    const mixedMatches = array.map((el, index) => {
      const isMatch = Array.isArray(el);
      const mainPayment = isMatch ? el[0].main : el;
      const matchingDataPayments = isMatch ? el.map((match) => match.data) : [];

      if (index === selectedMatchIndex) {
        return <Match mainPayment={mainPayment} matchingDataPayments={matchingDataPayments} dataPayments={dataPayments} index={index} selectedPaymentId={selectedPaymentId} key={index}/>;
      } else {
        return <MatchPreview mainPayment={mainPayment} matchingDataPayments={matchingDataPayments} index={index} key={index}/>;
      }
    });

    console.log(selectedMatchIndex);

    const selectedMatch = selectedMatchIndex > -1 ? mixedMatches.splice(selectedMatchIndex, 1) : undefined;
    const matches = mixedMatches;
    console.log(selectedMatch);

    // <div class='ui right rail'>
    //   {matches}
    // </div>

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          Da Fare
        </h4>
        <br></br>
        <div className='ui relaxed fitted grid'>
          <div className='thirteen wide Left column'>
            {selectedMatch}
          </div>
          <div className='three wide Right column full height'>
            <div id='match-right-cloumn'>
              {matches}
            </div>
          </div>
        </div>
        {matches.length === 0 ? emptyTodo : ''}
        <br></br>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = TodoMain;
