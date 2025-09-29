const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('herancas_do_sul', 'root', 'iv190420070', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
