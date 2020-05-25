/* globals $, app, socket, define */

define('admin/plugins/sensitiveword', ['settings'], (settings) => {
  const ACP = {};
  const settingHash = 'sensitiveword';
  const formClass = `.${settingHash}-settings`;

  function saveSettings() {
    settings.save(settingHash, $(formClass), () => {
      socket.emit('plugins.sensitiveword.reload', null, (err) => {
        if (err) {
          app.alertError(err);
        } else {
          app.alertSuccess('保存成功');
        }
      });
    });
  }

  ACP.init = () => {
    settings.load(settingHash, $(formClass));
    $('#save').on('click', saveSettings);
  };


  return ACP;
});
