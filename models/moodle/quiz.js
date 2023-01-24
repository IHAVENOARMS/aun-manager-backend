const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  //   _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  moodleId: { type: String, required: true, minLength: 1, maxLength: 1000 },
  name: { type: String, required: true, minLength: 1, maxLength: 10000 },
});

const MoodleQuiz = mongoose.model(
  'MoodleQuiz',
  mongoose.Schema({
    moodleId: { type: String, required: true, minLength: 1, maxLength: 1000 },
    name: { type: String, required: true, minLength: 1, maxLength: 10000 },
    course: courseSchema,
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'MoodleQuestion',
    },
  })
);

module.exports = MoodleQuiz;
