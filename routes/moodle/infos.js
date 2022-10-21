const { MoodleInfo, validate } = require('../../models/moodle/info');
const express = require('express');
const MoodleUser = require('moodle-user');
const auth = require('../../middleware/auth');
const privilege = require('../../middleware/privilege');
const router = express.Router();

router.get('/check', async (req, res) => {
  try {
    const info = await MoodleInfo.findOne({
      username: req.query.username,
      password: req.query.password,
    }).select('-__v -password');

    if (!info)
      return res
        .status(404)
        .send('Moodle info with the given credentials was not found..');
    res.send(info);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.get('/', [auth, privilege(1000)], async (req, res) => {
  try {
    return res.send(await MoodleInfo.find().select('-__v').select('-password'));
  } catch (exc) {
    return res.status(404).send(exc.message);
  }
});

router.get('/:id', [auth, privilege(1000)], async (req, res) => {
  try {
    const info = await MoodleInfo.findById(req.params.id)
      .select('-__v')
      .select('-password');
    if (info) {
      return res.send(info);
    } else {
      return res.status(404).send('MoodleInfo with the given ID was not found');
    }
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const infoInDb = await MoodleInfo.findOne({ username: req.body.username });
    if (infoInDb)
      return res.status(400).send('Moodle info for this user already stored.');

    const studentInfo = await authenticate(req.body);
    const newMoodleInfo = new MoodleInfo({
      username: req.body.username,
      password: req.body.password,
      name: studentInfo.name,
      year: studentInfo.year,
    });
    await newMoodleInfo.save();
    return res.send(newMoodleInfo);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    await authenticate(req.body);
    const infoInDb = await MoodleInfo.findOne({ username: req.body.username });

    if (infoInDb && !infoInDb._id.equals(req.params.id))
      return res.status(400).send('Moodle info for this user already stored.');
    const info = await MoodleInfo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!info)
      return res.status(404).send('MoodleInfo with the given ID was not found');

    return res.send(info);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.delete('/:id', [auth, privilege(1000)], async (req, res) => {
  try {
    const info = await MoodleInfo.findByIdAndDelete(req.params.id);
    if (!info)
      return res
        .status(404)
        .send('MoodleInfo with the given ID was not found.');
    return res.send(info);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

async function authenticate(moodleInfo) {
  const user = new MoodleUser(moodleInfo.username, moodleInfo.password);
  await user.login();
  return { name: user.studentName, year: user.studentYear };
}

module.exports = router;
