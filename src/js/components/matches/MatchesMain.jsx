/** @jsx React.DOM */

'use strict';

const React = require('react');
const ServerActions = require('../../actions/ServerActions');
const MatchesStore = require('../../store/MatchesStore.js');
const CFFStore = require('../../store/CFFStore.js');
const TodoMain = require('./to-do/TodoMain.jsx');

const getStateFromStores = function () {
  return {
    isLoading: CFFStore.isLoading(),
    matchesData: MatchesStore.getMatchesData() || {},
  };
};

const MatchesMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    MatchesStore.addChangeListener(this._onChange);
    CFFStore.addChangeListener(this._onChange);

    if (!CFFStore.getMainCFF()) {
      ServerActions.updateMain();
    }

    if (!CFFStore.getBankCFF()) {
      ServerActions.updateBank();
    }
  },

  componentWillUnmount: function() {
    MatchesStore.removeChangeListener(this._onChange);
    CFFStore.removeChangeListener(this._onChange);
  },

  render: function() {

    console.log('RENDER_CFF');

    if (this.state.isLoading) {
      return (
        <div className="ui segment">
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


    return (
      <div>
        <h4 className='ui top attached inverted header'>
          MAIN
        </h4>
        <TodoMain/>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = MatchesMain;

