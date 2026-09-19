require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const { notFound, errorHandler } = require('./middlewares/error');

const arbreRoutes = require('./routes/arbres');
const utilisateurRoutes = require('./routes/utilisateurs');
const evenementRoutes = require('./routes/evenements');
const zoneRoutes = require('./routes/zones');
const campagneRoutes = require('./routes/campagnes');
const dashboardRoutes = require('./routes/dashboard');
const badgeRoutes = require('./routes/badges');
const alerteRoutes = require('./routes/alertes');
const missionRoutes = require('./routes/missions');

const app = express();

// --- Sécurité & parsing ------------------------------------------------
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins === '*' ? true : config.corsOrigins,
}));
app.use(express.json({ limit: config.sécurité.jsonLimit }));
app.use(express.urlencoded({ extended: true, limit: config.sécurité.jsonLimit }));

// --- Rate limiting -------------------------------------------------------
// Limite globale sur toutes les routes API (anti-bruteforce de base)
const limiteurGlobal = rateLimit({
  windowMs: config.sécurité.api.fenetreMinutes * 60 * 1000,
  limit: config.sécurité.api.maxRequetes,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiteurGlobal);

// Limite stricte sur l'authentification
const limiteurAuth = rateLimit({
  windowMs: config.sécurité.auth.fenetreMinutes * 60 * 1000,
  limit: config.sécurité.auth.maxRequetes,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/utilisateurs/connexion', limiteurAuth);
app.use('/api/utilisateurs/inscription', limiteurAuth);

// --- Routes --------------------------------------------------------------
app.use('/api/arbres', arbreRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/campagnes', campagneRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/alertes', alerteRoutes);
app.use('/api/missions', missionRoutes);

// Santé du serveur (utilisé par le frontend pour vérifier la connexion)
app.get('/api/health', (req, res) => {
  const prêt = mongoose.connection.readyState === 1;
  const états = ['déconnecté', 'connecté', 'en connexion', 'en déconnexion'];
  res.status(prêt ? 200 : 503).json({
    statut: prêt ? 'ok' : 'base_de_donnees_indisponible',
    baseDeDonnees: états[mongoose.connection.readyState] || 'inconnu',
    horodatage: new Date().toISOString(),
  });
});

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: 'API Ghars - Plateforme de gestion des arbres',
    version: '1.0.0',
    endpoints: {
      arbres: '/api/arbres',
      utilisateurs: '/api/utilisateurs',
      evenements: '/api/evenements',
      zones: '/api/zones',
      campagnes: '/api/campagnes',
      dashboard: '/api/dashboard',
      badges: '/api/badges',
      alertes: '/api/alertes',
      missions: '/api/missions',
      sante: '/api/health'
    }
  });
});

// Routes inconnues & gestion d'erreurs centralisée
app.use(notFound);
app.use(errorHandler);

// --- Services d'arrière-plan ---------------------------------------------
const AlerteArrosageService = require('./services/alerteArrosage');

// Ne jamais laisser une erreur de tâche de fond faire tomber le serveur.
process.on('unhandledRejection', (raison) => {
  console.error('Promesse non gérée:', raison);
});

async function demarrerServeur() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connecté à MongoDB');

    app.listen(config.port, () => {
      console.log(`Serveur démarré sur le port ${config.port}`);
    });

    // Démarrer les services seulement une fois la base de données prête.
    AlerteArrosageService.demarrer(config.arrosage.intervalleMinutes);
  } catch (err) {
    console.error('Erreur fatale au démarrage:', err);
    process.exit(1);
  }
}

demarrerServeur();