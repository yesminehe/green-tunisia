// Configuration centralisée de l'application.
// Toute valeur d'environnement est lue et validée ici, une seule fois,
// afin que les routes/services n'aient jamais à toucher process.env directement.
require('dotenv').config();

function lireNombre(valeur, defaut) {
  const n = Number(valeur);
  return Number.isFinite(n) && n > 0 ? n : defaut;
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// En production, l'absence de JWT_SECRET doit faire échouer le démarrage,
// jamais être silencieusement compensée par un secret codé en dur.
if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET doit être défini en production');
}

const config = {
  env: NODE_ENV,
  isProduction,

  port: lireNombre(process.env.PORT, 5000),

  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ghars',

  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],

  jwt: {
    // Secret de développement explicite (non codé en dur dans les routes).
    // En production, JWT_SECRET est obligatoire (voir vérification ci-dessus).
    secret: process.env.JWT_SECRET || 'dev-secret-a-changer-en-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  arrosage: {
    seuilJoursDefaut: lireNombre(process.env.ARROSAGE_SEUIL_JOURS, 7),
    intervalleMinutes: lireNombre(process.env.ARROSAGE_INTERVALLE_MINUTES, 60),
    seuilUrgenceJours: 14,
  },

  mission: {
    rayonKmDefaut: 5,
    seuilUrgenceJours: 10,
  },

  sécurité: {
    jsonLimit: '1mb',
    // Limite globale de requêtes (anti-bruteforce de base)
    api: {
      fenetreMinutes: 15,
      maxRequetes: 300,
    },
    // Limite stricte sur l'authentification
    auth: {
      fenetreMinutes: 15,
      maxRequetes: 20,
    },
  },
};

module.exports = config;