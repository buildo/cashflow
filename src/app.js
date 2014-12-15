/** @jsx React.DOM */

'use strict';

const React = require('react'),
  RouterActions = require('./js/actions/RouterActions.js'),
  Router = require('react-router'),
  Route = Router.Route,
  DefaultRoute = Router.DefaultRoute,
  Redirect = Router.Redirect,
  App = require('./js/components/App.jsx'),
  AnalyticsMain = require('./js/components/analytics/AnalyticsMain.jsx'),
  CashflowMain = require('./js/components/analytics/cashflow/CashflowMain.jsx'),
  LoginMain = require('./js/components/login/LoginMain.jsx'),
  Main = require('./js/components/main/Main.jsx');

const routes = (
  <Route name="app" path='/' handler={App}>
    <Route handler={Main}>
      <Route name='analytics' path='/analytics' handler={AnalyticsMain}>
        <Route name='cashflow' path='cashflow' handler={CashflowMain} />
        <Redirect from='/analytics' to='cashflow'/>
      </Route>
    </Route>
    <Route name='login' handler={LoginMain} />
  </Route>
);

window.React = React;

Router.run(routes, (Handler, state) => {
  console.log('NEW_ROUTE: ' + state);
  React.render(
    <Handler />,
    document.getElementById('main-app'));
});

