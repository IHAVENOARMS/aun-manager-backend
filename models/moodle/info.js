const mongoose = require('mongoose');
const Joi = require('joi');
const { moodleUsername } = require('../../utils/regularExpressions');
const { arabicName } = require('../../utils/joiValidators');
const objectId = require('joi-objectid')(Joi);

const MoodleInfo = mongoose.model(
  'MoodleInfo',
  mongoose.Schema({
    username: {
      type: String,
      required: true,
      match: [moodleUsername, 'Moodle username is in an invalid format.'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 1024,
    },
    name: {
      type: String,
      required: true,
      min: 1,
      max: 255,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 3000,
    },
  })
);

const validate = (moodleInfo) => {
  const joiSchema = Joi.object({
    username: Joi.string().pattern(moodleUsername).required(),
    password: Joi.string().min(1).max(1024).required(),
    name: arabicName().required(),
    year: Joi.number().min(1).max(3000).required(),
  });
  return joiSchema.validate(moodleInfo);
};

module.exports = { MoodleInfo, validate };
