const mongoose = require('mongoose');

const MoodleCourse = mongoose.model(
  'MoodleCourse',
  mongoose.Schema({
    moodleId: { type: String, required: true, minLength: 1, maxLength: 1000 },
    name: { type: String, required: true, minLength: 1, maxLength: 10000 },
  })
);

module.exports = MoodleCourse;
