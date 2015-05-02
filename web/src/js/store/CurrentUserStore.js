'use strict';

const alt = require('../alt');
const UserActions = require('../actions/UserActions');

class CurrentUserStore {
  constructor() {
    this.bindAction(UserActions);
  }

  onGetCurrentUser() {
    this.currentUser = undefined;
  }

  onGetCurrentUserSuccess(data) {
    this.currentUser = data;
  }

}

module.exports = alt.createStore(CurrentUserStore, 'CurrentUserStore');
