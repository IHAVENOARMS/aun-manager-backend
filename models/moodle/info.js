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
      minLength: 1,
      maxLength: 1024,
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
      min: 1,
      max: 255,
    },
    year: {
      type: Number,
      min: 1,
      max: 3000,
    },
  })
);

const validate = (moodleInfo) => {
  const joiSchema = Joi.object({
    username: Joi.string().required().min(1).max(1024),
    password: Joi.string().min(1).max(1024).required(),
  });
  return joiSchema.validate(moodleInfo);
};

module.exports = { MoodleInfo, validate };
