const mongoose = require('mongoose');
const { countries } = require('countries-list');
const Joi = require('joi');
const objectId = require('joi-objectid')(Joi);
const {
  arabicName,
  englishName,
  countryCode,
  gender,
} = require('../utils/joiValidators');
const bcrypt = require('bcrypt');

const countryCodeList = Object.keys(countries).map((c) =>
  c.toLocaleLowerCase()
);

const phoneNumberSchema = mongoose.Schema(
  {
    number: { type: String, required: true, minLength: 1 },
    hasWhatsapp: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const batchSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true,
  },
  number: { type: Number, min: 1, max: 3000, required: true },
  year: { type: Number, min: 1, max: 3000, required: true },
});

const moodleInfoSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MoodleInfo',
    required: true,
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model(
  'User',
  mongoose.Schema({
    username: { type: String, required: true, minLength: 8, maxLength: 40 },
    password: { type: String, required: true, minLength: 5, maxLength: 1024 },
    arabicName: { type: String, required: true, minLength: 8, maxLength: 40 },
    englishName: { type: String, required: true, minLength: 8, maxLength: 40 },
    gender: { type: String, required: true, enum: ['m', 'f'] },
    preferredLanguage: {
      type: String,
      required: true,
      default: 'ar',
      enum: ['ar', 'en'],
    },
    phoneNumbers: {
      type: [{ type: phoneNumberSchema }],
      validate: {
        validator: function (v) {
          return v && v.length >= 1 && v.length <= 10;
        },
        message: 'You must provide at least a single phone number.',
      },
      required: true,
    },
    country: { type: String, required: true, enum: countryCodeList },
    telegramId: { type: String, minLength: 1, maxLength: 144 },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    batch: {
      type: batchSchema,
    },
    moodleInfo: { type: moodleInfoSchema },
    promotedWith: { type: String, minLength: 1 },
    josephPassword: {
      type: String,
      minLength: 1,
      maxLength: 1024,
      required: true,
    },
    josephChatId: {
      type: String,
    },
  })
);

const validate = (user) => {
  const phoneNumberSchema = Joi.object({
    number: Joi.string().min(1).required(),
    hasWhatsapp: Joi.bool().required().default(false),
  });

  const joiSchema = Joi.object({
    username: Joi.string().min(8).max(40).required(),
    password: Joi.string().min(5).max(1024).required(),
    arabicName: arabicName().required(),
    englishName: englishName().required(),
    gender: gender().required(),
    country: countryCode().required(),
    preferredLanguage: Joi.string().required().valid('ar', 'en').default('ar'),
    telegramId: Joi.string().min(1).max(144),
    phoneNumbers: Joi.array().items(phoneNumberSchema).required(),
    roleId: objectId(),
    promotionCodeId: objectId(),
    batchId: objectId(),
    moodleInfoId: objectId(),
  });

  return joiSchema.validate(user);
};

module.exports = { User, validate };
