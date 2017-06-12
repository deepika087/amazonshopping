'use strict';

const placeorder = require('./placeorder');

module.exports = function(intentRequest, callback) {
  console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
  const intentName = intentRequest.currentIntent.name;

  if (intentName === 'placeorder') {
    console.log(intentName + ' was called');
    return placeorder(intentRequest, callback);
  }

  throw new Error(`Intent with name ${intentName} not supported`);
}
