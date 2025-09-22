const express = require('express');
const produtoController = require('../controllers/produtoController');
const upload = require('../../config/multer'); 
const router = express.Router();

// Middleware para proteger rotas de admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.tipo === 'admin') {
    return next();
  }
  return res.redirect('/login');
}

// Rotas principais
router.get('/', produtoController.listarProdutos);
router.get('/novo', requireAdmin, produtoController.formNovoProduto);
router.post('/novo', requireAdmin, upload.array('imagens', 10), produtoController.criarProduto);

router.get('/:id/editar', requireAdmin, produtoController.formEditarProduto);
router.post('/:id/editar', requireAdmin, upload.array('imagens', 10), produtoController.editarProduto);

// 🔥 Rota de deletar precisa vir antes da rota GET '/:id'
router.post('/:id/deletar', requireAdmin, produtoController.deletarProduto);

// Rota de detalhes do produto
router.get('/:id', produtoController.verDetalhesProduto);

// Filtros
router.get('/categoria/:categoriaId', produtoController.filtrarPorCategoria);
router.get('/novidades', produtoController.filtrarNovidades);
router.get('/descontos', produtoController.filtrarDescontos);
router.get('/populares', produtoController.filtrarPopulares);
router.get('/buscar', produtoController.buscarPorNome);

module.exports = router;
