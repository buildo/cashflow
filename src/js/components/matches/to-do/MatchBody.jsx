/** @jsx React.DOM */

'use strict';

const React = require('react');
const Payment = require('./Payment.jsx');
const utils = require('../../../utils/utils.js');

const MatchBody = React.createClass({

  render: function() {
    return (
      <div>
        <Payment payment={this.props.match} isPrimary={true}/>
        {this.props.selectedPayment ? <Payment payment={this.props.selectedPayment} isPrimary={false}/> : ''}
      </div>
    );
  },

});

module.exports = MatchBody;
