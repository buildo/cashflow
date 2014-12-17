/** @jsx React.DOM */

'use strict';

const React = require('react');
const DataPayment = require('./DataPayment.jsx');


const DataPayments = React.createClass({

  render: function () {

    const allPayments = this.props.dataPayments.map((dataPayment, index) => <DataPayment dataPayment={dataPayment} key={index}/>);
    const matchingPayments = this.props.matchingDataPayments.map((matchingDataPayment, index) => <DataPayment dataPayment={matchingDataPayment} key={index}/>);

    return (
      <div className='data-payments'>
        <div className="ui two item tabular menu">
          <a className="item" data-tab="matches">Matches</a>
          <a className="active item" data-tab="all">All</a>
        </div>
        <div className="ui bottom attached tab" data-tab="matches">{matchingPayments}</div>
        <div className="ui top attached active tab" data-tab="all">{allPayments}</div>
      </div>
    );
  },

});


module.exports = DataPayments;
