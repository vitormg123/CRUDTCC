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
  try {
    const { nome, descricao, preco, desconto, categoriaId, tamanho } = req.body;

    // Pega os arquivos enviados via Multer
    const imagens = req.files ? req.files.map(file => 'uploads/' + file.filename) : [];

    await Produto.create({
      nome,
      descricao,
      preco,
      desconto: desconto || 0,
      categoriaId,
      tamanho,
      imagens: JSON.stringify(imagens) // Salva as imagens em formato JSON
    });

    // Mensagem de sucesso
    req.session.mensagemSucesso = 'Produto cadastrado com sucesso!';

    // Redireciona para a página inicial
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar produto');
  }
};

exports.formEditarProduto = async (req, res) => {
  const produto = await Produto.findByPk(req.params.id);
  const categorias = await Categoria.findAll();
  res.render('produtos/editar', { produto, categorias });
};

exports.editarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, desconto, categoriaId, tamanho } = req.body;
    const imagens = req.files ? req.files.map(file => 'uploads/' + file.filename) : [];

    const updateData = { nome, descricao, preco, desconto: desconto || 0, categoriaId, tamanho };
    if (imagens.length > 0) updateData.imagens = JSON.stringify(imagens);

    await Produto.update(updateData, { where: { id: req.params.id } });

    // Mensagem de sucesso
    req.session.mensagemSucesso = 'Produto editado com sucesso!';
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao editar produto');
  }
};

exports.deletarProduto = async (req, res) => {
  try {
    await Produto.destroy({ where: { id: req.params.id } });

    // Mensagem de sucesso
    req.session.mensagemSucesso = 'Produto deletado com sucesso!';
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar produto');
  }
};

exports.filtrarPorCategoria = async (req, res) => {
  const produtos = await Produto.findAll({ where: { categoriaId: req.params.categoriaId }, include: Categoria });
  res.render('produtos/lista', { produtos, usuario: req.session });
};

exports.filtrarNovidades = async (req, res) => {
  const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000);
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
