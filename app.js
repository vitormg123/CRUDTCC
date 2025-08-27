const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const { sequelize, syncModels, Usuario, Categoria } = require('./src/models');

const app = express();
const PORT = 3000;

// Configurações do Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Sessão com Sequelize
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: 'herancasdosul_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 }
}));
sessionStore.sync();

// Rotas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const perfilRoutes = require('./src/routes/perfilRoutes');
const perfilAdminRoutes = require('./src/routes/perfilAdminRoutes');
const authRoutes = require('./src/routes/authRoutes');
const carrinhoRoutes = require('./src/routes/carrinhoRoutes');

// Middleware para proteger rotas de admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.tipo === 'admin') {
    return next();
  }
  return res.redirect('/login');
}

// Middleware para proteger rotas autenticadas
function requireAuth(req, res, next) {
  if (req.session && req.session.usuarioId) {
    return next();
  }
  return res.redirect('/login');
}

// Libera cadastro se não há usuários ou exige admin


// Rotas
app.use(authRoutes);

app.use('/usuarios', (req, res, next) => {
  if (
    req.path === '/novo' || req.path === '/novo/' ||
    (req.method === 'POST' && /\/deletar$/.test(req.path))
  ) {
    return next();
  }
  return requireAdmin(req, res, next);
}, usuarioRoutes);

app.use('/categorias', requireAdmin, categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/perfil', perfilRoutes);
app.use('/perfil-admin', perfilAdminRoutes);

const { temMaisDeUmUsuario } = require('./src/services/usuarioService');

// Rota principal
app.get('/', async (req, res) => {
  const maisDeUmUsuario = await temMaisDeUmUsuario();
  const categorias = await Categoria.findAll(); // envia categorias para o index.ejs

  // Captura mensagem de sucesso da sessão (opcional)
  const mensagemSucesso = req.session.mensagemSucesso;
  req.session.mensagemSucesso = null;

  res.render('index', { 
    usuario: req.session, 
    maisDeUmUsuario, 
    categorias, 
    mensagemSucesso 
  });
});

// Inicializa banco e servidor
syncModels().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
