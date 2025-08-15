const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Categoria = sequelize.define('Categoria', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = Categoria;
