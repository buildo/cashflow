/** @jsx React.DOM */

'use strict';

const React = require('react');
const TodoActions = require('../../../actions/TodoActions.js');

const MatchPreview = React.createClass({

  setAsSelected: function() {
    const index = this.props.index;
    TodoActions.selectMatch(index);
  },

  render: function() {

    const match = this.props.match;
    const isSelected = this.props.isSelected;
    const divClasses = isSelected ? 'ui segment green center aligned selectable' : 'ui segment center aligned selectable';
    const lineId = match.info.lineId;
    const type = match.info.flowDirection === 'in' ? 'Invoice' : 'Expense';
    const idNumber = lineId.replace('exp_', '').replace('inv_', '');
    const paymentNumber = parseInt(match.scraperInfo.tranId.replace('tran_', '').replace('_', '')) + 1;

    return (
      <div className={divClasses} onClick={this.setAsSelected}>
        <div className='ui mini statistic'>
          <div className='value'>
            {type} {idNumber}
          </div>
          <div className='label'>
            {paymentNumber}º payment
          </div>
        </div>
        <div className='ui mini statistic'>
          <div className='value'>
            {match.matches.length}
          </div>
          <div className='label'>
            {match.matches.length === 1 ? 'match' : 'matches'}
          </div>
        </div>
      </div>
    );
  },

});

module.exports = MatchPreview;
