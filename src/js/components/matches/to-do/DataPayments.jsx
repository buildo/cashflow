/** @jsx React.DOM */

'use strict';

const React = require('react');
const DataPayment = require('./DataPayment.jsx');


const DataPayments = React.createClass({

  render: function () {

    const payments = this.props.dataPayments.map((dataPayment, index) => <DataPayment dataPayment={dataPayment} key={index}/>);

    return (
      <div>
        {payments}
      </div>
    );
  },

});


module.exports = DataPayments;
