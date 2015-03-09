/** @jsx React.DOM */

'use strict';

const _ = require('lodash');
const React = require('react');
const State = require('react-router').State;
const FICInvoice = require('./FICInvoice.jsx');
const FICExpense = require('./FICExpense.jsx');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const CFFStore = require('../../../store/CFFStore.js');
const PullProgressStore = require('../../../store/PullProgressStore.js');
const CFFActions = require('../../../actions/CFFActions.js');


const getStateFromStores = function () {
  return _.extend(CFFStore.getState(), PullProgressStore.getState());
};

const CFFMain = React.createClass({

  mixins: [State, ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(CFFStore, this._onChange);
    this.listenTo(PullProgressStore, this._onChange);
  },

  pullMain: function() {
    CFFActions.pullMain();
  },

  render: function() {

    if (this.state.isLoadingMain) {
      return (
        <div className="ui segment" id='loadingSegment' key='1'>
          <div className="ui active inverted dimmer">
            <div className="ui indeterminate text active loader">
              Caricamento...
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
        </div>
      );
    }

    const progress = this.state.progressMain;

    if (this.state.isPullingMain) {
      let percent = 0;
      if (progress && this.state.isToUpdate) {
        percent += progress.authentication === 'done' ? 20 : 0;
        percent += progress.invoices.list === 'done' ? 5 : 0;
        percent += progress.expenses.list === 'done' ? 5 : 0;
        const todo = (Array.isArray(progress.invoices.data) ? progress.invoices.data[1] : 0) + (Array.isArray(progress.expenses.data) ? progress.expenses.data[1] : 0);
        const done = (Array.isArray(progress.invoices.data) ? progress.invoices.data[0] : 0) + (Array.isArray(progress.expenses.data) ? progress.expenses.data[0] : 0);
        percent += todo !== 0 ? (70 * (done / todo)) : 0;
        percent = progress.completed ? 100 : percent;
        if (this.refs.pullProgressBar) {
          $(this.refs.pullProgressBar.getDOMNode()).progress({percent: percent});
        }
      }
      return (
        <div className='ui green active progress' ref='pullProgressBar' id='pullProgressBar' key='2'>
          <div className='bar'></div>
          <div className='label'>Aggiornamento in corso</div>
        </div>
      );
    }

    const cffLines = this.state.main ? this.state.main.lines : [];
    const lines = cffLines.map((line, index) => line.flowDirection === 'in' ? <FICInvoice line={line} key={index}/> : <FICExpense line={line} key={index}/>);

    return (
      <div key='3'>
        <h4 className='ui top attached inverted header'>
          Fatture In Cloud
        </h4>
        <br></br>
        <div className='ui right align positive button' onClick={this.pullMain}>Aggiorna</div>
        <div className='cff-lines'>
          {lines}
        </div>
      </div>
    );
  },

  _onChange: function() {
    const newState = getStateFromStores();
    this.setState(newState);
    if (newState.isPullingMain && newState.progressMain && newState.progressMain.completed) {
      CFFActions.resetMainPullProgress();
    } else if(newState.isPullingMain) {
      setTimeout(CFFActions.getMainPullProgress, 200);
    }
  }

});

module.exports = CFFMain;
