const express = require('express');
const router = express.Router();
const Evenement = require('../models/Evenement');
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

// GET tous les événements
router.get('/', async (req, res) => {
  try {
    const { statut, type, ville } = req.query;
    const filtres = {};
    
    if (statut) filtres.statut = statut;
    if (type) filtres.type = type;
    if (ville) filtres['localisation.ville'] = new RegExp(ville, 'i');
    
    const evenements = await Evenement.find(filtres)
      .populate('organisateur', 'nom prenom email')
      .populate('participants.utilisateur', 'nom prenom photoProfil')
      .populate('zone', 'nom')
      .sort({ date: 1 });
    
    res.json(evenements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET un événement par ID
router.get('/:id', async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id)
      .populate('organisateur', 'nom prenom email telephone')
      .populate('participants.utilisateur', 'nom prenom photoProfil email')
      .populate('zone', 'nom description localisation');
    
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    res.json(evenement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST créer un nouvel événement (protégé)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const evenementData = {
      ...req.body,
      organisateur: req.utilisateur.id
    };
    
    const evenement = new Evenement(evenementData);
    await evenement.save();
    
    // Ajouter l'organisateur comme participant
    evenement.participants.push({
      utilisateur: req.utilisateur.id,
      dateInscription: new Date(),
      statut: 'confirme'
    });
    await evenement.save();
    
    const evenementComplet = await Evenement.findById(evenement._id)
      .populate('organisateur', 'nom prenom email')
      .populate('zone', 'nom');
    
    res.status(201).json(evenementComplet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT mettre à jour un événement (protégé)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    // Vérifier que l'utilisateur est l'organisateur ou un admin
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (evenement.organisateur.toString() !== req.utilisateur.id && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    Object.assign(evenement, req.body);
    await evenement.save();
    
    res.json(evenement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE supprimer un événement (protégé)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    // Vérifier que l'utilisateur est l'organisateur ou un admin
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (evenement.organisateur.toString() !== req.utilisateur.id && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    await Evenement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST s'inscrire à un événement (protégé)
router.post('/:id/inscription', authMiddleware, async (req, res) => {
  try {
    const { contribution } = req.body;
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    if (evenement.statut === 'annule' || evenement.statut === 'termine') {
      return res.status(400).json({ message: 'Impossible de s\'inscrire à cet événement' });
    }
    
    if (evenement.estComplet()) {
      return res.status(400).json({ message: 'L\'événement est complet' });
    }
    
    await evenement.ajouterParticipant(req.utilisateur.id);
    
    // Mettre à jour les statistiques de l'utilisateur
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    utilisateur.statistiques.evenementsParticipes += 1;
    utilisateur.calculerScoreImpact();
    await utilisateur.save();
    
    res.json({ message: 'Inscription réussie', evenement });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST se désinscrire d'un événement (protégé)
router.delete('/:id/inscription', authMiddleware, async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    const participantIndex = evenement.participants.findIndex(
      p => p.utilisateur.toString() === req.utilisateur.id
    );
    
    if (participantIndex === -1) {
      return res.status(400).json({ message: 'Vous n\'êtes pas inscrit à cet événement' });
    }
    
    evenement.participants.splice(participantIndex, 1);
    await evenement.save();
    
    // Mettre à jour les statistiques de l'utilisateur
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    utilisateur.statistiques.evenementsParticipes = Math.max(0, utilisateur.statistiques.evenementsParticipes - 1);
    utilisateur.calculerScoreImpact();
    await utilisateur.save();
    
    res.json({ message: 'Désinscription réussie' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT mettre à jour le statut d'un participant (protégé, admin)
router.put('/:id/participants/:participantId/statut', authMiddleware, async (req, res) => {
  try {
    const { statut } = req.body;
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    // Vérifier que l'utilisateur est admin
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    const participant = evenement.participants.id(req.params.participantId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant non trouvé' });
    }
    
    participant.statut = statut;
    await evenement.save();
    
    res.json({ message: 'Statut mis à jour', evenement });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST ajouter des résultats à un événement (protégé)
router.post('/:id/resultats', authMiddleware, async (req, res) => {
  try {
    const { nombreArbresPlantes, nombreParticipants, budgetCollecte, litresEauApportes } = req.body;
    const evenement = await Evenement.findById(req.params.id);
    
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    // Vérifier que l'utilisateur est l'organisateur ou un admin
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (evenement.organisateur.toString() !== req.utilisateur.id && utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    if (nombreArbresPlantes !== undefined) evenement.resultats.nombreArbresPlantes = nombreArbresPlantes;
    if (nombreParticipants !== undefined) evenement.resultats.nombreParticipants = nombreParticipants;
    if (budgetCollecte !== undefined) evenement.resultats.budgetCollecte = budgetCollecte;
    if (litresEauApportes !== undefined) evenement.resultats.litresEauApportes = litresEauApportes;
    
    await evenement.save();
    
    res.json({ message: 'Résultats mis à jour', evenement });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET événements à venir
router.get('/upcoming/list', async (req, res) => {
  try {
    const maintenant = new Date();
    const evenements = await Evenement.find({
      date: { $gte: maintenant },
      statut: { $in: ['planifie', 'ouvert'] }
    })
      .populate('organisateur', 'nom prenom')
      .populate('zone', 'nom')
      .sort({ date: 1 })
      .limit(10);
    
    res.json(evenements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET événements par ville
router.get('/ville/:ville', async (req, res) => {
  try {
    const evenements = await Evenement.find({
      'localisation.ville': new RegExp(req.params.ville, 'i')
    })
      .populate('organisateur', 'nom prenom')
      .populate('zone', 'nom')
      .sort({ date: 1 });
    
    res.json(evenements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;