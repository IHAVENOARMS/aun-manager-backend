const mongoose = require('mongoose');

const MoodleQuestion = mongoose.model(
  'MoodleQuestion',
  mongoose.Schema({
    moodleQuizId: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 1000,
    },
    text: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 10000,
    },
    choices: {
      type: [String],
    },
    answer: { type: String, required: true, minLength: 1, maxLength: 10000 },
    type: {
      type: String,
      required: true,
      enum: ['multichoice', 'shortanswer', 'truefalse', 'ddimageortext'],
    },
  })
);

module.exports = MoodleQuestion;
