const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
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

// GET tous les badges
router.get('/', async (req, res) => {
  try {
    const { categorie, rarete } = req.query;
    const filtres = { actif: true };
    
    if (categorie) filtres.categorie = categorie;
    if (rarete) filtres.rarete = rarete;
    
    const badges = await Badge.find(filtres).sort({ ordre: 1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET un badge par ID
router.get('/:id', async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ message: 'Badge non trouvé' });
    }
    res.json(badge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST créer un nouveau badge (protégé, admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    const badge = new Badge(req.body);
    await badge.save();
    
    res.status(201).json(badge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT mettre à jour un badge (protégé, admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    const badge = await Badge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!badge) {
      return res.status(404).json({ message: 'Badge non trouvé' });
    }
    
    res.json(badge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE supprimer un badge (protégé, admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    const badge = await Badge.findByIdAndDelete(req.params.id);
    if (!badge) {
      return res.status(404).json({ message: 'Badge non trouvé' });
    }
    
    res.json({ message: 'Badge supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET badges d'un utilisateur (protégé)
router.get('/utilisateur/mes-badges', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id)
      .populate('badges');
    
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(utilisateur.badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET badges disponibles pour un utilisateur (ceux qu'il n'a pas encore)
router.get('/disponibles/pour-moi', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const tousLesBadges = await Badge.find({ actif: true });
    const badgesIds = utilisateur.badges.map(b => b.toString());
    
    const badgesDisponibles = tousLesBadges.filter(
      badge => !badgesIds.includes(badge._id.toString())
    );
    
    // Calculer la progression pour chaque badge
    const badgesAvecProgression = badgesDisponibles.map(badge => {
      let progression = 0;
      const stats = utilisateur.statistiques;
      
      switch (badge.conditions.type) {
        case 'arbres_plantes':
          progression = Math.min(100, (stats.arbresPlantes / badge.conditions.valeur) * 100);
          break;
        case 'eau_apportee':
          progression = Math.min(100, (stats.eauApportee / badge.conditions.valeur) * 100);
          break;
        case 'don_montant':
          progression = Math.min(100, (stats.donnees / badge.conditions.valeur) * 100);
          break;
        case 'evenements_participes':
          progression = Math.min(100, (stats.evenementsParticipes / badge.conditions.valeur) * 100);
          break;
        case 'arbres_adoptes':
          progression = Math.min(100, (stats.arbresAdoptes / badge.conditions.valeur) * 100);
          break;
        case 'score_impact':
          progression = Math.min(100, (utilisateur.scoreImpact / badge.conditions.valeur) * 100);
          break;
      }
      
      return {
        ...badge.toObject(),
        progression: Math.round(progression)
      };
    });
    
    // Trier par progression décroissante
    badgesAvecProgression.sort((a, b) => b.progression - a.progression);
    
    res.json(badgesAvecProgression);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST vérifier et attribuer les badges (protégé)
router.post('/verifier-attribution', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const badges = await Badge.find({ actif: true });
    const stats = utilisateur.statistiques;
    const nouveauxBadges = [];
    
    for (const badge of badges) {
      if (utilisateur.aBadge(badge._id)) continue;
      
      let badgeObtenu = false;
      
      switch (badge.conditions.type) {
        case 'arbres_plantes':
          if (stats.arbresPlantes >= badge.conditions.valeur) badgeObtenu = true;
          break;
        case 'eau_apportee':
          if (stats.eauApportee >= badge.conditions.valeur) badgeObtenu = true;
          break;
        case 'don_montant':
          if (stats.donnees >= badge.conditions.valeur) badgeObtenu = true;
          break;
        case 'evenements_participes':
          if (stats.evenementsParticipes >= badge.conditions.valeur) badgeObtenu = true;
          break;
        case 'arbres_adoptes':
          if (stats.arbresAdoptes >= badge.conditions.valeur) badgeObtenu = true;
          break;
        case 'score_impact':
          if (utilisateur.scoreImpact >= badge.conditions.valeur) badgeObtenu = true;
          break;
      }
      
      if (badgeObtenu) {
        utilisateur.badges.push(badge._id);
        utilisateur.scoreImpact += badge.pointsBonus;
        nouveauxBadges.push(badge);
      }
    }
    
    if (nouveauxBadges.length > 0) {
      await utilisateur.save();
    }
    
    res.json({
      message: `${nouveauxBadges.length} nouveau(x) badge(s) obtenu(s)`,
      nouveauxBadges,
      scoreImpact: utilisateur.scoreImpact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET classement par catégorie de badges
router.get('/classement/categorie/:categorie', async (req, res) => {
  try {
    const badges = await Badge.find({
      categorie: req.params.categorie,
      actif: true
    }).sort({ ordre: 1 });
    
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistiques globales des badges
router.get('/statistiques/globales', async (req, res) => {
  try {
    const totalBadges = await Badge.countDocuments({ actif: true });
    
    const badgesParCategorie = await Badge.aggregate([
      { $match: { actif: true } },
      {
        $group: {
          _id: '$categorie',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const badgesParRarete = await Badge.aggregate([
      { $match: { actif: true } },
      {
        $group: {
          _id: '$rarete',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Calculer le nombre total de badges attribués
    const utilisateurs = await Utilisateur.find();
    const totalBadgesAttribues = utilisateurs.reduce(
      (sum, user) => sum + user.badges.length,
      0
    );
    
    res.json({
      totalBadges,
      badgesParCategorie,
      badgesParRarete,
      totalBadgesAttribues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;