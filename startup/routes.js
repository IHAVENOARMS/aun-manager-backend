const config = require('config');
const apiEndPoint = config.get('apiEndPoint');
const batchRouter = require('../routes/batches');
const roleRouter = require('../routes/roles');
const authRouter = require('../routes/auth');
const moodleInfoRouter = require('../routes/moodle/infos');
const promotionCodeRouter = require('../routes/promotionCodes');
const userRouter = require('../routes/users');
const sectionRouter = require('../routes/sections');
const scheduleRouter = require('../routes/schedules');
const messageRouter = require('../routes/messages');

module.exports = function (app) {
  app.use(apiEndPoint + 'info/moodle', moodleInfoRouter);
  app.use(apiEndPoint + 'batches', batchRouter);
  app.use(apiEndPoint + 'sections', sectionRouter);
  app.use(apiEndPoint + 'roles', roleRouter);
  app.use(apiEndPoint + 'users', userRouter);
  app.use(apiEndPoint + 'codes/promotion', promotionCodeRouter);
  app.use(apiEndPoint + 'auth', authRouter);
  app.use(apiEndPoint + 'schedules', scheduleRouter);
  app.use(apiEndPoint + 'messages', messageRouter);
};
