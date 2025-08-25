const { Categoria } = require('../models');

exports.listarCategorias = async (req, res) => {
  const categorias = await Categoria.findAll();
  res.render('categorias/lista', { categorias });
};

exports.formNovaCategoria = (req, res) => {
  res.render('categorias/nova');
};

exports.criarCategoria = async (req, res) => {
  const { nome } = req.body;
  await Categoria.create({ nome });

  // Armazena mensagem de sucesso na sessão
  if (req.session) {
    req.session.mensagemSucesso = `Categoria "${nome}" cadastrada com sucesso!`;
  }

  // Redireciona para a página inicial
  res.redirect('/');
};

exports.formEditarCategoria = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  res.render('categorias/editar', { categoria });
};

exports.editarCategoria = async (req, res) => {
  const { nome } = req.body;
  await Categoria.update({ nome }, { where: { id: req.params.id } });

  // Mensagem de sucesso opcional
  if (req.session) {
    req.session.mensagemSucesso = `Categoria atualizada para "${nome}" com sucesso!`;
  }

  res.redirect('/');
};

exports.deletarCategoria = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  await Categoria.destroy({ where: { id: req.params.id } });

  if (req.session && categoria) {
    req.session.mensagemSucesso = `Categoria "${categoria.nome}" deletada com sucesso!`;
  }

  res.redirect('/');
};
