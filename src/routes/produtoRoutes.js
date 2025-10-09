const express = require('express');
const produtoController = require('../controllers/produtoController');
const upload = require('../../config/multer'); 
const router = express.Router();

// Middleware admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.tipo === 'admin') return next();
  return res.redirect('/login');
}

// Rotas principais
router.get('/', produtoController.listarProdutos);
router.get('/novo', requireAdmin, produtoController.formNovoProduto);
router.post('/novo', requireAdmin, upload.array('imagens', 10), produtoController.criarProduto);

// Editar/deletar
router.get('/:id/editar', requireAdmin, produtoController.formEditarProduto);
router.post('/:id/editar', requireAdmin, upload.array('imagens', 10), produtoController.editarProduto);
router.post('/:id/deletar', requireAdmin, produtoController.deletarProduto);

// Rotas de filtro (devem vir antes da rota genérica de detalhes)
router.get('/categoria/:categoriaId', produtoController.filtrarPorCategoria);
router.get('/novidades', produtoController.filtrarNovidades);
router.get('/descontos', produtoController.filtrarDescontos);
router.get('/populares', produtoController.filtrarPopulares);
router.get('/buscar', produtoController.buscarPorNome);

// Detalhes do produto (rota genérica, por último)
router.get('/:id', produtoController.verDetalhesProduto);

module.exports = router;
