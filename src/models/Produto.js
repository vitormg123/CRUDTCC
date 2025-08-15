const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Categoria = require('./Categoria');

const Produto = sequelize.define('Produto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false },
  preco: { type: DataTypes.FLOAT, allowNull: false },
  desconto: { type: DataTypes.FLOAT, defaultValue: 0 },
  imagem: { type: DataTypes.STRING },
  criadoEm: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  quantidadeVendida: { type: DataTypes.INTEGER, defaultValue: 0 }
});

Produto.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Categoria.hasMany(Produto, { foreignKey: 'categoriaId' });

module.exports = Produto;
