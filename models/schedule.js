const mongoose = require('mongoose');
const Joi = require('joi');
const objectId = require('joi-objectid')(Joi);

const Schedule = mongoose.model(
  'Schedule',
  mongoose.Schema({
    name: { type: String, minLength: 1, maxLength: 255, required: true },
    batch: {
      type: mongoose.Schema({
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        number: { type: Number, required: true },
      }),
      required: true,
    },
    weekQuizzes: {
      type: [String],
    },
  })
);

const validate = (schedule) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(1).max(255),
    batchId: objectId().required(),
    weekQuizzes: Joi.array().items(Joi.string()),
  });

  return joiSchema.validate(schedule);
};

module.exports = { Schedule, validate };
