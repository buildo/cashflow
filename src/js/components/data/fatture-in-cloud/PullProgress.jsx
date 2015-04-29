/** @jsx React.DOM */

'use strict';

const React = require('react');
const ProgressBar = require('../../ProgressBar.jsx');

const PullProgress = React.createClass({

  propTypes: {
    progress: React.PropTypes.object.isRequired,
  },

  getPercent() {
    const progress = this.props.progress;
    let percent = 0;
    percent += progress.authentication === 'done' ? 20 : 0;
    percent += progress.invoices.list === 'done' ? 5 : 0;
    percent += progress.expenses.list === 'done' ? 5 : 0;

    const todo = (Array.isArray(progress.invoices.data) ? progress.invoices.data[1] : 0) + (Array.isArray(progress.expenses.data) ? progress.expenses.data[1] : 0);
    const done = (Array.isArray(progress.invoices.data) ? progress.invoices.data[0] : 0) + (Array.isArray(progress.expenses.data) ? progress.expenses.data[0] : 0);

    percent += todo !== 0 ? (70 * (done / todo)) : 0;
    percent = progress.completed ? 100 : percent;

    return percent;
  },

  render() {
    return <ProgressBar percent={this.getPercent()} />;
  },

});

module.exports = PullProgress;
