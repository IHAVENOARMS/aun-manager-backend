const mongoose = require('mongoose');
const Joi = require('joi');
const objectId = require('joi-objectid')(Joi);

const batchSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  number: { type: Number, required: true, min: 1, max: 3000 },
});

const Section = mongoose.model(
  'Section',
  mongoose.Schema({
    batch: { type: batchSchema, required: true },
    number: { type: Number, required: true, min: 1 },
    groupChat: { type: mongoose.Schema.Types.ObjectId, ref: 'Telegramgroup' },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Telegramgroup' },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  })
);

const validate = (section) => {
  const joiSchema = Joi.object({
    batchId: objectId().required(),
    number: Joi.number().required(true).min(1),
    groupChatId: objectId(),
    channelId: objectId(),
    leader: objectId(),
  });
  return joiSchema.validate(section);
};

module.exports = { Section, validate };
