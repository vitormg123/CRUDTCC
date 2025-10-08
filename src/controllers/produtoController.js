const { Produto, Categoria } = require('../models');
const { Op } = require('sequelize');

const parseImagens = (produtosRaw) => {
  return produtosRaw.map(p => {
    const imgs = p.imagens ? JSON.parse(p.imagens) : [];
    return { ...p.toJSON(), imagens: imgs };
  });
};

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
  try {
    const produtosRaw = await Produto.findAll({ include: Categoria });
    const produtos = parseImagens(produtosRaw);
    res.render('produtos/lista', { produtos, usuario: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar produtos");
  }
};

// Formulário novo produto
exports.formNovoProduto = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.render('produtos/novo', { categorias });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar formulário");
  }
};

// Criar produto
exports.criarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, desconto, categoriaId, tamanho } = req.body;
    const imagens = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];

    await Produto.create({
      nome,
      descricao,
      preco,
      desconto: desconto || 0,
      categoriaId,
      tamanho,
      imagens: JSON.stringify(imagens)
    });

    req.session.mensagemSucesso = 'Produto cadastrado com sucesso!';
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar produto');
  }
};

// Formulário editar produto
exports.formEditarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    const categorias = await Categoria.findAll();
    res.render('produtos/editar', { produto, categorias });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar formulário de edição");
  }
};

// Editar produto
exports.editarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, desconto, categoriaId, tamanho } = req.body;
    const imagens = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];

    const updateData = { nome, descricao, preco, desconto: desconto || 0, categoriaId, tamanho };
    if (imagens.length > 0) updateData.imagens = JSON.stringify(imagens);

    await Produto.update(updateData, { where: { id: req.params.id } });

    req.session.mensagemSucesso = 'Produto editado com sucesso!';
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao editar produto");
  }
};

// Deletar produto
exports.deletarProduto = async (req, res) => {
  try {
    await Produto.destroy({ where: { id: req.params.id } });
    req.session.mensagemSucesso = 'Produto deletado com sucesso!';
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar produto");
  }
};

// Filtrar por categoria
exports.filtrarPorCategoria = async (req, res) => {
  try {
    const produtosRaw = await Produto.findAll({
      where: { categoriaId: req.params.categoriaId },
      include: Categoria
    });
    const produtos = parseImagens(produtosRaw);
    res.render('produtos/lista', { produtos, usuario: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao filtrar produtos por categoria");
  }
};

// Filtrar novidades
exports.filtrarNovidades = async (req, res) => {
  try {
    const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const produtosRaw = await Produto.findAll({
      where: { criadoEm: { [Op.gte]: ontem } },
      include: Categoria
    });
    const produtos = parseImagens(produtosRaw);
    res.render('produtos/lista', { produtos, usuario: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao filtrar novidades");
  }
};

// Filtrar descontos
exports.filtrarDescontos = async (req, res) => {
  try {
    const produtosRaw = await Produto.findAll({
      where: { desconto: { [Op.gt]: 0 } },
      include: Categoria
    });
    const produtos = parseImagens(produtosRaw);
    res.render('produtos/lista', { produtos, usuario: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao filtrar descontos");
  }
};

// Filtrar populares
exports.filtrarPopulares = async (req, res) => {
  try {
    const produtosRaw = await Produto.findAll({
      order: [['quantidadeVendida', 'DESC']],
      limit: 10,
      include: Categoria
    });
    const produtos = parseImagens(produtosRaw);
    res.render('produtos/lista', { produtos, usuario: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao filtrar produtos populares");
  }
};

// Buscar por nome
exports.buscarPorNome = async (req, res) => {
  try {
    const { q } = req.query;
    const produtosRaw = await Produto.findAll({
      where: { nome: { [Op.like]: `%${q}%` } },
      include: Categoria
    });
    const produtos = parseImagens(produtosRaw);
    res.render('produtos/lista', { produtos, usuario: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar produtos");
  }
};

// Ver detalhes do produto
exports.verDetalhesProduto = async (req, res) => {
  try {
    const produto = await Produto.findOne({
      where: { id: req.params.id },
      include: Categoria
    });
    if (!produto) return res.status(404).send("Produto não encontrado");

    const imagens = produto.imagens ? JSON.parse(produto.imagens) : [];
    res.render('produtoDetalhes', { produto, imagens, usuario: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar produto");
  }
};
