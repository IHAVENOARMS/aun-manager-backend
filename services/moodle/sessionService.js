const MoodleUser = require('moodle-user');
const { User } = require('../../models/user');

const moodleUsers = {};

const createMoodleUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user)
    throw Error(
      'Trying to create a moodle session for a user that no longer exists...'
    );

  if (!user.moodleInfo)
    throw Error('Trying to access moodle with no moodle credentials...');

  const moodleUser = new MoodleUser(
    user.moodleInfo.username,
    user.moodleInfo.password
  );
  await moodleUser.login();
  moodleUsers[userId] = moodleUser;
  return moodleUser;
};

const refreshMoodleUser = async (userId) => {
  await moodleUsers[userId].login();
};

const getMoodleUser = async (userId) => {
  const moodleUser = moodleUsers[userId];
  if (!moodleUser) return await createMoodleUser(userId);
  return moodleUser;
};

const getMoodleUsers = async () => {
  return moodleUsers;
};

module.exports = {
  createMoodleUser,
  refreshMoodleUser,
  getMoodleUser,
  getMoodleUsers,
};
