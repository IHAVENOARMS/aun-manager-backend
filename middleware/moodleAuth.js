const { getMoodleUser } = require('../services/moodle/sessionService');

module.exports = async function (req, res, next) {
  try {
    const moodleUser = await getMoodleUser(req.user._id);
    req.moodleUser = moodleUser;
    return next();
  } catch (exc) {
    res.status(500).send(exc.message);
  }
};
