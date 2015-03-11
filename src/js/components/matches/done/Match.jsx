/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const MainPayment = require('../MainPayment.jsx');
const DataPayment = require('../DataPayment.jsx');
const MatchActions = require('../../../actions/MatchActions.js');


const Match = React.createClass({

  propTypes: {
    match: React.PropTypes.object.isRequired
  },

  deleteMatch: function() {
    const match = Immutable.fromJS(this.props.match);
    MatchActions.deleteMatchOptimistic(match);
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
            <div className='ui negative button' onClick={this.deleteMatch}>Elimina</div>
          </div>
        </div>
    );
  },

});

module.exports = Match;
