const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('herancas_do_sul', 'root', 'aluno01', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const dbConfig = {
  development: {
    username: 'root',
    password: 'aluno01',
    database: 'herancas_do_sul',
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
};

module.exports = {
  sequelize,
  dbConfig,
};
