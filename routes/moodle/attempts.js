const express = require('express');
const MoodleUser = require('moodle-user');
const moodleExceptions = require('moodle-user/moodleExceptions');
const auth = require('../../middleware/auth');
const moodleAuth = require('../../middleware/moodleAuth');
const privilege = require('../../middleware/privilege');
const { refreshMoodleUser } = require('../../services/moodle/sessionService');

const router = express.Router();

router.get('/:id', [auth, moodleAuth], async (req, res) => {
  try {
    let attempt;
    try {
      attempt = await req.moodleUser.visitAttempt(
        req.params.id,
        req.query.cmid,
        req.query.page
      );
    } catch (exc) {
      if (exc instanceof moodleExceptions.SessionTimeOut) {
        await refreshMoodleUser(req.user._id);
        attempt = await req.moodleUser.visitAttempt(
          req.params.id,
          req.query.cmid,
          req.query.page
        );
      } else throw exc;
    }
    return res.send(attempt);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.put('/:id', [auth, moodleAuth, privilege(1000)], async (req, res) => {
  try {
    let attempt;
    try {
      attempt = await req.moodleUser.visitAttempt(
        req.params.id,
        req.query.cmid,
        req.query.page
      );
    } catch (exc) {
      if (exc instanceof moodleExceptions.SessionTimeOut) {
        await refreshMoodleUser(req.user._id);
        attempt = await req.moodleUser.visitAttempt(
          req.params.id,
          req.query.cmid,
          req.query.page
        );
      } else throw exc;
    }

    attempt = Object.assign(attempt, req.body);
    console.log(attempt.formData);
    const result = await req.moodleUser.uploadAttempt(attempt);
    return res.send(attempt);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

module.exports = router;
