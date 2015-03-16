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
  _state.showModal = _state.selectedMatch ? true : false;
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
    if (this.state.ficMatches.length === 0 && this.state.dataMatches.length === 0) {
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

  getModal: function() {
    let secondaryPayments = [];
    if (this.state.selectedMatch) {
      secondaryPayments = this.state.selectedMatch.type === 'data' ? this.state.mainPayments : this.state.dataPayments;
    }
    return (
      <ModalWrapper
        primaryPayment={this.state.selectedMatch}
        secondaryPayments={secondaryPayments}
        selectedPaymentId={this.state.selectedPaymentId}
        show={this.state.showModal}
      />);
  },

  render: function() {
    if (!this.state.ficMatches && !this.state.dataMatches) {
      return null;
    }

    const ficMatches = this.state.ficMatches.map((match, i) => <MatchPreview match={match} index={i} pov='main' key={i}/>);
    const dataMatches = this.state.dataMatches.map((match, i) => <MatchPreview match={match} index={i} pov='data' key={i}/>);
    return (
      <div>
        <h4 className='ui top attached inverted header'>Da Fare</h4>
        <br></br>
        {this.getModal()}
        <div className='ui two column divided grid'>
          <div className='column'>
            <h4 className='ui header'>FIC -> BANCA</h4>
            <div className='ui divided selection list'>
              {ficMatches}
            </div>
          </div>
          <div className='column'>
            <h4 className='ui header'>BANCA -> FIC</h4>
            <div className='ui divided selection list'>
              {dataMatches}
            </div>
          </div>
        </div>
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
