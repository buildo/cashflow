/** @jsx React.DOM */

'use strict';

const React = require('react');
const Navigation = require('react-router').Navigation;
const C = require('../../constants/AppConstants').ActionTypes;
const ServerActions = require('../../actions/ServerActions.js');


const LoginForm = React.createClass({

  mixins: [Navigation],

  submitLoginForm: function () {
    const loginForm =  $('#login-form');

    const submitForm = () => {
      const loginFormData = {
        email: loginForm.form('get field', 'email').val(),
        password: loginForm.form('get field', 'password').val()
      };
      ServerActions.login(loginFormData);
    };

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
        onSuccess: submitForm,
        on: 'blur'
      }
    );
  },

  render: function () {
    let alertLoginFailed = '';
    let isLoading = false;
    switch (this.props.loginState){

      case C.LOGIN_STARTED:
        isLoading = true;
        break;

      case C.LOGIN_FAILED:
        alertLoginFailed = (
          <div className="login-alert ui info message error">
            <div>wrong email or password</div>
          </div>
        );
        break;

      case C.LOGIN_DONE:
        this.transitionTo('app');
        return <div/>;

      default:
        break;
    }

    const formClassName = 'ui form segment' + (isLoading ? ' loading' : '');

    return (
      <div className="ui center aligned" id="login-form">
        <div className="ui middle aligned relaxed fitted raised grid">
          <div className="column">
            <form className={formClassName} onSubmit={this.submitLoginForm}>
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
                  <input type="password" name="password"/>
                  <i className="lock icon"></i>
                </div>
              </div>
              <div className="ui blue submit button" onClick={this.submitLoginForm}>Login</div>
            </form>
            {alertLoginFailed}
          </div>
        </div>
      </div>
    );
  },

});


module.exports = LoginForm;
