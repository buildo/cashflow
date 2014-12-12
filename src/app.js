/** @jsx React.DOM */

'use strict';

const React = require('react'),
  Router = require('react-router'),
  Route = Router.Route,
  DefaultRoute = Router.DefaultRoute,
  MainApp = require('./js/components/MainApp.jsx'),
  AnalyticsMain = require('./js/components/analytics/AnalyticsMain.jsx'),
  CashflowMain = require('./js/components/analytics/cashflow/CashflowMain.jsx'),
  LoginMain = require('./js/components/login/LoginMain.jsx'),
  Home = require('./js/components/home/Home.jsx');

window.React = React;

const routes = (
  <Route path='/' handler={MainApp}>
    <Route name='login' handler={LoginMain} />
    <Route name='app' path='/' handler={Home}>
      <Route handler={AnalyticsMain}>
        <Route handler={CashflowMain} />
      </Route>
      <Route name='analytics' handler={AnalyticsMain}>
        <Route name='cashflow' handler={CashflowMain} />
      </Route>
    </Route>
  </Route>
);


Router.run(routes, (Handler) => {
  React.render(
    <Handler />,
    document.getElementById('main-app'));
});

