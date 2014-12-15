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
  AnalyticsMain = require('./js/components/analytics/AnalyticsMain.jsx'),
  CashflowMain = require('./js/components/analytics/cashflow/CashflowMain.jsx'),
  LoginMain = require('./js/components/login/LoginMain.jsx'),
  Main = require('./js/components/main/Main.jsx');

const routes = (
  <Route name={RouteNames.APP} path='/' handler={App}>
    <Route name={RouteNames.MAIN} path='/' handler={Main}>
      <Route name={RouteNames.ANALYTICS} path='/analytics' handler={AnalyticsMain}>
        <Route name={RouteNames.ANALYTICS_CASHFLOW} path='cashflow' handler={CashflowMain} />
        <Route name={RouteNames.ANALYTICS_PROGETTI} path='progetti' handler={CashflowMain} />
        <Route name={RouteNames.ANALYTICS_RISORSE} path='risorse' handler={CashflowMain} />
        <Redirect from='/analytics' to='/analytics/cashflow'/>
      </Route>
      <Route name={RouteNames.DATA} path='/data' handler={AnalyticsMain}>
        <Route name={RouteNames.DATA_FATTURE_IN_CLOUD} path='fatture-in-cloud' handler={CashflowMain} />
        <Route name={RouteNames.DATA_BANCA} path='banca' handler={CashflowMain} />
        <Route name={RouteNames.DATA_PROGETTI} path='progetti' handler={CashflowMain} />
        <Route name={RouteNames.DATA_RISORSE} path='risorse' handler={CashflowMain} />
      </Route>
      <Route name={RouteNames.MATCH} path='/match' handler={AnalyticsMain}>
        <Route name={RouteNames.MATCH_DA_FARE} path='da-fare' handler={CashflowMain} />
        <Route name={RouteNames.MATCH_DA_SALVARE} path='da-salvare' handler={CashflowMain} />
        <Route name={RouteNames.MATCH_ARCHIVIATI} path='archiviati' handler={CashflowMain} />
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

