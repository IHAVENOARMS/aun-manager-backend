const args = require('./middleware/args');
const user = require('./middleware/user');
const auth = require('./middleware/auth');
const private = require('./middleware/private');
const group = require('./middleware/group');
const batch = require('./middleware/batch');
const leader = require('./middleware/leader');
const section = require('./middleware/section');
const chat = require('./middleware/chat');
const limitTo = require('./middleware/limitTo');

module.exports = {
  args,
  user,
  auth,
  group,
  private,
  batch,
  leader,
  section,
  chat,
  limitTo,
};
