const express = require('express');
const moodleExceptions = require('moodle-user/moodleExceptions');
const auth = require('../../middleware/auth');
const moodleAuth = require('../../middleware/moodleAuth');
const privilege = require('../../middleware/privilege');
const {
  getMoodleUser,
  getMoodleUsers,
  refreshMoodleUser,
} = require('../../services/moodle/sessionService');

const router = express.Router();

router.get('/', [auth, moodleAuth], async (req, res) => {
  try {
    let homepage;
    try {
      homepage = await req.moodleUser.visitHomePage();
    } catch (exc) {
      if (exc instanceof moodleExceptions.SessionTimeOut) {
        await refreshMoodleUser(req.user._id);
        homepage = await req.moodleUser.visitHomePage();
      }
    }
    return res.send(homepage);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

module.exports = router;
