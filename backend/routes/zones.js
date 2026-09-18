const express = require('express');
const router = express.Router();
const Zone = require('../models/Zone');
const Arbre = require('../models/Arbre');
const Utilisateur = require('../models/Utilisateur');

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

// GET toutes les zones
router.get('/', async (req, res) => {
  try {
    const { etat, ville, statut } = req.query;
    const filtres = {};
    
    if (etat) filtres.etat = etat;
    if (ville) filtres['localisation.ville'] = new RegExp(ville, 'i');
    if (statut) filtres.statut = statut;
    
    const zones = await Zone.find(filtres)
      .populate('responsable', 'nom prenom email photoProfil')
      .populate('benevoles', 'nom prenom photoProfil')
      .sort({ nom: 1 });
    
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET une zone par ID
router.get('/:id', async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id)
      .populate('responsable', 'nom prenom email telephone photoProfil')
      .populate('benevoles', 'nom prenom photoProfil email');
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    // Récupérer les arbres de la zone
    const arbres = await Arbre.find({ zone: req.params.id })
      .select('type statut dateDernierArrosage quantiteEau localisation');
    
    res.json({
      zone,
      arbres
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST créer une nouvelle zone (protégé)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    const zone = new Zone(req.body);
    await zone.save();
    
    const zoneComplete = await Zone.findById(zone._id)
      .populate('responsable', 'nom prenom email');
    
    res.status(201).json(zoneComplete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT mettre à jour une zone (protégé)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    const zone = await Zone.findById(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    // Vérifier les autorisations
    if (zone.responsable?.toString() !== req.utilisateur.id && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    Object.assign(zone, req.body);
    await zone.save();
    
    res.json(zone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE supprimer une zone (protégé)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    // Vérifier qu'il n'y a pas d'arbres dans la zone
    const arbresDansZone = await Arbre.countDocuments({ zone: req.params.id });
    if (arbresDansZone > 0) {
      return res.status(400).json({ message: 'Impossible de supprimer une zone contenant des arbres' });
    }
    
    await Zone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Zone supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST mettre à jour les statistiques d'une zone (protégé)
router.post('/:id/statistiques', authMiddleware, async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    await zone.mettreAJourStatistiques();
    
    res.json({ message: 'Statistiques mises à jour', zone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST ajouter une alerte à une zone (protégé)
router.post('/:id/alertes', authMiddleware, async (req, res) => {
  try {
    const { type, description, gravite } = req.body;
    const zone = await Zone.findById(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    await zone.ajouterAlerte(type, description, gravite);
    
    res.json({ message: 'Alerte ajoutée', zone });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT résoudre une alerte (protégé)
router.put('/:id/alertes/:alerteId/resoudre', authMiddleware, async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    await zone.resoudreAlerte(req.params.alerteId);
    
    res.json({ message: 'Alerte résolue', zone });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST ajouter un bénévole à une zone (protégé)
router.post('/:id/benevoles', authMiddleware, async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    const dejaBenevole = zone.benevoles.some(
      b => b.toString() === req.utilisateur.id
    );
    
    if (dejaBenevole) {
      return res.status(400).json({ message: 'Vous êtes déjà bénévole de cette zone' });
    }
    
    zone.benevoles.push(req.utilisateur.id);
    zone.statistiques.nombreParticipants += 1;
    await zone.save();
    
    res.json({ message: 'Bénévole ajouté', zone });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE retirer un bénévole d'une zone (protégé)
router.delete('/:id/benevoles', authMiddleware, async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    const benevoleIndex = zone.benevoles.findIndex(
      b => b.toString() === req.utilisateur.id
    );
    
    if (benevoleIndex === -1) {
      return res.status(400).json({ message: 'Vous n\'êtes pas bénévole de cette zone' });
    }
    
    zone.benevoles.splice(benevoleIndex, 1);
    zone.statistiques.nombreParticipants = Math.max(0, zone.statistiques.nombreParticipants - 1);
    await zone.save();
    
    res.json({ message: 'Bénévole retiré', zone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET zones nécessitant de l'aide
router.get('/aide/requise', async (req, res) => {
  try {
    const zones = await Zone.find({
      etat: { $in: ['besoin_arrosage', 'critique'] }
    })
      .populate('responsable', 'nom prenom')
      .sort({ etat: -1 });
    
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET arbres nécessitant un arrosage dans une zone
router.get('/:id/arbres-a-arroser', async (req, res) => {
  try {
    const seuilJours = parseInt(req.query.seuil) || 7;
    const zone = await Zone.findById(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    const arbres = await Arbre.find({ zone: req.params.id });
    const arbresAArroser = arbres.filter(arbre => arbre.besoinArrosage(seuilJours));
    
    // Ajouter les informations de distance depuis une position donnée
    const { longitude, latitude } = req.query;
    if (longitude && latitude) {
      arbresAArroser.forEach(arbre => {
        const distance = calculerDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          arbre.localisation.coordinates[1],
          arbre.localisation.coordinates[0]
        );
        arbre.distance = Math.round(distance * 1000); // en mètres
      });
      
      arbresAArroser.sort((a, b) => a.distance - b.distance);
    }
    
    res.json(arbresAArroser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fonction pour calculer la distance entre deux points (formule de Haversine)
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;