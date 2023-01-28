const MoodleCourse = require('../../models/moodle/course');

const storeCourse = async (moodleUser, course, category_id) => {
  const storedCourse = await MoodleCourse.exists({ moodleId: course.id });
  if (storedCourse) return storedCourse._id;
  else {
    const newCourse = new MoodleCourse({
      category: category_id,
      moodleId: course.id,
      name: course.name,
    });
    await newCourse.save();
    return newCourse._id;
  }
};

module.exports = { storeCourse };
