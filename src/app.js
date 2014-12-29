/** @jsx React.DOM */

'use strict';

const React = require('react'),
  Router = require('react-router'),
  Route = Router.Route,
  DefaultRoute = Router.DefaultRoute,
  Redirect = Router.Redirect,
  RouteNames = require('./js/constants/RouteNames.js'),
  RouterActions = require('./js/actions/RouterActions.js'),
  App = require('./js/components/App.jsx'),
  WIP = require('./js/components/WIP.jsx'),
  AnalyticsMain = require('./js/components/analytics/AnalyticsMain.jsx'),
  CashflowMain = require('./js/components/analytics/cashflow/CashflowMain.jsx'),
  DataMain = require('./js/components/data/DataMain.jsx'),
  BankMain = require('./js/components/data/bank/BankMain.jsx'),
  ManualMain = require('./js/components/data/manual/ManualMain.jsx'),
  FICMain = require('./js/components/data/fatture-in-cloud/FICMain.jsx'),
  MatchesMain = require('./js/components/matches/MatchesMain.jsx'),
  TodoMain = require('./js/components/matches/to-do/TodoMain.jsx'),
  StageMain = require('./js/components/matches/stage/StageMain.jsx'),
  DoneMain = require('./js/components/matches/done/DoneMain.jsx'),
  LoginMain = require('./js/components/login/LoginMain.jsx'),
  Main = require('./js/components/main/Main.jsx');

const routes = (
  <Route name={RouteNames.APP} path='/' handler={App}>
    <Route name={RouteNames.MAIN} path='/' handler={Main}>
      <Route name={RouteNames.ANALYTICS} path='/analytics' handler={AnalyticsMain}>
        <Route name={RouteNames.ANALYTICS_CASHFLOW} path='cashflow' handler={CashflowMain} />
        <Route name={RouteNames.ANALYTICS_PROGETTI} path='progetti' handler={WIP} />
        <Route name={RouteNames.ANALYTICS_RISORSE} path='risorse' handler={WIP} />
        <Redirect from='/analytics' to='/analytics/cashflow'/>
      </Route>
      <Route name={RouteNames.DATA} path='/data' handler={DataMain}>
        <Route name={RouteNames.DATA_FATTURE_IN_CLOUD} path='fatture-in-cloud' handler={FICMain} />
        <Route name={RouteNames.DATA_BANCA} path='banca' handler={BankMain} />
        <Route name={RouteNames.DATA_MANUAL} path='manual' handler={ManualMain} />
        <Route name={RouteNames.DATA_PROGETTI} path='progetti' handler={WIP} />
        <Route name={RouteNames.DATA_RISORSE} path='risorse' handler={WIP} />
        <Redirect from='/data' to='/data/fatture-in-cloud'/>
      </Route>
      <Route name={RouteNames.MATCH} path='/match' handler={MatchesMain}>
        <Route name={RouteNames.MATCH_DA_FARE} path='da-fare' handler={TodoMain} />
        <Route name={RouteNames.MATCH_DA_SALVARE} path='da-salvare' handler={StageMain} />
        <Route name={RouteNames.MATCH_ARCHIVIATI} path='archiviati' handler={DoneMain} />
        <Redirect from='/match' to='/match/da-fare'/>
      </Route>
    </Route>
    <Route name={RouteNames.LOGIN} handler={LoginMain} />
  </Route>
);

window.React = React;

Router.run(routes, (Handler, state) => {
  RouterActions.notifyRouteChanged(state);
  React.render(
    <Handler />,
    document.getElementById('main-app'));
});

