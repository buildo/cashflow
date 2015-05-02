/**
 * @jsx React.DOM
 */

'use strict';

const React = require('react'),
  _ = require('lodash');

const Modal = React.createClass({

  propTypes : {
    show : React.PropTypes.bool,
    header: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    cancelable: React.PropTypes.bool,
    actions: React.PropTypes.arrayOf(React.PropTypes.shape({
      className : React.PropTypes.string,
      text: React.PropTypes.string.isRequired,
      dismiss: React.PropTypes.bool
    }))
  },

  getDefaultProps() {
    return {
      show: false,
      cancelable: true
    };
  },

  componentDidMount() {
    this.modal =  $(this.refs.modal.getDOMNode()).modal({
      detachable: false // required for compliance with React virtual DOM
    });
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.show !== this.props.show) {
      if (nextProps.show) {
        this.modal.modal('show');
      } else {
        this.modal.modal('hide');
      }
    }
  },

  onActionClick(e) {
    const actionIndex = parseInt(e.target.dataset.index);
    this.props.onActionClick(actionIndex, this.props.actions[actionIndex], e);
  },


  getContentBox() {
    if (this.props.description) {
      return (
        <div className='content'>
          <div className='description'>
            {this.props.description}
          </div>
        </div>
      );
    }
  },

  getActions() {
    if (this.props.actions) {
      return this.props.actions.map((action, i) => {
        const actionClasses = React.addons.classSet({
          fluid : true,
          ui: true,
          button: true
        });

        return (
          <div
            key={_.uniqueId('action_')}
            className={action.className || actionClasses}
            data-index={i}
            onClick={this.onActionClick}>
            {action.text}
          </div>
        );
      });
    }
  },

  render() {
    const modalClasses = React.addons.classSet({
      ui: true,
      modal: true,
      // hidden : this.props.hidden || false
    });

    return (
      <div ref='modal' className={modalClasses}>
        <div className='header'>
          {this.props.header}
        </div>
        {this.getContentBox()}
        <div className='actions'>
          {this.getActions()}
        </div>
      </div>
    );
  }
});

module.exports = Modal;
