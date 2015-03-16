/** @jsx React.DOM */

'use strict';

const React = require('react');
const _ = require('lodash');
const TodoActions = require('../../../actions/TodoActions.js');
const utils = require('../../../utils/utils.js');

const MatchPreview = React.createClass({

  propTypes: {
    match: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    pov: React.PropTypes.string.isRequired,
  },

  setAsSelected: function() {
    TodoActions.selectMatch(_.extend(this.props.match, {_type: this.props.pov}));
  },

  render: function() {
    const match = this.props.match;
    const type = match.info.flowDirection === 'in' ? 'Invoice' : 'Expense';
    const date = utils.formatDate(typeof match.date !== 'undefined' ? match.date : match.expectedDate[0]);
    return (
      <div className='item' onClick={this.setAsSelected}>
        <div className={'left floated ui circular label ' + (match.matches.length > 0 ? 'green' : 'red')}>{match.matches.length}</div>
        <div className='content'>
          <div className='header'>{match.info.description}{' '}</div>
          <div className='description'>{date} {type}</div>
        </div>
      </div>
    );
  },

});

module.exports = MatchPreview;
