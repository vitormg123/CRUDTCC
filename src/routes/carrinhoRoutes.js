const express = require('express');
const carrinhoController = require('../controllers/carrinhoController');
const router = express.Router();

router.get('/', carrinhoController.verCarrinho);
router.post('/adicionar/:produtoId', carrinhoController.adicionarAoCarrinho);
router.post('/remover/:produtoId', carrinhoController.removerDoCarrinho);
router.post('/removerTudo/:produtoId', carrinhoController.removerTudoDoCarrinho);
router.post('/finalizar', carrinhoController.finalizarCompra);
router.post('/zerar', carrinhoController.zerarCarrinho);

module.exports = router;
