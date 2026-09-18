require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ghars', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion MongoDB:', err));

// Routes
app.use('/api/arbres', arbreRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/campagnes', campagneRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/alertes', alerteRoutes);
app.use('/api/missions', missionRoutes);

// Services d'arrière-plan
const AlerteArrosageService = require('./services/alerteArrosage');

// Démarrer le service d'alerte d'arrosage (vérification toutes les heures)
AlerteArrosageService.demarrer(60);

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
      missions: '/api/missions'
    }
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});