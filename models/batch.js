const mongoose = require('mongoose');
const Joi = require('joi');

const Batch = mongoose.model(
  'batch',
  mongoose.Schema({
    number: {
      type: Number,
      required: true,
      min: 1,
      max: 3000,
      unique: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 3000,
      unique: true,
    },
    name: { type: String, minLength: 1, maxLength: 100 },
    channelId: { type: String, min: 5, max: 20, unique: true },
    channelInviteLink: { type: String, min: 5, max: 20, unique: true },
    groupChatId: { type: String, min: 5, max: 20, unique: true },
  })
);

const validate = (batch) => {
  const joiSchema = Joi.object({
    number: Joi.number().min(1).max(3000).required(),
    year: Joi.number().min(1).max(3000).required(),
    name: Joi.string().min(1).max(100),
    channelId: Joi.string().min(5).max(20),
    groupChatId: Joi.string().min(5).max(20),
  });
  return joiSchema.validate(batch);
};

module.exports = { Batch, validate };
