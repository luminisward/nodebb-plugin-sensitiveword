const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const user = require.main.require('./src/user');

const { getWords, updateWords } = require('./lib/words');

const methods = {
  async reload() {
    const text = await meta.settings.getOne('sensitiveword', 'wordlist');
    updateWords(text);
  },
  async get() {
    return getWords();
  },
};

async function checkAdmin(socket, data, method) {
  const isAdmin = await user.isAdministrator(socket.uid);
  if (isAdmin) {
    return;
  }
  winston.warn(`[socket.io] Call to admin method ( ${
    method
  } ) blocked (accessed by uid ${
    socket.uid
  })`);
  throw new Error('[[error:no-privileges]]');
}

const wrappedMethods = {};

Object.keys(methods).forEach((method) => {
  wrappedMethods[method] = async (socket, data) => {
    await checkAdmin(socket, data, method);
    const ret = await methods[method](socket, data);
    return ret;
  };
});

module.exports = wrappedMethods;
