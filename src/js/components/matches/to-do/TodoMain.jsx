/** @jsx React.DOM */

'use strict';

const React = require('react');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const TodoActions = require('../../../actions/TodoActions');
const TodoStore = require('../../../store/TodoStore.js');
const ModalWrapper = require('./ModalWrapper.jsx');
const Match = require('./Match.jsx');
const MatchPreview = require('./MatchPreview.jsx');
const Payment = require('./Payment.jsx');
const utils = require('../../../utils/utils.js');

const getStateFromStores = function () {
  const _state = TodoStore.getState();
  // _state.matches = _state.matches ? _state.matches.sort(utils.sortByMatchesNumber) : _state.matches;
  _state.showModal = _state.matches && _state.matches[_state.selectedMatchIndex] ? true : false;
  return _state;
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

  getPlaceholder: function() {
    if (this.state.matches.length === 0) {
      return (
        <div className='ui ignored message'>
          <div className='stage-placeholder'>
            Non hai nessun pagamento da sincronizzare
          </div>
        </div>
      );
    }
    return null;
  },

  getModalIfNeeded: function() {
    return (
      <ModalWrapper
        primaryPayment={this.state.matches[this.state.selectedMatchIndex]}
        secondaryPayments={this.state.secondaryPayments}
        selectedPaymentId={this.state.selectedPaymentId}
        pov={this.state.pointOfView}
        show={this.state.showModal}
      />);
  },

  render: function() {
    if (!this.state.matches) {
      return null;
    }

    const matchPreviews = this.state.matches.map((match, index) => {
      return <MatchPreview match={match} isSelected={index === this.state.selectedMatchIndex} index={index} key={index}/>;
    });
    const pointOfViewButton = <div className='ui right align positive button' onClick={this.invertMainData}>Inverti punto di vista</div>;
    return (
      <div>
        <h4 className='ui top attached inverted header'>
          Da Fare
        </h4>
        <br></br>
        {this.getModalIfNeeded()}
        {pointOfViewButton}
        {matchPreviews}
        {this.getPlaceholder()}
        <br></br>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = TodoMain;
