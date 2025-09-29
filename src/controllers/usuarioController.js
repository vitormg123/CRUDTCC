const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

exports.listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.render('usuarios/lista', { usuarios });
};

exports.formNovoUsuario = (req, res) => {
  res.render('usuarios/novo', { erro: null, dados: {} });
};

exports.criarUsuario = async (req, res) => {
  const { nome, email, senha, tipo, cep, pais, estado, cidade, municipio } = req.body;

  try {
    // Verifica se já existe usuário com esse email
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.render('usuarios/novo', {
        erro: 'usuario-existente',
        dados: req.body
      });
    }

    // Criptografar a senha
    const hash = await bcrypt.hash(senha, 10);

    // Criar usuário com todos os campos
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: hash,
      tipo,
      cep,
      pais,
      estado,
      cidade,
      municipio
    });

    // Login automático após cadastro
    req.session.usuarioId = novoUsuario.id;
    req.session.tipo = novoUsuario.tipo;
    req.session.nome = novoUsuario.nome;
    req.session.email = novoUsuario.email;

    res.redirect('/');
  } catch (error) {
    console.error(error);
    return res.render('usuarios/novo', {
      erro: 'erro-validacao',
      dados: req.body
    });
  }
};

exports.formEditarUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  res.render('usuarios/editar', { usuario });
};

exports.editarUsuario = async (req, res) => {
  const { nome, email, tipo, cep, pais, estado, cidade, municipio } = req.body;

  await Usuario.update(
    { nome, email, tipo, cep, pais, estado, cidade, municipio },
    { where: { id: req.params.id } }
  );

  res.redirect('/usuarios');
};

exports.deletarUsuario = async (req, res) => {
  const usuarioId = req.session.usuarioId;
  await Usuario.destroy({ where: { id: req.params.id } });

  if (parseInt(req.params.id) === usuarioId) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  } else {
    res.redirect('/usuarios');
  }
};
