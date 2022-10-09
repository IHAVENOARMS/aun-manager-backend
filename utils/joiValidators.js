const Joi = require('joi');
const { countries } = require('countries-list');
const { allArabic, allEnglish } = require('./regularExpressions');

const arabicName = (
  messageOnIncomplete = 'Arabic name is incomplete.',
  messageOnSpecialCharacters = 'Arabic name contains special characters or numbers.'
) => {
  return Joi.string().custom((value, helper) => {
    const separatedName = value.split(' ');
    if (separatedName.length !== 4) {
      return helper.message(messageOnIncomplete);
    } else {
      if (separatedName.at(-1).length === 0)
        return helper.message(messageOnIncomplete);
      for (let i = 0; i < separatedName.length; i++) {
        if (!allArabic.exec(separatedName[i]))
          return helper.message(messageOnSpecialCharacters);
      }
    }
  });
};
const englishName = (
  messageOnIncomplete = 'English name is incomplete.',
  messageOnSpecialCharacters = 'English name contains special characters or numbers.'
) => {
  return Joi.string().custom((value, helper) => {
    const separatedName = value.split(' ');
    if (separatedName.length !== 4) {
      return helper.message(messageOnIncomplete);
    } else {
      if (separatedName.at(-1).length === 0)
        return helper.message(messageOnIncomplete);
      for (let i = 0; i < separatedName.length; i++) {
        if (!allEnglish.exec(separatedName[i]))
          return helper.message(messageOnSpecialCharacters);
      }
    }
  });
};

const countryCode = (message = 'Invalid country code provided.') => {
  return Joi.string().custom((value, helper) => {
    const countryList = Object.keys(countries).map((c) => c.toLowerCase());
    if (!(value in countryList)) return helper.message(message);
  });
};

const gender = (message = 'Invalid gender provided.') => {
  return Joi.string().custom((value, helper) => {
    const genderList = ['m', 'f'];
    if (!value in genderList) return helper.message(message);
  });
};

module.exports = { arabicName, englishName, countryCode, gender };
