/** @jsx React.DOM */

'use strict';

const React = require('react');
const ServerActions = require('../../../actions/ServerActions');
const TodoStore = require('../../../store/TodoStore.js');
const Match = require('./Match.jsx');
const MatchPreview = require('./MatchPreview.jsx');
const utils = require('../../../utils/utils.js');

const getStateFromStores = function () {
  return {
    mainMatches: TodoStore.getMainMatches(),
    dataPayments: TodoStore.getDataPayments(),
    isLoading: TodoStore.isLoading(),
    selectedMatchIndex: TodoStore.getSelectedMatchIndex(),
    selectedPaymentId: TodoStore.getSelectedPaymentId(),
  };
};

const TodoMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
    ServerActions.getMatchesTodo();
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
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

    const selectedMatchIndex = this.state.selectedMatchIndex;
    const selectedPaymentId = this.state.selectedPaymentId;

    const matchPreviews = this.state.mainMatches.sort(utils.sortByMatchesNumber).reduce((acc, match, index) => {
        if (index === selectedMatchIndex) {
          return acc;
        }
        acc.push(<MatchPreview match={match} index={index} key={index}/>);
        return acc;
      },
      []
    );

    const selectedMatch = this.state.mainMatches[selectedMatchIndex] ?
      <Match match={this.state.mainMatches[selectedMatchIndex]} dataPayments={this.state.dataPayments} selectedPaymentId={selectedPaymentId}/>
      :
      '';

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
              {matchPreviews}
            </div>
          </div>
        </div>
        {this.state.mainMatches.length === 0 ? emptyTodo : ''}
        <br></br>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = TodoMain;
