'use strict';

const lexResponses = require('./lexResponses');

const genderList = ['male', 'female', 'men', 'women', 'guy', 'girl']
const objectTypeList = ['tshirt', 'skirt', 'kurti', 'top', 'pant']
const neutralItems = ['laptop', 'cups', 'table', 'computer', 'chair']

function buildValidationResult(isValid, violatedSlot, messageContent) {
    if (messageContent == null) {
        return {
            isValid,
            violatedSlot,
        };
    }
    return {
        isValid,
        violatedSlot,
        message: { contentType: 'PlainText', content: messageContent },
    };
}

function validateOrder(objectType, gender){
  console.log('Inside validate function with the objects', " ", objectType, " ", gender)
  if (objectTypeList.indexOf(objectType) > -1
      &&  (gender == null || genderList.indexOf(gender) < 0) ) {
        console.log('Point1')
        return buildValidationResult(false, 'gender', `${objectType} is a gender specific option. Please specify the option`);
  }
  if (neutralItems.indexOf(objectType) > -1
      &&  (gender == null || genderList.indexOf(gender) < 0) ) {
        console.log('Point1.1')
        return buildValidationResult(true, null, null);
  }
  if ( objectTypeList.indexOf(objectType) < 0 && neutralItems.indexOf(objectType) < 0 ) {
     console.log('Point2')
     return buildValidationResult(false, 'object', `We do not have ${objectType} in the inventory.`);
  } else if (gender.length > 0 && genderList.indexOf(gender) < 0) {
    console.log('Point3')
    return buildValidationResult(false, 'gender', `${gender} is an invalid option.`);
  } else if (neutralItems.indexOf(objectType) > -1 && gender == null) {
    console.log('Point4')
    return buildValidationResult(true, null, null);
  } else {
    console.log('Point5')
    return buildValidationResult(true, null, null);
  }
}


module.exports = function(intentRequest, callback) {
  var objectType = intentRequest.currentIntent.slots.object;
  var gender = intentRequest.currentIntent.slots.gender;
  console.log('Inputs are: ' + objectType + ' ' + gender);

   const source = intentRequest.invocationSource;

    if (source === 'DialogCodeHook') { // I think it is to represent the input coming from bot
      console.log('It is a dialog code hook. Reached here ')
      const slots = intentRequest.currentIntent.slots;
      const validationResult = validateOrder(objectType, gender);
      console.log('Validation result', validationResult.isValid);
      console.log('Dumping slots:' + JSON.stringify(slots))
      if (!validationResult.isValid) {
        slots[`${validationResult.violatedSlot}`] = null;
        callback(lexResponses.elicitSlot(
            intentRequest.sessionAttributes, intentRequest.currentIntent.name,
            slots, validationResult.violatedSlot, validationResult.message));
        return;
      }

    } else {
      console.log('source was something else :', source)
    }
    callback(lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
    return;
}
