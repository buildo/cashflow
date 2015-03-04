/** @jsx React.DOM */

'use strict';

const React = require('react');
const TodoActions = require('../../../actions/TodoActions');
const TodoStore = require('../../../store/TodoStore.js');
const TodoDataStore = require('../../../store/TodoDataStore.js');
const Match = require('./Match.jsx');
const MatchPreview = require('./MatchPreview.jsx');
const utils = require('../../../utils/utils.js');

const getStateFromStores = function () {
  return {
    matches: TodoStore.getMatches(),
    secondaryPayments: TodoStore.getSecondaryPayments(),
    pov: TodoStore.getPOV(),
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
    TodoDataStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
    TodoDataStore.removeChangeListener(this._onChange);
  },

  invertMainData: function() {
    TodoActions.invertMatchesPOV();
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

    const matchPreviews = this.state.matches.sort(utils.sortByMatchesNumber).map((match, index) => {
      return <MatchPreview match={match} isSelected={index === selectedMatchIndex} index={index} key={index}/>;
    });

    const selectedMatch = this.state.matches[selectedMatchIndex] ?
      <Match match={this.state.matches[selectedMatchIndex]} secondaryPayments={this.state.secondaryPayments} selectedPaymentId={selectedPaymentId} pov={this.state.pov}/>
      :
      '';

    const pointOfViewButton = <div className='ui right align positive button' onClick={this.invertMainData}>Inverti punto di vista</div>;

    return (
      <div>
        <h4 className='ui top attached inverted header'>
          Da Fare
        </h4>
        <br></br>
        {pointOfViewButton}
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
        {this.state.matches.length === 0 ? emptyTodo : ''}
        <br></br>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = TodoMain;
