const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
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
});

function validate(req) {
  const joiSchema = Joi.object({
    username: Joi.string().min(5).max(40).required(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return joiSchema.validate(req);
}

module.exports = router;
