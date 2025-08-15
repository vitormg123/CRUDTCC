const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const router = express.Router();

router.get('/', usuarioController.listarUsuarios);
router.get('/novo', usuarioController.formNovoUsuario);
router.post('/novo', usuarioController.criarUsuario);
router.get('/:id/editar', usuarioController.formEditarUsuario);
router.post('/:id/editar', usuarioController.editarUsuario);
router.post('/:id/deletar', usuarioController.deletarUsuario);

module.exports = router;
