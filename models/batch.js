const mongoose = require('mongoose');
const Joi = require('joi');
const objectId = require('joi-objectid')(Joi);

const sectionSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  number: {
    type: Number,
    required: true,
  },
});

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
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Telegramgroup' },
    groupChat: { type: mongoose.Schema.Types.ObjectId, ref: 'Telegramgroup' },
    leadersChat: { type: mongoose.Schema.Types.ObjectId, ref: 'Telegramgroup' },
    sections: {
      type: [{ type: sectionSchema }],
    },
    leaders: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      required: true,
    },
  })
);

const validate = (batch) => {
  const joiSchema = Joi.object({
    number: Joi.number().min(1).max(3000).required(),
    year: Joi.number().min(1).max(3000).required(),
    name: Joi.string().min(1).max(100),
    channelId: objectId(),
    groupChatId: objectId(),
    leaders: Joi.array().items(objectId()),
  });
  return joiSchema.validate(batch);
};

module.exports = { Batch, validate };
