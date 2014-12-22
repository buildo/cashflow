/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const MainPayment = require('./MainPayment.jsx');
const DataPayment = require('./DataPayment.jsx');
const ServerActions = require('../../../actions/ServerActions.js');


const Match = React.createClass({

  deleteStagedMatch: function() {
    const match = Immutable.fromJS(this.props.match);
    ServerActions.deleteStagedMatch(match);
  },

  render: function() {

    const match = this.props.match;

    return (
        <div className='ui segment'>
          <div>
            <MainPayment mainPayment={match.main}/>
            <br></br>
            <DataPayment dataPayment={match.data}/>
          </div>
          <div className='ui bottom attached'>
            <br></br>
            <div className='ui negative button' onClick={this.deleteStagedMatch}>Elimina</div>
          </div>
        </div>
    );
  },

});

module.exports = Match;
