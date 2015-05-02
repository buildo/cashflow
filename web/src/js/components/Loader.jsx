/** @jsx React.DOM **/

'use strict';

const React = require('react');

const Loader = React.createClass({

  propTypes: {
    text:          React.PropTypes.string,
    showAsSegment: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      text: 'Loading'
    };
  },

  render() {

    const loader = (
      <div className='ui active inverted dimmer'>
        <div className='ui text loader'>{this.props.text}</div>
      </div>
    );

    if (this.props.showAsSegment) {
      return (
        <div className='ui segment'>
          {loader}
          <p></p>  
        </div>
      );
    }

    return loader;
  }

});


module.exports = Loader;
