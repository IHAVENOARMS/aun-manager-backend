const express = require('express');
const Joi = require('joi');
const auth = require('../../middleware/auth');
const moodleAuth = require('../../middleware/moodleAuth');
const privilege = require('../../middleware/privilege');
const { Batch } = require('../../models/batch');
const { User } = require('../../models/user');
const { sendMessageToUserWithId } = require('../../services/JOSEPH/joseph');
const { batchDoesNotHaveSchedule } = require('../../services/JOSEPH/templates');
const {
  checkQuizzesForStudentsWithId,
  checkQuizzesForStudentWithId,
} = require('../../services/moodle/moodleService');
const moodleExceptions = require('moodle-user/moodleExceptions');
const { refreshMoodleUser } = require('../../services/moodle/sessionService');

const router = express.Router();
const objectId = require('joi-objectid')(Joi);

router.get('/:id', [auth, moodleAuth], async (req, res) => {
  try {
    let quiz;
    try {
      quiz = await req.moodleUser.visitQuizWithId(req.params.id);
    } catch (exc) {
      if (exc instanceof moodleExceptions.SessionTimeOut) {
        await refreshMoodleUser(req.user._id);
        quiz = await req.moodleUser.visitQuizWithId(req.params.id);
      }
    }
    return res.send(quiz);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.post('/check', [auth, privilege(1000)], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  await checkQuizzesForStudentsWithId(req.body.for, req.body.quizzes);
  res.send('Success!');
});

router.post('/check-week', [auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.batch)
    return res
      .status(400)
      .send('Trying to check week quizzes for a user that is not a student..');
  const batch = await Batch.findById(user.batch._id).populate('schedule');
  if (!batch.schedule) {
    sendMessageToUserWithId(user._id, batchDoesNotHaveSchedule(user));
    return res.status(400).send('Batch does not have a schedule...');
  }

  await checkQuizzesForStudentWithId(req.user._id, batch.schedule.weekQuizzes);
  res.send('Success!');
});

// router.post('/check-week-for', [auth, privilege(1000)], async (req, res) => {
//   try {
//     const { error } = validateQuizCheck(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const batch = await Batch.findById(req.body.batch).populate('schedule');
//     if (!batch)
//       return res
//         .status(400)
//         .send(
//           'Trying to check week quizzes for a batch that does not exist...'
//         );

//     await checkWeekQuizzesForBatch(batch);
//     res.send('Success!');
//   } catch (exc) {
//     joseph.log(exc.message);
//     return res.status(500).send(exc.message);
//   }
// });

function validate(request) {
  const joiSchema = Joi.object({
    for: Joi.array().items(objectId()).required().min(1),
    quizzes: Joi.array().items(Joi.number()),
  });

  return joiSchema.validate(request);
}

function validateQuizCheck(request) {
  const joiSchema = Joi.object({
    batch: objectId(),
  });
  return joiSchema.validate(request);
}

module.exports = router;
