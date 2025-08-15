const sequelize = require('../../config/db');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Produto = require('./Produto');

async function syncModels() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados com o banco de dados!');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
  }
}

module.exports = { sequelize, Usuario, Categoria, Produto, syncModels };
