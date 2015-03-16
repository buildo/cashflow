/** @jsx React.DOM */

'use strict';

const React = require('react');
const Match = require('./Match.jsx');

const ModalWrapper = React.createClass({

  propTypes: {
    primaryPayment: React.PropTypes.object,
    secondaryPayments: React.PropTypes.array.isRequired,
    selectedPaymentId: React.PropTypes.string,
    show: React.PropTypes.bool.isRequired
  },

  componentDidMount: function() {
    this.componentDidUpdate();
  },

  getInitialState: function() {
    return {
      primaryPayment: this.props.primaryPayment
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.show){
      this.setState({primaryPayment: nextProps.primaryPayment});
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    $(this.refs.modal.getDOMNode()).modal({
      closable: false,
      duration: 300,
      context: '#main-app',
      onDeny: this.deselectMatch,
      onApprove: this.stageMatch
    }).modal(this.props.show ? 'show' : 'hide');
  },

  deselectMatch: function() {
    this.refs.match.deselectMatch();
  },

  stageMatch: function() {
    this.refs.match.stageMatch();
  },

  getContent: function() {
    if (this.state.primaryPayment) {
      return (
        <div className='content'>
          <Match
            match={this.state.primaryPayment}
            secondaryPayments={this.props.secondaryPayments}
            selectedPaymentId={this.props.selectedPaymentId}
            ref='match'
          />
        </div>
      );
    }
    return null;
  },

  render: function() {
    return (
      <div className='ui modal' ref='modal'>
        <i className='close icon' onClick={this.deselectMatch}></i>
        <div className='header'>
          Match
        </div>
        {this.getContent()}
        <div className='actions'>
          <div className='ui cancel button'>Cancel</div>
          <div className='ui positive button'>Save</div>
        </div>
      </div>
    );
  },

});

module.exports = ModalWrapper;
