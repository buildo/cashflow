'use strict';

module.exports = {
  hello: () => {
    ['hello', 'world'].forEach(s => {
      console.log(s);
    });
  }
};