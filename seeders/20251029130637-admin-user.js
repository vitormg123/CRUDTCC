'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const senhaHash = await bcrypt.hash('2529', 10); // senha padrão

    await queryInterface.bulkInsert('Usuarios', [{
      nome: 'Heranças do Sul',
      email: 'herancasdosul@gmail.com',
      senha: senhaHash,
      tipo: 'admin',
      telefone: '(48)988496497',
      rg: '14304756923',
      cep: '88965-000',
      municipio: 'Estrada Geral Forquilha do Cedro',
      pais: 'Brasil',
      estado: 'SC',
      cidade: 'Santa Rosa do Sul',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', { email: 'admin@herancasdosul.com' }, {});
  }
};
