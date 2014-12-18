/** @jsx React.DOM */

'use strict';

const React = require('react');
const TodoActions = require('../../../actions/TodoActions.js');
const MainPayment = require('./MainPayment.jsx');
const DataPayment = require('./DataPayment.jsx');
const utils = require('../../../utils/utils.js');

const MatchBody = React.createClass({

  render: function() {

    return (
      <div>
        <MainPayment mainPayment={this.props.mainPayment}/>
        {this.props.selectedPayment ? <DataPayment dataPayment={this.props.selectedPayment}/> : ''}
      </div>
    );
  },

});

module.exports = MatchBody;
