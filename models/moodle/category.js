const mongoose = require('mongoose');

const MoodleCategory = mongoose.model(
  'MoodleCategory',
  mongoose.Schema({
    moodleId: { type: String, required: true, minLength: 1, maxLength: 1000 },
    name: { type: String, required: true, minLength: 1, maxLength: 10000 },
    parentCateogry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MoodleCategory',
    },
    subCategories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'MoodleCategory',
    },
    courses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'MoodleCourse',
    },
  })
);

module.exports = MoodleCategory;
