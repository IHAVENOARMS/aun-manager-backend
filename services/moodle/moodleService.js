const MoodleUser = require('moodle-user');
const { User } = require('../../models/user');
const joseph = require('../JOSEPH/joseph');

const {
  couldNotLogInForYou,
  quizWasAttendedBefore,
  quizWasNotAttendedBefore,
  quizHasPendingAttempt,
} = require('../JOSEPH/templates');

const checkQuizzForStudentWithId = async (userId, moodleQuizId) => {
  const user = await User.findById(userId);
  if (!user)
    return joseph.log(`Trying to check quiz for a user that does not exist...
  id: ${userId}
  quizId: ${moodleQuizId}`);

  if (!user.moodleInfo)
    return joseph.log(`Trying to check quiz for a user that is not a student...
  name: ${user.arabicName}
  id: ${userId}
  quizId: ${moodleQuizId}`);

  const moodleUser = new MoodleUser(
    user.moodleInfo.username,
    user.moodleInfo.password
  );
  try {
    await moodleUser.login();
  } catch (exc) {
    await joseph.log(`Could not login for user...
    name: ${user.arabicName}
    id: ${userId}
    quizId: ${moodleQuizId}
    ${exc.message}`);
    await joseph.sendMessageToUser(user, couldNotLogInForYou(user));
  }
  try {
    const quiz = await moodleUser.visitQuizWithId(moodleQuizId);
    if (quiz.wasAttendedBefore)
      await joseph.sendMessageToUser(user, quizWasAttendedBefore(user, quiz));
    if (!quiz.wasAttendedBefore)
      await joseph.sendMessageToUser(
        user,
        quizWasNotAttendedBefore(user, quiz)
      );
    if (quiz.hasPendingAttempt)
      await joseph.sendMessageToUser(user, quizHasPendingAttempt(user, quiz));
  } catch (exc) {
    return joseph.log(`Could not check quiz for user....
    name: ${user.arabicName}
    id: ${userId}
    quizId: ${moodleQuizId}
    ${exc.message}`);
  }
};

const checkQuizzForStudent = async (
  user,
  moodleQuizId,
  login = false,
  passedMoodleUser = undefined
) => {
  if (!user)
    return joseph.log(`Trying to check quiz for a user that does not exist...
  id: ${userId}
  quizId: ${moodleQuizId}`);

  if (!user.moodleInfo)
    return joseph.log(`Trying to check quiz for a user that is not a student...
  name: ${user.arabicName}
  id: ${userId}
  quizId: ${moodleQuizId}`);

  let moodleUser;
  if (login) {
    try {
      moodleUser = new MoodleUser(
        user.moodleInfo.username,
        user.moodleInfo.password
      );

      await moodleUser.login();
    } catch (exc) {
      await joseph.log(`Could not login for user...
    name: ${user.arabicName}
    id: ${userId}
    quizId: ${moodleQuizId}
    ${exc.message}`);
      await joseph.sendMessageToUser(user, couldNotLogInForYou(user));
    }
  } else {
    moodleUser = passedMoodleUser;
  }

  try {
    const quiz = await moodleUser.visitQuizWithId(moodleQuizId);
    if (quiz.wasAttendedBefore)
      await joseph.sendMessageToUser(user, quizWasAttendedBefore(user, quiz));
    if (!quiz.wasAttendedBefore)
      await joseph.sendMessageToUser(
        user,
        quizWasNotAttendedBefore(user, quiz)
      );
    if (quiz.hasPendingAttempt)
      await joseph.sendMessageToUser(user, quizHasPendingAttempt(user, quiz));
  } catch (exc) {
    return joseph.log(`Could not check quiz for user....
    name: ${user.arabicName}
    id: ${userId}
    quizId: ${moodleQuizId}
    ${exc.message}`);
  }
};

const checkQuizzesForStudentWithId = async (userId, quizzes) => {
  const user = await User.findById(userId);
  if (!user)
    return joseph.log(`Trying to check quiz for a user that does not exist...
  id: ${userId}
  quizId: ${moodleQuizId}`);

  if (!user.moodleInfo)
    return joseph.log(`Trying to check quiz for a user that is not a student...
  name: ${user.arabicName}
  id: ${userId}
  quizId: ${moodleQuizId}`);

  const moodleUser = new MoodleUser(
    user.moodleInfo.username,
    user.moodleInfo.password
  );

  try {
    await moodleUser.login();
  } catch (exc) {
    await joseph.log(`Could not login for user...
    name: ${user.arabicName}
    id: ${userId}
    quizId: ${moodleQuizId}
    ${exc.message}`);
    await joseph.sendMessageToUser(user, couldNotLogInForYou(user));
  }
  for (let i = 0; i < quizzes.length; i++) {
    await checkQuizzForStudent(user, quizzes[i], false, moodleUser);
  }
};

const checkQuizzesForStudentsWithId = async (userIds, quizzes) => {
  userIds.forEach((userId) => {
    checkQuizzesForStudentWithId(userId, quizzes);
  });
};

module.exports = {
  checkQuizzForStudentWithId,
  checkQuizzesForStudentWithId,
  checkQuizzesForStudentsWithId,
};
