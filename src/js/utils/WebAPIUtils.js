'use strict';

const HOST = 'http://localhost:9000';
const TOKEN = '"sR2m9QewdRbX2gvi"';

const getMainCFF = () => {
  $.ajax({
    url: HOST + '/cffs/main',
    type: 'GET',
    headers: {'Authorization': 'Token token=' + TOKEN},
    succes: console.log
  });
};

module.exports = {
  getMainCFF: getMainCFF,
};