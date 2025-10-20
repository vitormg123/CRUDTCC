const { Produto } = require('../models');

// Adiciona produto ao carrinho
exports.adicionarAoCarrinho = async (req, res) => {
  const produtoId = parseInt(req.params.produtoId);
  const quantidade = parseInt(req.body.quantidade) || 1;

  if (!req.session.carrinho) req.session.carrinho = [];

  const carrinho = req.session.carrinho;
  const item = carrinho.find(i => i.produtoId === produtoId);

  if (item) {
    item.quantidade += quantidade;
    if (item.quantidade > 100) item.quantidade = 100;
  } else {
    carrinho.push({ produtoId, quantidade });
  }

  req.session.carrinho = carrinho;
  res.redirect('/carrinho');
};

// Ver carrinho
exports.verCarrinho = async (req, res) => {
  const carrinho = req.session.carrinho || [];
  if (carrinho.length === 0) {
    return res.render('carrinho', { itens: [], total: 0, mensagem: 'Seu carrinho está vazio.' });
  }

  const produtos = await Produto.findAll({
    where: { id: carrinho.map(item => item.produtoId) },
  });

  const itens = produtos.map(produto => {
    const itemCarrinho = carrinho.find(i => i.produtoId === produto.id);
    const quantidade = itemCarrinho ? itemCarrinho.quantidade : 1;
    const subtotal = produto.preco * quantidade * (1 - produto.desconto / 100);
    return { produto, quantidade, subtotal };
  });

  const total = itens.reduce((soma, i) => soma + i.subtotal, 0);
  res.render('carrinho', { itens, total, mensagem: null });
};

// Remove 1 unidade
exports.removerDoCarrinho = (req, res) => {
  const produtoId = parseInt(req.params.produtoId);
  if (!req.session.carrinho) return res.redirect('/carrinho');

  const item = req.session.carrinho.find(i => i.produtoId === produtoId);
  if (item) {
    if (item.quantidade > 1) {
      item.quantidade -= 1;
    } else {
      req.session.carrinho = req.session.carrinho.filter(i => i.produtoId !== produtoId);
    }
  }

  res.redirect('/carrinho');
};

// Remove todas unidades de um produto
exports.removerTudoDoCarrinho = (req, res) => {
  const produtoId = parseInt(req.params.produtoId);
  if (!req.session.carrinho) return res.redirect('/carrinho');

  req.session.carrinho = req.session.carrinho.filter(i => i.produtoId !== produtoId);
  res.redirect('/carrinho');
};

// Finalizar compra
exports.finalizarCompra = async (req, res) => {
  const carrinho = req.session.carrinho || [];
  if (carrinho.length === 0) return res.redirect('/carrinho');

  for (const item of carrinho) {
    const produto = await Produto.findByPk(item.produtoId);
    if (produto) {
      produto.quantidadeVendida += item.quantidade;
      await produto.save();
    }
  }

  req.session.carrinho = [];
  res.render('carrinho', { itens: [], total: 0, mensagem: 'Compra finalizada com sucesso!' });
};

// Zerar todo o carrinho
exports.zerarCarrinho = (req, res) => {
  req.session.carrinho = [];
  res.redirect('/carrinho');
};
