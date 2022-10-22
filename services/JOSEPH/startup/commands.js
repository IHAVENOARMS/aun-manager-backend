const password = require('../commands/password');
const id = require('../commands/id');
const info = require('../commands/info');
const infoForUser = require('../commands/infoForUser');
const setChannelLink = require('../commands/setChannelLink');
const test = require('../commands/test');
const start = require('../commands/start');
const removeUser = require('../commands/removeUser');
const setGroup = require('../commands/setGroup');
const storeChannel = require('../commands/setChannel');
const links = require('../commands/links');
const promoteSectionLeader = require('../commands/promoteSectionLeader');
const checkQuizzes = require('../commands/checkQuizzes');

module.exports = (joseph) => {
  password(joseph, 'password');
  id(joseph, 'id');
  info(joseph, 'info');
  links(joseph, 'links');
  infoForUser(joseph, 'info_for');
  setChannelLink(joseph, 'set_channel_link');
  setGroup(joseph, 'set_group');
  storeChannel(joseph, 'set_channel');
  removeUser(joseph, 'remove');
  test(joseph, 'test');
  start(joseph, 'start');
  promoteSectionLeader(joseph, 'promote_section_leader');
  checkQuizzes(joseph, 'check_quizzes');
};