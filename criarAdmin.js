// criarAdmin.js
const bcrypt = require('bcryptjs');
const Usuario = require('./src/models/Usuario'); // caminho correto para seu model

async function criarAdmin() {
  try {
    // Criptografa a senha
    const senhaHash = await bcrypt.hash('25292529', 10);

    // Verifica se o admin já existe
    const adminExistente = await Usuario.findOne({ 
      where: { email: 'herancasdosul@gmail.com' } 
    });

    if (adminExistente) {
      console.log('Admin já existe no banco.');
      return;
    }

    // Cria o admin
    await Usuario.create({
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
      cidade: 'Forquilha do Cedro'
    });

    console.log('Admin criado com sucesso!');
  } catch (err) {
    console.error('Erro ao criar admin:', err);
  }
}

// Executa a função
criarAdmin();
