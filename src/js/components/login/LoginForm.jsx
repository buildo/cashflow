/** @jsx React.DOM */

'use strict';

const React = require('react');
const C = require('../../constants/AppConstants').ActionTypes;

const CashflowPayments = React.createClass({

  componentDidMount: function() {
  },

  render: function () {
    const loginState = this.props.loginState;

    const alertLoginFailed = loginState === C.LOGIN_FAILED || true ?
      (
        <div className="login-alert ui info message error">
          <div class="ui hidden divider"></div>
          <div>wrong email or password</div>
        </div>
      )
      : '';

    return (
      <div className="login-form ui center aligned">
        <div className="ui corner labeled input">
          <input type="text" placeholder="e-mail"/>
          <div className="ui corner label">
            <i className="asterisk icon"></i>
          </div>
        </div>
        <br></br>
        <div className="ui corner labeled input error">
          <input type="password" placeholder="password"/>
          <div className="ui corner label">
            <i className="asterisk icon"></i>
          </div>
        </div>
        {alertLoginFailed}
      </div>
    );
  },

});


module.exports = CashflowPayments;
