/** @jsx React.DOM */

'use strict';

const React = require('react');
const PaymentPreview = require('./PaymentPreview.jsx');
const utils = require('../../../utils/utils.js');

const MatchRightColumn = React.createClass({

  propTypes: {
    flowDirection: React.PropTypes.string.isRequired,
    secondaryPayments: React.PropTypes.array.isRequired,
    matches: React.PropTypes.array.isRequired,
    selectedPaymentId: React.PropTypes.string
  },

  componentDidMount: function() {
    const context = $(this.refs.secondaryPayments.getDOMNode());
    $(this.refs.tabItem1.getDOMNode()).tab({context: context});
    $(this.refs.tabItem2.getDOMNode()).tab({context: context});
  },

  render: function () {
    const flowDirection = this.props.flowDirection;
    const allPayments = this.props.secondaryPayments.sort(utils.sortPaymentsByDate).filter((p) => p.id !== this.props.selectedPaymentId && p.info.flowDirection === flowDirection)
      .map((payment, index) => <PaymentPreview payment={payment} flowDirection={flowDirection} key={index}/>);

    const matchingPayments = this.props.matches.map(
      (matchingPayment, index) => <PaymentPreview payment={matchingPayment} isSelected={matchingPayment.id === this.props.selectedPaymentId} flowDirection={flowDirection} key={index}/>);

    return (
      <div ref='secondaryPayments' className='data-payments'>
        <div className="ui two item tabular menu">
          <a ref='tabItem1' className="active item" data-tab="matches">Matches</a>
          <a ref='tabItem2' className="item" data-tab="all">All</a>
        </div>
        <div className="ui bottom attached active tab" data-tab="matches">{matchingPayments}</div>
        <div className="ui top attached tab" data-tab="all">{allPayments}</div>
      </div>
    );
  },

});


module.exports = MatchRightColumn;
