const express = require('express');
const router = express.Router();
const AlerteArrosageService = require('../services/alerteArrosage');
const Arbre = require('../models/Arbre');

// Middleware pour vérifier l'authentification
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.utilisateur = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// POST déclencher une vérification manuelle des alertes (protégé, admin)
router.post('/verifier', authMiddleware, async (req, res) => {
  try {
    const Utilisateur = require('../models/Utilisateur');
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    
    if (utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    const { seuilJours } = req.body;
    const resultat = await AlerteArrosageService.verifierAlertes(seuilJours);
    
    res.json({
      message: 'Vérification des alertes terminée',
      resultat
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET arbres à arroser près d'une position
router.get('/arbres-proches', async (req, res) => {
  try {
    const { latitude, longitude, rayon, seuilJours } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude et longitude requises' });
    }
    
    const arbres = await AlerteArrosageService.obtenirArbresAArroserProches(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(rayon) || 5,
      parseInt(seuilJours) || 7
    );
    
    res.json(arbres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistiques d'arrosage
router.get('/statistiques', async (req, res) => {
  try {
    const statistiques = await AlerteArrosageService.obtenirStatistiquesArrosage();
    res.json(statistiques);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET alertes par utilisateur (protégé)
router.get('/mes-alertes', authMiddleware, async (req, res) => {
  try {
    const Utilisateur = require('../models/Utilisateur');
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    
    if (!utilisateur.localisation) {
      return res.status(400).json({ message: 'Localisation non définie' });
    }
    
    const arbres = await AlerteArrosageService.obtenirArbresAArroserProches(
      utilisateur.localisation.coordinates[1],
      utilisateur.localisation.coordinates[0],
      10, // 10 km de rayon
      7 // 7 jours sans arrosage
    );
    
    res.json({
      nombreArbres: arbres.length,
      arbres: arbres.slice(0, 10) // Limiter à 10 résultats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST déclarer un arrosage pour un arbre spécifique (protégé)
router.post('/declarer-arrosage/:arbreId', authMiddleware, async (req, res) => {
  try {
    const { quantite, photo, note } = req.body;
    const arbre = await Arbre.findById(req.params.arbreId);
    
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }
    
    // Enregistrer l'arrosage
    arbre.dateDernierArrosage = new Date();
    arbre.quantiteEau = (arbre.quantiteEau || 0) + (quantite || 0);
    arbre.nombreArrosages = (arbre.nombreArrosages || 0) + 1;
    
    // Ajouter à l'historique
    arbre.historique.push({
      action: 'arrosage',
      description: `Arrosage de ${quantite}L`,
      utilisateur: req.utilisateur.id,
      date: new Date()
    });
    
    // Ajouter au journal de vie
    arbre.journalVie.push({
      date: new Date(),
      typeEvenement: 'arrosage',
      description: `Arrosage de ${quantite}L`,
      photo: photo,
      utilisateur: req.utilisateur.id
    });
    
    await arbre.save();
    
    // Mettre à jour les statistiques de l'utilisateur
    const Utilisateur = require('../models/Utilisateur');
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    utilisateur.statistiques.eauApportee += quantite || 0;
    utilisateur.calculerScoreImpact();
    await utilisateur.save();
    
    res.json({
      message: 'Arrosage enregistré avec succès',
      arbre,
      scoreImpact: utilisateur.scoreImpact
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET arbres nécessitant une attention urgente
router.get('/urgence', async (req, res) => {
  try {
    const { limite = 20 } = req.query;
    
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - 14); // 14 jours sans arrosage
    
    const arbresUrgents = await Arbre.find({
      $or: [
        { dateDernierArrosage: { $lt: dateLimite } },
        { dateDernierArrosage: null }
      ],
      statut: { $in: ['vivant', 'à surveiller'] }
    })
      .select('type localisation dateDernierArrosage qrCode statut')
      .populate('zone', 'nom region etat')
      .limit(parseInt(limite))
      .sort({ dateDernierArrosage: 1 });
    
    // Calculer les jours sans arrosage pour chaque arbre
    arbresUrgents.forEach(arbre => {
      arbre.joursSansArrosage = arbre.joursDepuisDernierArrosage();
    });
    
    res.json(arbresUrgents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;