const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const { sequelize, syncModels } = require('./src/models');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: 'herancasdosul_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 }
}));
sessionStore.sync();


const usuarioRoutes = require('./src/routes/usuarioRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');

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


app.use(authRoutes);
app.use('/usuarios', requireAdmin, usuarioRoutes);
app.use('/categorias', requireAdmin, categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/carrinho', carrinhoRoutes);

app.get('/', (req, res) => {
  res.render('index', { usuario: req.session });
});

syncModels().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
