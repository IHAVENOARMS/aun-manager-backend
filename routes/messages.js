const express = require('express');
const Joi = require('joi');
const objectId = require('joi-objectid')(Joi);
const auth = require('../middleware/auth');
const privilege = require('../middleware/privilege');
const { User } = require('../models/user');
const {
  sendMessageToUserWithId,
  log,
  sendMessageToBatchWithId,
  sendMessageToSectionWithId,
} = require('../services/JOSEPH/joseph');
const { sentFrom } = require('../services/JOSEPH/templates');
const router = express.Router();

router.post('/to/users', [auth, privilege(10)], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    req.body.to.forEach(async (user) => {
      await sendMessageToUserWithId(
        user,
        req.body.message + `\n\n${req.body.anonymous ? '' : sentFrom(req.user)}`
      );
    });
    return res.send({ succeeded: true });
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.post('/to/batches', [auth, privilege(10)], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    req.body.to.forEach(async (batchId) => {
      await sendMessageToBatchWithId(
        batchId,
        req.body.message + `\n\n${req.body.anonymous ? '' : sentFrom(req.user)}`
      );
    });
    return res.send({ succeeded: true });
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.post('/to/sections', [auth, privilege(10)], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    req.body.to.forEach(async (sectionId) => {
      await sendMessageToSectionWithId(
        sectionId,
        req.body.message + `\n\n${req.body.anonymous ? '' : sentFrom(req.user)}`
      );
    });
    return res.send({ succeeded: true });
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

function validate(message) {
  const joiSchema = Joi.object({
    to: Joi.array().items(objectId()).min(1).required(),
    message: Joi.string().max(10000).required(),
    anonymous: Joi.bool().default(false),
  });
  return joiSchema.validate(message);
}

module.exports = router;