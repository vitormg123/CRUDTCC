const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const { sequelize, syncModels, Usuario, Categoria, Produto } = require('./src/models');

const app = express();
const PORT = 3000;

// Configurações do Express
app.set('view engine', 'pug');
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

// Servir uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Rotas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const perfilRoutes = require('./src/routes/perfilRoutes');
const perfilAdminRoutes = require('./src/routes/perfilAdminRoutes');
const authRoutes = require('./src/routes/authRoutes');
const carrinhoRoutes = require('./src/routes/carrinhoRoutes');

// Middleware de autenticação
function requireAdmin(req, res, next) {
  if (req.session && req.session.tipo === 'admin') return next();
  return res.redirect('/login');
}

function requireAuth(req, res, next) {
  if (req.session && req.session.usuarioId) return next();
  return res.redirect('/login');
}

// Rotas
app.use(authRoutes);

app.use('/usuarios', (req, res, next) => {
  if (
    req.path === '/novo' || req.path === '/novo/' ||
    (req.method === 'POST' && /\/deletar$/.test(req.path))
  ) return next();
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
  try {
    const maisDeUmUsuario = await temMaisDeUmUsuario();
    const categorias = await Categoria.findAll();
    
    const produtosRaw = await Produto.findAll({ 
      include: { model: Categoria, as: 'Categorium' } 
    });

    // Converte JSON de imagens para array
    const produtos = produtosRaw.map(prod => {
      const imagens = prod.imagens ? JSON.parse(prod.imagens) : [];
      return { ...prod.toJSON(), imagens };
    });

    const mensagemSucesso = req.session.mensagemSucesso;
    req.session.mensagemSucesso = null;

    res.render('index', { 
      usuario: req.session, 
      maisDeUmUsuario, 
      categorias, 
      produtos,
      mensagemSucesso 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar a página inicial");
  }
});

// Inicializa banco e servidor
syncModels().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
