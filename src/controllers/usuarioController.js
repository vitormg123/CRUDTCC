const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

exports.listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.render('usuarios/lista', { usuarios });
};

exports.formNovoUsuario = (req, res) => {
  res.render('usuarios/novo');
};

exports.criarUsuario = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  const hash = await bcrypt.hash(senha, 10);
  await Usuario.create({ nome, email, senha: hash, tipo });
  res.redirect('/usuarios');
};

exports.formEditarUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  res.render('usuarios/editar', { usuario });
};

exports.editarUsuario = async (req, res) => {
  const { nome, email, tipo } = req.body;
  await Usuario.update({ nome, email, tipo }, { where: { id: req.params.id } });
  res.redirect('/usuarios');
};

exports.deletarUsuario = async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.redirect('/usuarios');
};
