const express = require('express');
const { Schedule, validate } = require('../models/schedule');
const auth = require('../middleware/auth');
const privilege = require('../middleware/privilege');
const { Batch } = require('../models/batch');
const student = require('../middleware/student');
const { User } = require('../models/user');
const router = express.Router();

router.get('/me', [auth, student], async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .send('Trying to get schedule for a user that no longer exists...');
    const batch = await Batch.findById(user.batch._id).populate('schedule');
    const schedule = batch.schedule;
    if (!schedule)
      return res.status(404).send('Your batch does not have a schedule');
    return res.send(schedule);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.get('/', [auth, privilege(1000)], async (req, res) => {
  try {
    return res.send(await Schedule.find());
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.get('/:id', [auth, privilege(1000)], async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule)
      return res
        .status(404)
        .send('Schedule with the given ID does not exist...');
    res.send(schedule);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.post('/', [auth, privilege(1000)], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const schedule = new Schedule({
      name: req.body.name,
      weekQuizzes: req.body.weekQuizzes,
    });
    await schedule.save();
    res.send(schedule);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.delete('/:id', [auth, privilege(1000)], async (req, res) => {
  const schedule = await Schedule.findByIdAndDelete(req.params.id);
  if (!schedule)
    return res.status(404).send('Schedule with the given ID was not found...');
  res.send(schedule);
});

// router.put('/:id', async (req, res) => {
//   try {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     const batch = await Batch.findById(req.body.batchId);
//     if (!batch)
//       return res.status(400).send('Batch with the given ID does not exist...');

//     if (batch.schedule)
//       return res
//         .status(400)
//         .send('Batch already has a schedule attached to it...');

//     const schedule = new Schedule({
//       name: req.body.name,
//       batch: {
//         _id: batch._id,
//         number: batch.number,
//       },
//       weekQuizzes: req.body.weekQuizzes,
//     });
//     await schedule.save();
//   } catch (exc) {
//     return res.status(500).send(exc.message);
//   }
// });

module.exports = router;
