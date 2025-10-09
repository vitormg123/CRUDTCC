const express = require('express');
const { Usuario, Categoria, Produto } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.session || !req.session.usuarioId || req.session.tipo !== 'admin') {
    return res.redirect('/login');
  }

  try {
    const usuario = await Usuario.findByPk(req.session.usuarioId);
    const categorias = await Categoria.findAll();

    // Incluindo Categoria com alias correto
    const produtos = await Produto.findAll({
      include: { model: Categoria, as: 'Categorium' }
    });

    // Carrinho
    const carrinho = req.session.carrinho || [];
    const produtosCarrinho = await Produto.findAll({
      where: { id: carrinho.map(item => item.produtoId) },
      include: { model: Categoria, as: 'Categorium' }
    });

    const itens = produtosCarrinho.map(produto => {
      const item = carrinho.find(i => i.produtoId === produto.id);
      return { produto, quantidade: item ? item.quantidade : 1 };
    });

    const total = itens.reduce((soma, item) => 
      soma + (item.produto.preco * item.quantidade * (1 - item.produto.desconto / 100)), 0
    );

    res.render('perfilAdmin', { usuario, categorias, produtos, itens, total });
  } catch (error) {
    console.error('Erro ao buscar dados do perfil admin:', error);
    res.send('Erro ao buscar dados do perfil admin');
  }
});

module.exports = router;
