const mongoose = require('mongoose');
const Joi = require('joi');

const Role = mongoose.model(
  'Role',
  mongoose.Schema({
    name: { type: String, required: true, minLength: 1, maxLength: 1000 },
    privilege: { type: Number, required: true, min: 0, max: 1000 },
  })
);

const validate = (role) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(1).max(1000).required(),
    privilege: Joi.number().min(0).max(1000).required(),
  });
  return joiSchema.validate(role);
};

module.exports = { Role, validate };
