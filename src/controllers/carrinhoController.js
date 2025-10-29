const { Produto } = require('../models');
const mercadopago = require('mercadopago');

// Configuração do Mercado Pago
mercadopago.config = {
  access_token: 'aluno01'
};



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

// Finalizar compra com Mercado Pago
exports.finalizarCompra = async (req, res) => {
  try {
    const carrinho = req.session.carrinho || [];
    if (carrinho.length === 0) return res.redirect('/carrinho');

    // Atualiza quantidadeVendida
    for (const item of carrinho) {
      const produto = await Produto.findByPk(item.produtoId);
      if (produto) {
        produto.quantidadeVendida += item.quantidade;
        await produto.save();
      }
    }

    // Prepara itens para Mercado Pago
    const items = await Promise.all(carrinho.map(async item => {
      const produto = await Produto.findByPk(item.produtoId);
      return {
        title: produto.nome,
        quantity: item.quantidade,
        currency_id: 'BRL',
        unit_price: parseFloat((produto.preco * (1 - produto.desconto / 100)).toFixed(2))
      };
    }));

    // Cria preferência de pagamento
    const preference = {
      items,
      back_urls: {
        success: 'http://localhost:3000/carrinho/sucesso',
        failure: 'http://localhost:3000/carrinho/falha',
        pending: 'http://localhost:3000/carrinho/pendente'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);

    // Redireciona para checkout do Mercado Pago
    res.redirect(response.body.init_point);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao finalizar a compra.');
  }
};

// Zerar todo o carrinho
exports.zerarCarrinho = (req, res) => {
  req.session.carrinho = [];
  res.redirect('/carrinho');
};

// Rotas de retorno do Mercado Pago
exports.sucesso = (req, res) => {
  req.session.carrinho = [];
  res.send('Pagamento aprovado! Obrigado pela compra.');
};

exports.falha = (req, res) => {
  res.send('O pagamento falhou. Tente novamente.');
};

exports.pendente = (req, res) => {
  res.send('O pagamento está pendente.');
};
