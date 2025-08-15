const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

exports.formLogin = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render('login', { erro: 'Usuário não encontrado!' });
  }
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    return res.render('login', { erro: 'Senha incorreta!' });
  }
  req.session.usuarioId = usuario.id;
  req.session.tipo = usuario.tipo;
  res.redirect('/');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
