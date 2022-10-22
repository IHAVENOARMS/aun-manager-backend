const { Telegraf } = require('telegraf');
const { args, user, auth } = require('../middleware');
const MoodleUser = require('moodle-user/MoodleUser');

// const joseph = new Telegraf();

module.exports = (joseph, command) => {
  joseph.command(
    command,
    args(),
    user('moodleInfo'),
    auth(1000),
    async (ctx) => {
      const user = ctx.state.user;
      const quizId = parseInt(ctx.state.args[0]);
      const moodleUser = new MoodleUser(
        user.moodleInfo.username,
        user.moodleInfo.password
      );
      await moodleUser.login();
      const finishedAttempt = await moodleUser.attendQuizWithId(quizId);
      const newAttempt = await moodleUser.startAttempt(quizId);
      await newAttempt.solveFrom(finishedAttempt);
      await moodleUser.uploadAttempt(newAttempt);
      const result = await moodleUser.submitAttempt(newAttempt);
      return ctx.sendMessage(`حليتلك الكويز و جبتلك فيه ${result.info.grade}`);
    }
  );
};
