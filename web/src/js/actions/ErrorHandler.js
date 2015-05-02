'use strict';

const LoginActions = require('./LoginActions.js');

const handleError = (res) => {
  console.log('HTTP_ERROR');
  switch (res.status) {
    case 401:
      LoginActions.logOut(res);
      break;

    default:
      console.log(res.status);
      break;
  }
};

module.exports = {
  handleError: handleError
};
