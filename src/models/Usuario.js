const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Usuario = sequelize.define('Usuario', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  senha: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  tipo: { 
    type: DataTypes.ENUM('admin', 'usuario'), 
    defaultValue: 'usuario' 
  },
  cep: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  pais: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    defaultValue: 'Brasil' 
  },
  estado: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  cidade: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  municipio: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  fotoPerfil: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
});

module.exports = Usuario;
