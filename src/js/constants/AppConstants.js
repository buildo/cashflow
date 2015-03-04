'use strict';

const keyMirror = require('react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    CLICK_PAGE_SELECTOR: null,
    CLICK_TAB_SELECTOR: null,
    CASHFLOW_POINT_SELECTED: null,
    CASHFLOW_UPDATED: null,
    MAIN_CFF_UPDATED: null,
    BANK_CFF_UPDATED: null,
    MANUAL_CFF_SAVED: null,
    SAVING_MANUAL_CFF: null,
    MANUAL_CFF_UPDATED: null,
    GETTING_MANUAL_CFF: null,
    MATCH_TODO_SELECTED: null,
    SAVED_MATCH_OPTIMISTIC: null,
    SAVED_MATCH_UNDO: null,
    SAVED_MATCH: null,
    DELETING_STAGED_MATCH: null,
    STAGED_MATCH_DELETED: null,
    PAYMENT_TODO_SELECTED: null,
    INVERT_MATCHES_POV: null,
    MATCHES_UPDATED: null,
    CURRENT_USER_UPDATED: null,
    GETTING_MATCHES: null,
    GETTING_MAIN_CFF: null,
    GETTING_BANK_CFF: null,
    GETTING_CURRENT_USER: null,
    PULLING_MAIN_CFF: null,
    PULLING_BANK_CFF: null,
    MAIN_CFF_PULLED: null,
    BANK_CFF_PULLED: null,
    GET_MAIN_PULL_PROGRESS: null,
    COMMITTING_STAGED_MATCHES: null,
    STAGED_MATCHES_COMMITTED: null,
    LOGIN_START: null,
    LOGIN_FAIL: null,
    LOGGED_IN: null,
    LOGGED_OUT: null,
    RESET_LOGIN_STATE: null,
    CHECKING_TOKEN_STATE: null,
    TOKEN_IS_VALID: null,
    TOKEN_IS_INVALID: null,
    ROUTE_CHANGED: null,
    ADD_MANUAL_LINE: null,
  }),

  PayloadSources: keyMirror({
    VIEW_ACTION: null
  })

};