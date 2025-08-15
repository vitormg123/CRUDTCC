const { Produto } = require('../models');

exports.verCarrinho = async (req, res) => {
  const carrinho = req.session.carrinho || [];
  const produtos = await Produto.findAll({ where: { id: carrinho.map(item => item.produtoId) } });
  const itens = produtos.map(produto => {
    const item = carrinho.find(i => i.produtoId === produto.id);
    return { produto, quantidade: item ? item.quantidade : 1 };
  });
  const total = itens.reduce((soma, item) => soma + (item.produto.preco * item.quantidade * (1 - item.produto.desconto/100)), 0);
  res.render('carrinho', { itens, total });
};

exports.adicionarAoCarrinho = async (req, res) => {
  const { produtoId } = req.params;
  let carrinho = req.session.carrinho || [];
  const item = carrinho.find(i => i.produtoId == produtoId);
  if (item) {
    item.quantidade += 1;
  } else {
    carrinho.push({ produtoId: Number(produtoId), quantidade: 1 });
  }
  req.session.carrinho = carrinho;
  res.redirect('/carrinho');
};

exports.removerDoCarrinho = (req, res) => {
  const { produtoId } = req.params;
  let carrinho = req.session.carrinho || [];
  carrinho = carrinho.filter(i => i.produtoId != produtoId);
  req.session.carrinho = carrinho;
  res.redirect('/carrinho');
};

exports.finalizarCompra = async (req, res) => {
  let carrinho = req.session.carrinho || [];
  if (carrinho.length === 0) return res.redirect('/carrinho');
  // Atualiza quantidadeVendida dos produtos
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
