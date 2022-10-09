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

const countryCodeList = Object.keys(countries).map((c) =>
  c.toLocaleLowerCase()
);

const batchSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true,
  },
  number: { type: Number, min: 1, max: 3000, required: true },
});

const roleSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  name: { type: String, required: true },
});

const User = mongoose.model(
  'user',
  mongoose.Schema({
    arabicName: { type: String, required: true, minLength: 8, maxLength: 40 },
    englishName: { type: String, required: true, minLength: 8, maxLength: 40 },
    gender: { type: String, required: true, enum: ['m', 'f'] },
    country: { type: String, required: true, enum: countryCodeList },
    role: { type: roleSchema, required: true },
    batch: {
      type: batchSchema,
      required: true,
    },
  })
);

const validate = () => {
  const joiSchema = Joi.object({
    arabicName: arabicName().min(8).max(40).required(),
    englishName: englishName().min(8).max(40).required(),
    gender: gender().required(),
    country: countryCode().required(),
    batchId: objectId(),
  });
};
