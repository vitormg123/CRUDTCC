const express = require('express');
const carrinhoController = require('../controllers/carrinhoController');
const router = express.Router();

router.get('/', carrinhoController.verCarrinho);
router.post('/adicionar/:produtoId', carrinhoController.adicionarAoCarrinho);
router.post('/remover/:produtoId', carrinhoController.removerDoCarrinho);
router.post('/finalizar', carrinhoController.finalizarCompra);

module.exports = router;
