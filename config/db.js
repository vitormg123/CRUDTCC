const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('herancas_do_sul', 'root', 'aluno01', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
