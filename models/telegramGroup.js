const mongoose = require('mongoose');
const Joi = require('joi');

const TelegramGroup = mongoose.model(
  'Telegramgroup',
  mongoose.Schema({
    name: { type: String, required: true, maxLength: 144 },
    id: { type: String, required: true, maxLength: 1024 },
    type: {
      type: String,
      required: true,
      enum: ['channel', 'group', 'private'],
    },
    for: {
      type: String,
      required: true,
      match: /section|batch|leaders [0-9]*/i,
    },
    inviteLink: { type: String },
    members: { type: [{ type: String }], required: true },
  })
);

module.exports = { TelegramGroup };
