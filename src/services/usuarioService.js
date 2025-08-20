const { Usuario } = require('../models');

exports.temMaisDeUmUsuario = async function () {
  const count = await Usuario.count();
  return count > 1;
};
