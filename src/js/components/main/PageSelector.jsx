/** @jsx React.DOM */

'use strict';

const React = require('react');
const TabSelector = require('./TabSelector.jsx');


const PageSelector = React.createClass({

  componentDidMount: function () {
    $(this.refs.pagesAccordion.getDOMNode()).accordion();
    if(this.props.page.isSelected) {
      $(this.refs.pagesAccordion.getDOMNode()).accordion('toggle', 0);
    }
  },



  render: function () {

    const tabs = this.props.page.tabs.map((tab, index) => <TabSelector tab={tab} key={index}/>);

    return (
      <div>
        <div ref='pagesAccordion' className='ui accordion item'>
          <div className='title'>
            <i className='dropdown icon' />
            {this.props.page.name}
          </div>
          <div className='content'>
            <div className='menu'>
              {tabs}
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = PageSelector;

