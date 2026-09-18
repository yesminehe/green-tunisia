const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');
const Arbre = require('../models/Arbre');
const Badge = require('../models/Badge');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

// Middleware pour vérifier le token JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.utilisateur = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// POST inscription
router.post('/inscription', async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, telephone, preferencesParticipation } = req.body;
    
    // Vérifier si l'email existe déjà
    const utilisateurExistant = await Utilisateur.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const motDePasseHash = await bcrypt.hash(motDePasse, 10);
    
    // Créer l'utilisateur
    const utilisateur = new Utilisateur({
      nom,
      prenom,
      email,
      motDePasse: motDePasseHash,
      telephone,
      preferencesParticipation
    });
    
    await utilisateur.save();
    
    // Générer le token
    const token = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Inscription réussie',
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        preferencesParticipation: utilisateur.preferencesParticipation
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST connexion
router.post('/connexion', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    
    // Trouver l'utilisateur
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Mettre à jour la dernière connexion
    utilisateur.derniereConnexion = new Date();
    await utilisateur.save();
    
    // Générer le token
    const token = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        preferencesParticipation: utilisateur.preferencesParticipation,
        role: utilisateur.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET profil utilisateur (protégé)
router.get('/profil', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id)
      .select('-motDePasse')
      .populate('badges')
      .populate('arbresAdoptes.arbre');
    
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT mettre à jour le profil (protégé)
router.put('/profil', authMiddleware, async (req, res) => {
  try {
    const { nom, prenom, telephone, photoProfil, preferencesParticipation, localisation } = req.body;
    
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    if (nom) utilisateur.nom = nom;
    if (prenom) utilisateur.prenom = prenom;
    if (telephone) utilisateur.telephone = telephone;
    if (photoProfil) utilisateur.photoProfil = photoProfil;
    if (preferencesParticipation) utilisateur.preferencesParticipation = preferencesParticipation;
    if (localisation) utilisateur.localisation = localisation;
    
    await utilisateur.save();
    
    res.json({
      message: 'Profil mis à jour',
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        telephone: utilisateur.telephone,
        photoProfil: utilisateur.photoProfil,
        preferencesParticipation: utilisateur.preferencesParticipation,
        localisation: utilisateur.localisation
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST adopter un arbre (protégé)
router.post('/adopter-arbre/:arbreId', authMiddleware, async (req, res) => {
  try {
    const { duree } = req.body;
    
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    const arbre = await Arbre.findById(req.params.arbreId);
    
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }
    
    if (arbre.adoption.adopte) {
      return res.status(400).json({ message: 'Cet arbre est déjà adopté' });
    }
    
    // Adopter l'arbre
    arbre.adoption.adopte = true;
    arbre.adoption.parrain = utilisateur._id;
    arbre.adoption.dateAdoption = new Date();
    arbre.adoption.dureeAdoption = duree || 12;
    arbre.adoption.dateFinAdoption = new Date(Date.now() + (duree || 12) * 30 * 24 * 60 * 60 * 1000);
    
    await arbre.save();
    
    // Ajouter à l'utilisateur
    utilisateur.arbresAdoptes.push({
      arbre: arbre._id,
      dateAdoption: new Date()
    });
    utilisateur.statistiques.arbresAdoptes += 1;
    
    // Recalculer le score d'impact
    utilisateur.calculerScoreImpact();
    
    await utilisateur.save();
    
    // Vérifier et attribuer les badges
    await verifierEtAttribuerBadges(utilisateur);
    
    res.json({
      message: 'Arbre adopté avec succès',
      arbre,
      scoreImpact: utilisateur.scoreImpact
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET statistiques utilisateur (protégé)
router.get('/statistiques', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id)
      .select('-motDePasse')
      .populate('badges');
    
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Calculer le score d'impact
    const scoreImpact = utilisateur.calculerScoreImpact();
    
    res.json({
      statistiques: utilisateur.statistiques,
      scoreImpact,
      badges: utilisateur.badges,
      arbresAdoptes: utilisateur.arbresAdoptes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET classement (protégé)
router.get('/classement', authMiddleware, async (req, res) => {
  try {
    const classement = await Utilisateur.find()
      .select('nom prenom scoreImpact statistiques')
      .sort({ scoreImpact: -1 })
      .limit(50);
    
    // Trouver le rang de l'utilisateur actuel
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    const rang = classement.findIndex(u => u._id.toString() === utilisateur._id.toString()) + 1;
    
    res.json({
      classement,
      rangUtilisateur: rang > 0 ? rang : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fonction pour vérifier et attribuer les badges
async function verifierEtAttribuerBadges(utilisateur) {
  const badges = await Badge.find({ actif: true });
  const stats = utilisateur.statistiques;
  
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
    }
  }
  
  await utilisateur.save();
}

module.exports = router;