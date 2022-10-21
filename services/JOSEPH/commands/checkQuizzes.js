const { checkQuizzFor } = require('../../moodle/moodleService');
const { user } = require('../middleware');

module.exports = (joseph, command = 'check_quizzes') => {
  joseph.command(command, user(), async (ctx) => {
    const quiz = await checkQuizzFor(ctx.state.user);
  });
};
