const Controllers = {};

Controllers.renderAdminPage = (req, res/* , next */) => {
  res.render('admin/plugins/sensitiveword', {});
};

module.exports = Controllers;
