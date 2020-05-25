const meta = require.main.require('./src/meta');
const SocketPlugins = require.main.require('./src/socket.io/plugins');

const controllers = require('./lib/controllers');
const socketMethods = require('./websockets');

const { updateWords, check } = require('./lib/words');

const plugin = {};

plugin.init = async (params) => {
  SocketPlugins.sensitiveword = socketMethods;

  const { router } = params;
  const hostMiddleware = params.middleware;
  // const hostControllers = params.controllers;

  router.get(
    '/admin/plugins/sensitiveword',
    hostMiddleware.admin.buildHeader,
    controllers.renderAdminPage,
  );
  router.get('/api/admin/plugins/sensitiveword', controllers.renderAdminPage);

  const text = await meta.settings.getOne('sensitiveword', 'wordlist');
  updateWords(text);
};

plugin.addAdminNavigation = async (header) => {
  header.plugins.push({
    route: '/plugins/sensitiveword',
    icon: 'fa-tint',
    name: 'Sensitive Word',
  });

  return header;
};

plugin.checkTopicContent = async (data) => {
  const checkResultList = await Promise.all([check(data.data.title), check(data.data.content)]);
  const pass = checkResultList.map(result => result.pass).reduce((x, y) => x && y, true);
  if (pass) {
    return data;
  }
  const word = checkResultList.map(result => result.wrods).flat()[0];
  throw new Error(`包含敏感词: ${word}`);
};

plugin.checkPostContent = async (data) => {
  const checkResult = await check(data.post.content);
  if (checkResult.pass) {
    return data;
  }
  throw new Error(`包含敏感词: ${checkResult.wrods[0]}`);
};

module.exports = plugin;
