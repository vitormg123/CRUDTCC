const { Produto, Categoria } = require('../models');
const { Op } = require('sequelize');

exports.listarProdutos = async (req, res) => {
  const produtos = await Produto.findAll({ include: Categoria });
  res.render('produtos/lista', { produtos, usuario: req.session });
};

exports.formNovoProduto = async (req, res) => {
  const categorias = await Categoria.findAll();
  res.render('produtos/novo', { categorias });
};

exports.criarProduto = async (req, res) => {
  const { nome, descricao, preco, desconto, categoriaId } = req.body;
  await Produto.create({ nome, descricao, preco, desconto, categoriaId });
  res.redirect('/produtos');
};

exports.formEditarProduto = async (req, res) => {
  const produto = await Produto.findByPk(req.params.id);
  const categorias = await Categoria.findAll();
  res.render('produtos/editar', { produto, categorias });
};

exports.editarProduto = async (req, res) => {
  const { nome, descricao, preco, desconto, categoriaId } = req.body;
  await Produto.update({ nome, descricao, preco, desconto, categoriaId }, { where: { id: req.params.id } });
  res.redirect('/produtos');
};

exports.deletarProduto = async (req, res) => {
  await Produto.destroy({ where: { id: req.params.id } });
  res.redirect('/produtos');
};

exports.filtrarPorCategoria = async (req, res) => {
  const produtos = await Produto.findAll({ where: { categoriaId: req.params.categoriaId }, include: Categoria });
  res.render('produtos/lista', { produtos, usuario: req.session });
};

exports.filtrarNovidades = async (req, res) => {
  const ontem = new Date(Date.now() - 24*60*60*1000);
  const produtos = await Produto.findAll({ where: { criadoEm: { [Op.gte]: ontem } }, include: Categoria });
  res.render('produtos/lista', { produtos, usuario: req.session });
};

exports.filtrarDescontos = async (req, res) => {
  const produtos = await Produto.findAll({ where: { desconto: { [Op.gt]: 0 } }, include: Categoria });
  res.render('produtos/lista', { produtos, usuario: req.session });
};

exports.filtrarPopulares = async (req, res) => {
  const produtos = await Produto.findAll({ order: [['quantidadeVendida', 'DESC']], limit: 10, include: Categoria });
  res.render('produtos/lista', { produtos, usuario: req.session });
};

exports.buscarPorNome = async (req, res) => {
  const { q } = req.query;
  const produtos = await Produto.findAll({ where: { nome: { [Op.like]: `%${q}%` } }, include: Categoria });
  res.render('produtos/lista', { produtos, usuario: req.session });
};
