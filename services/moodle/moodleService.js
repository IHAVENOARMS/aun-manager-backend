const MoodleUser = require('moodle-user');

const checkQuizzFor = async (user) => {
  const moodleUser = new MoodleUser(
    user.moodleInfo.username,
    user.moodleInfo.password
  );
  await moodleUser.login();
  const quiz = await moodleUser.visitQuizWithId(5173);
  return quiz;
};

module.exports = {
  checkQuizzFor,
};
