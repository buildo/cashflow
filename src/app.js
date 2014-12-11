/** @jsx React.DOM */

'use strict';

const React = require('react'),
  Router = require('react-router'),
  Route = Router.Route,
  DefaultRoute = Router.DefaultRoute,
  MainApp = require('./js/components/MainApp.jsx'),
  CashflowMain = require('./js/components/analytics/cashflow/CashflowMain.jsx');

window.React = React;

const routes = (
  <Route path='/' handler={MainApp}>
    <DefaultRoute name='cashflow' href='/analytics/cashflow' handler={CashflowMain} />
  </Route>
);


Router.run(routes, (Handler) => {
  React.render(
    <Handler />,
    document.getElementById('cashflow-app'));
});

