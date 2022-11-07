const passwordGenerator = require('generate-password');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const { sendMessageToUser } = require('../services/JOSEPH/joseph');
const {
  yourOtp,
  someoneLoggedIntoYourAccount,
} = require('../services/JOSEPH/templates');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send('Invalid username or password.');

  const token = await user.generateAuthToken();
  res.send(token);
  sendMessageToUser(user, someoneLoggedIntoYourAccount(user));
});

router.get('/otp', async (req, res) => {
  if (!req.body.username) return res.status(400).send('No Username provided..');
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username.');
  if (!user.otp) {
    user.otp = generateOtp();
    await user.save();
  }
  sendMessageToUser(user, yourOtp(user.otp));
  return res.send({ succeeded: true });
});

router.post('/otp', async (req, res) => {
  const { error } = validateOtpRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username.');
  if (user.otp !== req.body.otp) return res.status(400).send('Invalid OTP.');

  const token = await user.generateAuthToken();
  res.send(token);
  sendMessageToUser(user, someoneLoggedIntoYourAccount(user));

  user.otp = generateOtp();
  await user.save();
});

function validate(req) {
  const joiSchema = Joi.object({
    username: Joi.string().min(5).max(40).required(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return joiSchema.validate(req);
}

function validateOtpRequest(req) {
  const joiSchema = Joi.object({
    username: Joi.string().min(5).max(40).required(),
    otp: Joi.string().min(6).max(6).required(),
  });
  return joiSchema.validate(req);
}

function generateOtp() {
  return passwordGenerator.generate({
    length: 6,
    numbers: true,
    lowercase: false,
    uppercase: false,
  });
}

module.exports = router;
