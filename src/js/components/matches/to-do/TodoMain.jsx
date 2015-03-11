/** @jsx React.DOM */

'use strict';

const React = require('react');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const TodoActions = require('../../../actions/TodoActions');
const TodoStore = require('../../../store/TodoStore.js');
const Match = require('./Match.jsx');
const MatchPreview = require('./MatchPreview.jsx');
const utils = require('../../../utils/utils.js');

const getStateFromStores = function () {
  return TodoStore.getState();
};

const TodoMain = React.createClass({

  mixins: [ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(TodoStore, this._onChange);
  },

  invertMainData: function() {
    TodoActions.invertPOV();
  },

  render: function() {

    if (!this.state.matches) {
      return null;
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
      <Match match={this.state.matches[selectedMatchIndex]} secondaryPayments={this.state.secondaryPayments} selectedPaymentId={selectedPaymentId} pov={this.state.pointOfView}/>
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
