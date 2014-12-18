/** @jsx React.DOM */

'use strict';

const React = require('react');
const StageActions = require('../../../actions/StageActions.js');
const MainPayment = require('./MainPayment.jsx');
const DataPayment = require('./DataPayment.jsx');

const Match = React.createClass({

  deleteStagedMatch: function() {
  },

  updateFattureInCloud: function() {
  },

  render: function() {

    const match = this.props.match;

    return (
      <div>
        <div className='ui segment'>
          <div>
            <MainPayment mainPayment={match.main}/>
            <DataPayment dataPayment={match.data}/>
          </div>
          <div className='ui bottom attached'>
            <div className='ui buttons'>
              <div className='ui negative button' onClick={this.deleteStagedMatch}>Elimina</div>
              <div className='or'></div>
              <div className='ui positive button' onClick={this.updateFattureInCloud}>Salva modifiche su Fatture In Cloud</div>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Match;
