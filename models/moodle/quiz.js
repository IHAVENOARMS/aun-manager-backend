const mongoose = require('mongoose');

const MoodleQuiz = mongoose.model(
  'MoodleQuiz',
  mongoose.Schema({
    moodleId: { type: String, required: true, minLength: 1, maxLength: 1000 },
    name: { type: String, required: true, minLength: 1, maxLength: 10000 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'MoodleCategory' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'MoodleCourse' },
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'MoodleQuestion',
    },
  })
);

module.exports = MoodleQuiz;
