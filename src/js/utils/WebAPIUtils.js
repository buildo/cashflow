'use strict';

const HOST = 'http://francesco-air.local:9000';
const getToken = () => ('"' + localStorage.getItem('cashflow_token') + '"');

module.exports = {

  login: (loginFormData) => $.ajax({
    url: HOST + '/login',
    type: 'POST',
    data: JSON.stringify(loginFormData),
    headers: {'Content-Type': 'application/json'},
  }),

  getMainCFF: () => $.ajax({
    url: HOST + '/cffs/main',
    type: 'GET',
    headers: {'Authorization': 'Token token=' + getToken()}
  }),

  getBankCFF: () => $.ajax({
    url: HOST + '/cffs/bank',
    type: 'GET',
    headers: {'Authorization': 'Token token=' + getToken()}
  }),

  getMatches: () => $.ajax({
    url: HOST + '/matches',
    type: 'GET',
    headers: {'Authorization': 'Token token=' + getToken()}
  }),

  getCurrentUser: () => $.ajax({
    url: HOST + '/users/me',
    type: 'GET',
    headers: {'Authorization': 'Token token=' + getToken()}
  }),

  saveMatch: (match) => $.ajax({
    url: HOST + '/matches/stage/mainPaymentId/' + match.main.id + '/dataPaymentId/'  + match.data.id,
    type: 'PUT',
    headers: {'Authorization': 'Token token=' + getToken()}
  }),

  deleteStagedMatch: (match) => $.ajax({
    url: HOST + '/matches/stage/' + match.id,
    type: 'DELETE',
    headers: {'Authorization': 'Token token=' + getToken()}
  }),

};