const express = require('express');
const { Usuario } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.session || !req.session.usuarioId) {
    return res.redirect('/login');
  }
  const usuario = await Usuario.findByPk(req.session.usuarioId);
  res.render('perfil', { usuario });
});

module.exports = router;
