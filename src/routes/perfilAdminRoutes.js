const express = require('express');
const { Usuario, Categoria, Produto } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.session || !req.session.usuarioId || req.session.tipo !== 'admin') {
    return res.redirect('/login');
  }
  const usuario = await Usuario.findByPk(req.session.usuarioId);
  const categorias = await Categoria.findAll();
  const produtos = await Produto.findAll({ include: Categoria });
  // Carrinho
  const carrinho = req.session.carrinho || [];
  const produtosCarrinho = await Produto.findAll({ where: { id: carrinho.map(item => item.produtoId) } });
  const itens = produtosCarrinho.map(produto => {
    const item = carrinho.find(i => i.produtoId === produto.id);
    return { produto, quantidade: item ? item.quantidade : 1 };
  });
  const total = itens.reduce((soma, item) => soma + (item.produto.preco * item.quantidade * (1 - item.produto.desconto/100)), 0);
  res.render('perfilAdmin', { usuario, categorias, produtos, itens, total });
});

module.exports = router;
