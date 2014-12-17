'use strict';

const _ = require('lodash');

module.exports = {
  componentDidMount() {
    let self = this;
    (this._changeListeners || []).forEach(cl => {
      let store = _.isArray(cl) ? cl[0] : cl;
      store.addChangeListener(cl[1] || self._onChange);
    });
  },

  componentWillUnmount() {
    let self = this;
    (this._changeListeners || []).forEach(cl => {
      let store = _.isArray(cl) ? cl[0] : cl;
      store.removeChangeListener(cl[1] || self._onChange);
    });
  }
};