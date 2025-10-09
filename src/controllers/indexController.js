const { Produto, Categoria } = require('../models');

// Função para parsear imagens
const parseImagens = (produtosRaw) => {
  return produtosRaw.map(p => {
    const imgs = p.imagens ? JSON.parse(p.imagens) : [];
    return { ...p.toJSON(), imagens: imgs };
  });
};

// Página inicial
exports.index = async (req, res) => {
  try {
    const produtosRaw = await Produto.findAll({ include: Categoria });
    const categorias = await Categoria.findAll();

    const produtos = parseImagens(produtosRaw);

    res.render('index', { 
      produtos, 
      categorias, 
      usuario: req.session, 
      mensagemSucesso: req.session.mensagemSucesso || null 
    });

    // Limpa a mensagem após renderizar
    req.session.mensagemSucesso = null;
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar página inicial");
  }
};
