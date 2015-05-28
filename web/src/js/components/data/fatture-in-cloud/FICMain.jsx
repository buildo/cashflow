/** @jsx React.DOM */

'use strict';

const _ = require('lodash');
const React = require('react');
const State = require('react-router').State;
const FICPayment = require('./FICPayment.jsx');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const CFFStore = require('../../../store/CFFStore.js');
const PullProgressStore = require('../../../store/PullProgressStore.js');
const CFFActions = require('../../../actions/CFFActions.js');
const PullProgress = require('./PullProgress.jsx');
const Loader = require('../../Loader.jsx');


const CFFMain = React.createClass({

  mixins: [State, ListenerMixin],

  getInitialState() {
    return this.getStateFromStores();
  },

  getStateFromStores() {
    return _.extend(CFFStore.getState(), PullProgressStore.getState());
  },

  componentDidMount() {
    this.listenTo(CFFStore, this._onChange);
    this.listenTo(PullProgressStore, this._onChange);
  },

  pullMain() {
    CFFActions.pullMain();
  },

  render() {

    if (this.state.isPullingMain && this.state.progressMain) {
      return <PullProgress progress={this.state.progressMain} />;
    }

    if (this.state.isLoadingMain) {
      return <Loader />;
    }

    const cffLines = this.state.main ? this.state.main.lines : [];
    const lines = cffLines.map((line, index) => <FICPayment line={line} key={index}/>);

    return (
      <div key='3'>
        <h4 className='ui top attached inverted header'>
          Fatture In Cloud
        </h4>
        <br></br>
        <div className='ui right align blue button' onClick={this.pullMain}>Aggiorna</div>
        <div className='cff-lines'>
          {lines}
        </div>
      </div>
    );
  },

  _onChange() {
    this.setState(this.getStateFromStores());
    // if (newState.isPullingMain && newState.progressMain && newState.progressMain.completed) {
    //   CFFActions.resetMainPullProgress();
    //   CFFActions.getMain.defer();
    // } else if(newState.isPullingMain) {
    //   setTimeout(CFFActions.getMainPullProgress, 200);
    // }
  }

});

module.exports = CFFMain;
