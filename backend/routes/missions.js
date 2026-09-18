const express = require('express');
const router = express.Router();
const MissionJourService = require('../services/missionJour');

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

// GET obtenir la mission du jour (protégé)
router.get('/ma-mission', authMiddleware, async (req, res) => {
  try {
    const { rayon } = req.query;
    const mission = await MissionJourService.genererMissionPourUtilisateur(
      req.utilisateur.id,
      parseFloat(rayon) || 5
    );
    
    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST valider la complétion d'une mission (protégé)
router.post('/valider', authMiddleware, async (req, res) => {
  try {
    const { arbresIds } = req.body;
    
    if (!arbresIds || !Array.isArray(arbresIds) || arbresIds.length === 0) {
      return res.status(400).json({ message: 'IDs des arbres requis' });
    }
    
    const resultat = await MissionJourService.validerMission(
      req.utilisateur.id,
      arbresIds
    );
    
    res.json(resultat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET statistiques des missions
router.get('/statistiques', async (req, res) => {
  try {
    const statistiques = await MissionJourService.obtenirStatistiquesMissions();
    res.json(statistiquesiques);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET mission pour une position spécifique (sans authentification)
router.get('/position', async (req, res) => {
  try {
    const { latitude, longitude, rayon } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude et longitude requises' });
    }
    
    // Créer un utilisateur temporaire pour la génération de mission
    const utilisateurTemporaire = {
      _id: 'temp',
      localisation: {
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    };
    
    // Utiliser le service directement avec les coordonnées
    const arbresUrgents = await MissionJourService.trouverArbresUrgentsProches(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(rayon) || 5
    );
    
    const mission = {
      titre: MissionJourService.genererTitreMission(arbresUrgents.length),
      description: MissionJourService.genererDescriptionMission(arbresUrgents),
      arbres: arbresUrgents.slice(0, 5),
      totalArbres: arbresUrgents.length,
      distanceTotale: MissionJourService.calculerDistanceTotale(arbresUrgents.slice(0, 5)),
      dureeEstimee: MissionJourService.estimerDuree(Math.min(5, arbresUrgents.length)),
      difficulte: MissionJourService.evaluerDifficulte(arbresUrgents.slice(0, 5)),
      pointsEstimes: MissionJourService.calculerPointsEstimes(arbresUrgents.slice(0, 5)),
      recommandations: MissionJourService.genererRecommandations(arbresUrgents.slice(0, 5))
    };
    
    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET missions disponibles dans une zone
router.get('/zone/:zoneId', async (req, res) => {
  try {
    const Zone = require('../models/Zone');
    const zone = await Zone.findById(req.params.zoneId);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    if (!zone.localisation.centre) {
      return res.status(400).json({ message: 'Centre de zone non défini' });
    }
    
    const latitude = zone.localisation.centre.coordinates[1];
    const longitude = zone.localisation.centre.coordinates[0];
    
    const arbresUrgents = await MissionJourService.trouverArbresUrgentsProches(
      latitude,
      longitude,
      10 // 10 km de rayon pour une zone
    );
    
    // Filtrer les arbres de cette zone
    const Arbre = require('../models/Arbre');
    const arbresZone = await Arbre.find({ zone: req.params.zoneId });
    const arbresZoneIds = arbresZone.map(a => a._id.toString());
    
    const arbresZoneUrgents = arbresUrgents.filter(arbre => 
      arbresZoneIds.includes(arbre._id.toString())
    );
    
    const mission = {
      zone: zone.nom,
      titre: `Mission zone ${zone.nom}`,
      description: `${arbresZoneUrgents.length} arbre(s) de cette zone nécessitent un arrosage`,
      arbres: arbresZoneUrgents.slice(0, 10),
      totalArbres: arbresZoneUrgents.length,
      difficulte: MissionJourService.evaluerDifficulte(arbresZoneUrgents.slice(0, 10)),
      pointsEstimes: MissionJourService.calculerPointsEstimes(arbresZoneUrgents.slice(0, 10))
    };
    
    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;