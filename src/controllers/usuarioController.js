const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

exports.listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.render('usuarios/lista', { usuarios });
};

exports.formNovoUsuario = (req, res) => {
  const dados = {}; // dados vazios para novo cadastro

  // Se houver telefone, formata para (XX) XXXXX-XXXX
  let telefoneFormatado = '';
  if (dados && dados.telefone) {
    const t = dados.telefone.replace(/\D/g,''); // remove tudo que não é número
    telefoneFormatado = t.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
  }

  res.render('usuarios/novo', { erro: null, dados: { ...dados, telefone: telefoneFormatado } });
};


exports.criarUsuario = async (req, res) => {
  const { nome, email, senha, tipo, cep, pais, estado, cidade, municipio, telefone, rg } = req.body;

  // Validações servidor-side
  if (!/^\d{11}$/.test(rg)) {
    return res.render('usuarios/novo', { erro: 'RG inválido. Deve ter 11 dígitos numéricos.', dados: req.body });
  }

  if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone)) {
    return res.render('usuarios/novo', { erro: 'Telefone inválido. Use o formato (00) 00000-0000.', dados: req.body });
  }

  if (!/^\d{5}-?\d{3}$/.test(cep)) {
    return res.render('usuarios/novo', { erro: 'CEP inválido. Use o formato 00000-000.', dados: req.body });
  }

  try {
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.render('usuarios/novo', { erro: 'usuario-existente', dados: req.body });
    }

    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: hash,
      tipo,
      cep,
      pais,
      estado,
      cidade,
      municipio,
      telefone,
      rg
    });

    req.session.usuarioId = novoUsuario.id;
    req.session.tipo = novoUsuario.tipo;
    req.session.nome = novoUsuario.nome;
    req.session.email = novoUsuario.email;

    res.redirect('/');
  } catch (error) {
    console.error(error);
    return res.render('usuarios/novo', { erro: 'erro-validacao', dados: req.body });
  }
};

exports.formEditarUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  res.render('usuarios/editar', { usuario });
};

exports.editarUsuario = async (req, res) => {
  const { nome, email, tipo, cep, pais, estado, cidade, municipio, telefone, rg } = req.body;

  // Validações servidor-side
  if (!/^\d{11}$/.test(rg)) {
    return res.render('usuarios/editar', { erro: 'RG inválido. Deve ter 11 dígitos numéricos.', usuario: { id: req.params.id, ...req.body } });
  }

  if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone)) {
    return res.render('usuarios/editar', { erro: 'Telefone inválido. Use o formato (00) 00000-0000.', usuario: { id: req.params.id, ...req.body } });
  }

  if (!/^\d{5}-?\d{3}$/.test(cep)) {
    return res.render('usuarios/editar', { erro: 'CEP inválido. Use o formato 00000-000.', usuario: { id: req.params.id, ...req.body } });
  }

  await Usuario.update(
    { nome, email, tipo, cep, pais, estado, cidade, municipio, telefone, rg },
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
