const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const Categoria = require('./Categoria');

const Produto = sequelize.define('Produto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false },
  preco: { type: DataTypes.FLOAT, allowNull: false },
  desconto: { type: DataTypes.FLOAT, defaultValue: 0 },
  tamanho: { type: DataTypes.STRING }, // para compatibilidade antiga, mas agora usamos tamanhos múltiplos
  cores: { type: DataTypes.TEXT },      // nova coluna para salvar array de cores em JSON
  tamanhos: { type: DataTypes.TEXT },   // nova coluna para salvar array de tamanhos em JSON
  imagem: { type: DataTypes.STRING },   // ainda pode existir, mas não usado no cadastro múltiplo
  imagens: { type: DataTypes.TEXT },    // coluna para salvar array de imagens em JSON
  criadoEm: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  quantidadeVendida: { type: DataTypes.INTEGER, defaultValue: 0 },
  quantidadePares: { type: DataTypes.INTEGER, defaultValue: 1 }
});

// Relacionamento com Categoria usando alias
Produto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'Categorium' });
Categoria.hasMany(Produto, { foreignKey: 'categoriaId', as: 'Produtos' });

module.exports = Produto;
