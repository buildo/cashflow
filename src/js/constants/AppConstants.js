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
    MATCHES_TODO_UPDATED: null,
    MATCH_TODO_SELECTED: null,
    SAVE_MATCH_TO_STAGE_OPTIMISTIC: null,
    SAVE_MATCH_TO_STAGE_UNDO: null,
    SAVE_MATCH_TO_STAGE: null,
    PAYMENT_TODO_SELECTED: null,
    MATCHES_DONE_UPDATED: null,
    STAGED_LINES_UPDATED: null,
    CURRENT_USER_UPDATED: null,
    GETTING_MATCHES_TODO: null,
    GETTING_MATCHES_DONE: null,
    GETTING_STAGED_LINES: null,
    GETTING_MAIN_CFF: null,
    GETTING_BANK_CFF: null,
    GETTING_CURRENT_USER: null,
    LOGIN_START: null,
    LOGIN_FAIL: null,
    LOGGED_IN: null,
    LOGGED_OUT: null,
    RESET_LOGIN_STATE: null,
    CHECKING_TOKEN_STATE: null,
    TOKEN_IS_VALID: null,
    TOKEN_IS_INVALID: null,
    ROUTE_CHANGED: null,
  }),

  PayloadSources: keyMirror({
    VIEW_ACTION: null
  })

};