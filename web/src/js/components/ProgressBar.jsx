/** @jsx React.DOM */

'use strict';

const React = require('react');

const ProgressBar = React.createClass({

  propTypes: {
    percent: React.PropTypes.number.isRequired,
    label:   React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      label: 'Aggiornamento in corso'
    };
  },

  componentDidMount() {
    this.updateProgress(this.props.percent);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.percent !== this.props.percent) {
      this.updateProgress(nextProps.percent);
    }
  },

  updateProgress(percent) {
    $(this.refs.progressBar.getDOMNode()).progress({percent: percent});
  },

  render() {
    return (
      <div className='ui green active progress' ref='progressBar'>
        <div className='bar' />
        <div className='label'>{this.props.label}</div>
      </div>
    );
  },

});

module.exports = ProgressBar;
