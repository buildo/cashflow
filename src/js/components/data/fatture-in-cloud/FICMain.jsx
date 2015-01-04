/** @jsx React.DOM */

'use strict';

const React = require('react');
const State = require('react-router').State;
const FICInvoice = require('./FICInvoice.jsx');
const FICExpense = require('./FICExpense.jsx');
const CFFStore = require('../../../store/CFFStore.js');
const PullProgressStore = require('../../../store/PullProgressStore.js');
const ServerActions = require('../../../actions/ServerActions.js');
const FICActions = require('../../../actions/FICActions.js');


const getStateFromStores = function () {
  return {
    isLoading: CFFStore.isLoadingMain(),
    isPulling: PullProgressStore.isPullingMain(),
    progress: PullProgressStore.getProgressMain(),
    cff: CFFStore.getMainCFF() || {},
  };
};

const CFFMain = React.createClass({

  mixins: [State],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CFFStore.addChangeListener(this._onChange);
    PullProgressStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CFFStore.removeChangeListener(this._onChange);
    PullProgressStore.removeChangeListener(this._onChange);
  },

  pullMain: function() {
    ServerActions.pullMain();
  },

  render: function() {

    if (this.state.isLoading) {
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

    const progress = this.state.progress;

    if (this.state.isPulling) {
      let percent = 0;
      if (progress) {
        percent += progress.authentication === 'done' ? 30 : 0;
        const todo = (Array.isArray(progress.invoices.list) ? progress.invoices.list[1] : 0) + (Array.isArray(progress.expenses.list) ? progress.expenses.list[1] : 0);
        const done = (Array.isArray(progress.invoices.list) ? progress.invoices.list[0] : 0) + (Array.isArray(progress.expenses.list) ? progress.expenses.list[0] : 0);
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

    const cffLines = this.state.cff.lines || [];
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
    this.setState(getStateFromStores());
    if (this.state.isPulling) {
      var a = this.state.progress && this.state.progress.completed ? FICActions.setPullEnded() : ServerActions.getMainPullProgress();
    }
  }

});

module.exports = CFFMain;
