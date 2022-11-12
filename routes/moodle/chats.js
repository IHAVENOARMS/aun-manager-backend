const express = require('express');
const moodleExceptions = require('moodle-user/moodleExceptions');
const auth = require('../../middleware/auth');
const moodleAuth = require('../../middleware/moodleAuth');
const privilege = require('../../middleware/privilege');
const { refreshMoodleUser } = require('../../services/moodle/sessionService');

const router = express.Router();

router.get('/:id', [auth, moodleAuth, privilege(1000)], async (req, res) => {
  try {
    let chat;
    try {
      chat = await req.moodleUser.visitChatWithId(req.params.id);
    } catch (exc) {
      if (exc instanceof moodleExceptions.SessionTimeOut) {
        await refreshMoodleUser(req.user._id);
        chat = await req.moodleUser.visitChatWithId(req.params.id);
      } else throw exc;
    }
    return res.send(chat);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

module.exports = router;
