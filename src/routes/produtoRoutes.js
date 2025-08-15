const express = require('express');
const produtoController = require('../controllers/produtoController');
const router = express.Router();

// Middleware para proteger rotas de admin
function requireAdmin(req, res, next) {
	if (req.session && req.session.tipo === 'admin') {
		return next();
	}
	return res.redirect('/login');
}

router.get('/', produtoController.listarProdutos);
router.get('/novo', requireAdmin, produtoController.formNovoProduto);
router.post('/novo', requireAdmin, produtoController.criarProduto);
router.get('/:id/editar', requireAdmin, produtoController.formEditarProduto);
router.post('/:id/editar', requireAdmin, produtoController.editarProduto);
router.post('/:id/deletar', requireAdmin, produtoController.deletarProduto);

// Filtros
router.get('/categoria/:categoriaId', produtoController.filtrarPorCategoria);
router.get('/novidades', produtoController.filtrarNovidades);
router.get('/descontos', produtoController.filtrarDescontos);
router.get('/populares', produtoController.filtrarPopulares);
router.get('/buscar', produtoController.buscarPorNome);

module.exports = router;
