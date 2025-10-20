const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const router = express.Router();

router.get('/', categoriaController.listarCategorias);
router.get('/lista', categoriaController.listarCategorias); // nova rota
router.get('/nova', categoriaController.formNovaCategoria);
router.post('/nova', categoriaController.criarCategoria);
router.get('/:id/editar', categoriaController.formEditarCategoria);
router.post('/:id/editar', categoriaController.editarCategoria);
router.post('/:id/deletar', categoriaController.deletarCategoria);

module.exports = router;
