/** @jsx React.DOM */

'use strict';

const React = require('react');
const Navigation = require('react-router').Navigation;
const AppConstants = require('../../constants/AppConstants');


const LoginForm = React.createClass({

  propTypes: {
    loginState: React.PropTypes.string,
    onSubmit: React.PropTypes.func.isRequired
  },

  mixins: [Navigation],

  componentDidMount: function () {
    const loginForm =  $('#login-form');

    const validationRules = {
      email: {
        identifier : 'email',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter an email'
          },
          {
            type   : 'email',
            prompt : 'Please enter a valid email'
          }
        ]
      },
      password: {
        identifier : 'password',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a password'
          }
        ]
      }
    };

    loginForm.form(validationRules,
      {
        inline: true,
        onSuccess: this.submitLoginForm,
        on: 'submit'
      }
    );
  },

  submitLoginForm: function() {
    const loginForm =  $('#login-form');
    const loginFormData = {
      email: loginForm.form('get field', 'email').val(),
      password: loginForm.form('get field', 'password').val()
    };
    this.props.onSubmit(loginFormData);
  },

  render: function () {
    let alertLoginFailed = '';
    let formClassName = 'ui form segment';

    switch (this.props.loginState){

      case AppConstants.LOGIN:
        formClassName += ' loading';
        break;

      case AppConstants.LOGIN_FAIL:
        alertLoginFailed = (
          <div className="login-alert ui info message error">
            <div>wrong email or password</div>
          </div>
        );
        break;
    }

    return (
      <div className="ui center aligned" id="login-form">
        <div className="ui middle aligned relaxed fitted raised grid">
          <div className="column">
            <form className={formClassName}>
              <div className="field">
                <label>Email</label>
                <div className="ui left icon input">
                  <input type="email" placeholder="email" name="email"/>
                  <i className="user icon"></i>
                </div>
              </div>
              <div className="field">
                <label>Password</label>
                <div className="ui left icon input">
                  <input type="password" placeholder="password" name="password"/>
                  <i className="lock icon"></i>
                </div>
              </div>
              <div className="ui blue submit button">Login</div>
            </form>
            {alertLoginFailed}
          </div>
        </div>
      </div>
    );
  },

});


module.exports = LoginForm;
