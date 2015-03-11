'use strict';

const HOST = 'http://localhost:9000';
const axios = require('axios');
const _ = require('lodash');

const BASE_URL = 'http://localhost:9000/';

const path = (paths) => {
  if (_.isArray(paths)) {
    if (!_.every(paths)) {
      throw new Error(`Invalid path elements [${paths}]. All elements must be defined`);
    }
    return BASE_URL.concat(paths.join('/'));
  } else {
    return BASE_URL.concat(paths);
  }
};

const getToken = () => ('"' + localStorage.getItem('cashflow_token') + '"');

const getConfig = (isJSON) => {
  const config = {
    headers: {
      'Authorization': 'Token token=' + getToken()
    }
  };
  if (isJSON) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
};

module.exports = {

  login: {

    login: (loginFormData) => axios.post(path('login'), loginFormData, getConfig(true))

  },

  cff: {

    getMain: () => axios.get(path(['cffs', 'main']), getConfig()),

    getBank: () => axios.get(path(['cffs', 'bank']), getConfig()),

    getManual: () => axios.get(path(['cffs', 'manual']), getConfig()),

    pullMain: () => axios.post(path(['cffs', 'main', 'pull']), {}, getConfig()),

    pullBank: () => axios.post(path(['cffs', 'bank', 'pull']), {}, getConfig()),

    saveManual: (cff) => axios.post(path(['cffs', 'manual']), cff, getConfig(true)),

  },

  progress: {

    getMain: () => axios.get(path(['cffs', 'main', 'pull', 'progress']), getConfig()),

    resetMain: () => axios.post(path(['cffs', 'main', 'pull', 'progress', 'clear']), {}, getConfig()),

  },

  matches: {

    getAll: () => axios.get(path('matches'), getConfig()),

    commit: () => axios.post(path(['matches', 'stage', 'commit']), {}, getConfig()),

    stageMatch: (match) => axios.put(path(['matches', 'stage', 'mainPaymentId', match.main.id, 'dataPaymentId', match.data.id]), {}, getConfig()),

    unstageMatch: (match) => axios.delete(path(['matches', 'stage', match.id]), getConfig()),

    deleteMatch: (match) => axios.delete(path(['matches', match.id]), getConfig()),

  },

  user: {

    getCurrentUser: () => axios.get(path(['users', 'me']), getConfig())

  }

};