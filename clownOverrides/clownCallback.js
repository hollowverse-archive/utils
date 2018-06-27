const { omit } = require('lodash');

module.exports = clownFs => {
  clownFs.editJson('package.json', json => omit(json, 'jest'));
};
