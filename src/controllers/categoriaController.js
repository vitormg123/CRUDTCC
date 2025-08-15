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
  res.redirect('/categorias');
};

exports.formEditarCategoria = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  res.render('categorias/editar', { categoria });
};

exports.editarCategoria = async (req, res) => {
  const { nome } = req.body;
  await Categoria.update({ nome }, { where: { id: req.params.id } });
  res.redirect('/categorias');
};

exports.deletarCategoria = async (req, res) => {
  await Categoria.destroy({ where: { id: req.params.id } });
  res.redirect('/categorias');
};
