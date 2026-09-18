const express = require('express');
const router = express.Router();
const Campagne = require('../models/Campagne');
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

// GET toutes les campagnes
router.get('/', async (req, res) => {
  try {
    const { statut, type, ville } = req.query;
    const filtres = { visible: true };
    
    if (statut) filtres.statut = statut;
    if (type) filtres.type = type;
    if (ville) filtres['localisation.ville'] = new RegExp(ville, 'i');
    
    const campagnes = await Campagne.find(filtres)
      .populate('organisateur', 'nom prenom')
      .populate('zone', 'nom')
      .populate('partenaire', 'nomEntreprise logo')
      .populate('evenement', 'titre date')
      .sort({ createdAt: -1 });
    
    res.json(campagnes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET une campagne par ID
router.get('/:id', async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id)
      .populate('organisateur', 'nom prenom email')
      .populate('zone', 'nom description localisation')
      .populate('partenaire', 'nomEntreprise description logo niveauPartenariat')
      .populate('evenement', 'titre date localisation')
      .populate('donateurs.utilisateur', 'nom prenom photoProfil')
      .populate('arbres', 'type localisation statut');
    
    if (!campagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    
    res.json(campagne);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST créer une nouvelle campagne (protégé)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const campagneData = {
      ...req.body,
      organisateur: req.utilisateur.id
    };
    
    const campagne = new Campagne(campagneData);
    await campagne.save();
    
    const campagneComplete = await Campagne.findById(campagne._id)
      .populate('organisateur', 'nom prenom')
      .populate('zone', 'nom');
    
    res.status(201).json(campagneComplete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT mettre à jour une campagne (protégé)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id);
    
    if (!campagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    
    // Vérifier que l'utilisateur est l'organisateur ou un admin
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (campagne.organisateur.toString() !== req.utilisateur.id && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    Object.assign(campagne, req.body);
    await campagne.save();
    
    res.json(campagne);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE supprimer une campagne (protégé)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id);
    
    if (!campagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    
    // Vérifier que l'utilisateur est l'organisateur ou un admin
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (campagne.organisateur.toString() !== req.utilisateur.id && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    await Campagne.findByIdAndDelete(req.params.id);
    res.json({ message: 'Campagne supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST faire un don à une campagne (protégé)
router.post('/:id/don', authMiddleware, async (req, res) => {
  try {
    const { montant, anonyme, message } = req.body;
    const campagne = await Campagne.findById(req.params.id);
    
    if (!campagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    
    if (!campagne.estActive()) {
      return res.status(400).json({ message: 'Cette campagne n\'est pas active' });
    }
    
    await campagne.ajouterDon(req.utilisateur.id, montant, anonyme, message);
    
    // Mettre à jour les statistiques de l'utilisateur
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    utilisateur.statistiques.donnees += montant;
    utilisateur.calculerScoreImpact();
    await utilisateur.save();
    
    // Calculer le nombre d'arbres financés par ce don
    const arbresFinances = Math.floor(montant / 20);
    
    res.json({
      message: 'Don enregistré avec succès',
      campagne,
      arbresFinances,
      scoreImpact: utilisateur.scoreImpact
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST attribuer des arbres à un donateur (protégé, admin)
router.post('/:id/attribuer-arbres', authMiddleware, async (req, res) => {
  try {
    const { donateurId, arbresIds } = req.body;
    const campagne = await Campagne.findById(req.params.id);
    
    if (!campagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    
    // Vérifier que l'utilisateur est admin
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    await campagne.attribuerArbres(donateurId, arbresIds);
    
    res.json({ message: 'Arbres attribués avec succès', campagne });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET campagnes actives
router.get('/actives/list', async (req, res) => {
  try {
    const campagnes = await Campagne.find({
      statut: 'active',
      visible: true
    })
      .populate('organisateur', 'nom prenom')
      .populate('zone', 'nom')
      .populate('partenaire', 'nomEntreprise logo')
      .sort({ 'objectifs.dateFin': 1 });
    
    res.json(campagnes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET campagnes par partenaire
router.get('/partenaire/:partenaireId', async (req, res) => {
  try {
    const campagnes = await Campagne.find({
      partenaire: req.params.partenaireId,
      visible: true
    })
      .populate('organisateur', 'nom prenom')
      .populate('zone', 'nom')
      .sort({ createdAt: -1 });
    
    res.json(campagnes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT activer une campagne (protégé)
router.put('/:id/activer', authMiddleware, async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id);
    
    if (!campagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    
    // Vérifier que l'utilisateur est l'organisateur ou un admin
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (campagne.organisateur.toString() !== req.utilisateur.id && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    campagne.statut = 'active';
    await campagne.save();
    
    res.json({ message: 'Campagne activée', campagne });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT mettre en pause une campagne (protégé)
router.put('/:id/pause', authMiddleware, async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id);
    
    if (!campagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    
    // Vérifier que l'utilisateur est l'organisateur ou un admin
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (campagne.organisateur.toString() !== req.utilisateur.id && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    campagne.statut = 'pause';
    await campagne.save();
    
    res.json({ message: 'Campagne mise en pause', campagne });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET donateurs d'une campagne
router.get('/:id/donateurs', async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id)
      .populate('donateurs.utilisateur', 'nom prenom photoProfil');
    
    if (!campagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    
    // Filtrer les donateurs anonymes si demandé
    const { inclureAnonymes } = req.query;
    let donateurs = campagne.donateurs;
    
    if (inclureAnonymes !== 'true') {
      donateurs = campagne.donateurs.filter(d => !d.anonyme);
    }
    
    res.json(donateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;