/** @jsx React.DOM */

'use strict';

const React = require('react');
const Link = require('react-router').Link;
const ListenerMixin = require('alt/mixins/ListenerMixin');
const LoginActions = require('../../actions/LoginActions.js');
const CFFActions = require('../../actions/CFFActions.js');
const PullProgressStore = require('../../store/PullProgressStore.js');


const TopBar = React.createClass({

  propTypes: {
    pages: React.PropTypes.array.isRequired,
    selectedPage: React.PropTypes.string.isRequired
  },

  mixins: [ListenerMixin],

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.listenTo(PullProgressStore, this._onChange);

    $(this.refs.dropdownMenu.getDOMNode()).dropdown();
  },

  getToken() {
    console.log(localStorage.getItem('cashflow_token'));
  },

  logOut() {
    LoginActions.logOut();
  },

  runScrapers() {
    CFFActions.pullMain();
    CFFActions.pullBank();
  },

  render () {

    const selectedPage = this.props.selectedPage;
    const pages = this.props.pages.map((page, index) => {
      const classes = page.id === selectedPage ? 'active item' : 'item';
      return (
        <Link className={classes} to={page.id} key={index}>
          {page.name}
        </Link>
      );
    });

    const currentTabs = this.props.pages.filter((page) => page.id === selectedPage)[0].tabs;
    const tabs = currentTabs.map((tab, index) => {
      return (
        <Link className='item' to={tab.id} key={index}>
          {tab.name}
        </Link>
      );
    });

    const pulling = this.state.updatingDatabase ? 'loading' : '';

    return (
      <div className='ui tiered menu'>
        <div className='menu'>
          {pages}
          <div className='right menu'>
            <div className='item'>
              <div className={`ui ${pulling} button`} onClick={this.runScrapers}>Update database</div>
            </div>
            <div ref='dropdownMenu' className='ui dropdown item'>
              More
              <i className='icon dropdown'></i>
              <div className='menu'>
                <div className='item' onClick={this.getToken}><i className='edit icon'></i> Get Token</div>
                <div className='item' onClick={this.logOut}><i className='globe icon'></i> Log Out</div>
              </div>
            </div>
          </div>
        </div>
        <div className='ui sub menu'>
          {tabs}
        </div>
      </div>
    );
  },

  _onChange() {
    const newState = PullProgressStore.getState();
    const updatingDatabase = newState.isPullingMain || newState.isPullingBank;
    this.setState({ updatingDatabase });
    if (newState.isPullingMain && newState.progressMain && newState.progressMain.completed) {
      CFFActions.resetMainPullProgress();
      CFFActions.getMain.defer();
    } else if(newState.isPullingMain) {
      setTimeout(CFFActions.getMainPullProgress, 200);
    }
    this.setState({ updatingDatabase });
  }

});

module.exports = TopBar;
