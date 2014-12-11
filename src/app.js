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
    <Route name='app' href='/' path='/' handler={Home}>
      <Route name='analytics' href='/analytics' path='/analytics' handler={AnalyticsMain}>
        <DefaultRoute handler={CashflowMain} />
        <Route name='cashflow' href='/analytics/cashflow' path='/analytics/cashflow' handler={CashflowMain} />
      </Route>
    </Route>
    <Route name='login' href='/login' path='/login' handler={LoginMain} />
  </Route>
);


Router.run(routes, (Handler) => {
  React.render(
    <Handler />,
    document.getElementById('main-app'));
});

