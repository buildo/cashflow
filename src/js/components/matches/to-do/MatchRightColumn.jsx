/** @jsx React.DOM */

'use strict';

const React = require('react');
const DataPaymentPreview = require('./DataPaymentPreview.jsx');


const MatchRightColumn = React.createClass({

  componentDidMount: function() {
    const context = $(this.refs.dataPayments.getDOMNode());

    $(this.refs.tabItem1.getDOMNode()).tab({context: context});
    $(this.refs.tabItem2.getDOMNode()).tab({context: context});
  },

  render: function () {

    const flowDirection = this.props.flowDirection;

    const allPayments = this.props.dataPayments.filter((p) => p.id !== this.props.selectedPaymentId && p.info.flowDirection === flowDirection)
      .map((dataPayment, index) => <DataPaymentPreview dataPayment={dataPayment} flowDirection={flowDirection} key={index}/>);
    const matchingPayments = this.props.matchingDataPayments.filter((p) => p.id !== this.props.selectedPaymentId)
      .map((matchingDataPayment, index) => <DataPaymentPreview dataPayment={matchingDataPayment} flowDirection={flowDirection} key={index}/>);

    return (
      <div ref='dataPayments' className='data-payments'>
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
