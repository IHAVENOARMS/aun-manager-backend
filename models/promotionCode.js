const mongoose = require('mongoose');
const Joi = require('joi');
const objectId = require('joi-objectid')(Joi);

const PromotionCode = mongoose.model(
  'PromotionCode',
  mongoose.Schema({
    code: { type: String, required: true, minLength: 1 },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    timesToBeUsed: { type: Number, required: true },
    for: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  })
);

const validate = (role) => {
  const joiSchema = Joi.object({
    code: Joi.string().min(1).required(),
    roleId: objectId().required(),
    batchId: objectId(),
    timesToBeUsed: Joi.number().min(1).required(),
    for: objectId(),
  });
  return joiSchema.validate(role);
};

module.exports = { PromotionCode, validate };
