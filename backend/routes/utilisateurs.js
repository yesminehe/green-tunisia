const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');
const Arbre = require('../models/Arbre');
const Badge = require('../models/Badge');
const { authMiddleware, requireAdmin, requirePermission, requireMember } = require('../middlewares/auth');
const { AppError, asyncHandler } = require('../middlewares/error');
const { ROLES, ACTIVITES } = require('../config/permissions');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

// POST inscription
router.post('/inscription', asyncHandler(async (req, res) => {
  const { nom, prenom, email, motDePasse, telephone, preferencesParticipation, activites } = req.body;
  
  // Vérifier si l'email existe déjà
  const utilisateurExistant = await Utilisateur.findOne({ email });
  if (utilisateurExistant) {
    throw new AppError(400, 'Cet email est déjà utilisé');
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
    preferencesParticipation,
    activites: activites || []
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
      role: utilisateur.role,
      activites: utilisateur.activites,
      preferencesParticipation: utilisateur.preferencesParticipation
    }
  });
}));

// POST connexion
router.post('/connexion', asyncHandler(async (req, res) => {
  const { email, motDePasse } = req.body;
  
  // Trouver l'utilisateur
  const utilisateur = await Utilisateur.findOne({ email });
  if (!utilisateur) {
    throw new AppError(401, 'Email ou mot de passe incorrect');
  }
  
  // Vérifier le mot de passe
  const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
  if (!motDePasseValide) {
    throw new AppError(401, 'Email ou mot de passe incorrect');
  }
  
  // Vérifier si le compte est actif
  if (!utilisateur.actif) {
    throw new AppError(403, 'Compte désactivé');
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
      role: utilisateur.role,
      activites: utilisateur.activites,
      preferencesParticipation: utilisateur.preferencesParticipation
    }
  });
}));

// GET profil utilisateur (protégé)
router.get('/profil', authMiddleware, asyncHandler(async (req, res) => {
  const utilisateur = await Utilisateur.findById(req.utilisateur.id)
    .select('-motDePasse')
    .populate('badges')
    .populate('arbresAdoptes.arbre');
  
  if (!utilisateur) {
    throw new AppError(404, 'Utilisateur non trouvé');
  }
  
  res.json(utilisateur);
}));

// PUT mettre à jour le profil (protégé)
router.put('/profil', authMiddleware, asyncHandler(async (req, res) => {
  const { nom, prenom, telephone, photoProfil, preferencesParticipation, localisation, activites } = req.body;
  
  const utilisateur = await Utilisateur.findById(req.utilisateur.id);
  if (!utilisateur) {
    throw new AppError(404, 'Utilisateur non trouvé');
  }
  
  if (nom) utilisateur.nom = nom;
  if (prenom) utilisateur.prenom = prenom;
  if (telephone) utilisateur.telephone = telephone;
  if (photoProfil) utilisateur.photoProfil = photoProfil;
  if (preferencesParticipation) utilisateur.preferencesParticipation = preferencesParticipation;
  if (localisation) utilisateur.localisation = localisation;
  if (activites) utilisateur.activites = activites;
  
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
      localisation: utilisateur.localisation,
      activites: utilisateur.activites
    }
  });
}));

// POST adopter un arbre (protégé)
router.post('/adopter-arbre/:arbreId', authMiddleware, requirePermission('report_planted_tree'), asyncHandler(async (req, res) => {
  const { duree } = req.body;
  
  const utilisateur = await Utilisateur.findById(req.utilisateur.id);
  const arbre = await Arbre.findById(req.params.arbreId);
  
  if (!arbre) {
    throw new AppError(404, 'Arbre non trouvé');
  }
  
  if (arbre.adoption.adopte) {
    throw new AppError(400, 'Cet arbre est déjà adopté');
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
}));

// GET statistiques utilisateur (protégé)
router.get('/statistiques', authMiddleware, requirePermission('view_own_activity'), asyncHandler(async (req, res) => {
  const utilisateur = await Utilisateur.findById(req.utilisateur.id)
    .select('-motDePasse')
    .populate('badges');
  
  if (!utilisateur) {
    throw new AppError(404, 'Utilisateur non trouvé');
  }
  
  // Calculer le score d'impact
  const scoreImpact = utilisateur.calculerScoreImpact();
  
  res.json({
    statistiques: utilisateur.statistiques,
    scoreImpact,
    badges: utilisateur.badges,
    arbresAdoptes: utilisateur.arbresAdoptes.length
  });
}));

// GET classement (protégé)
router.get('/classement', authMiddleware, requirePermission('view_statistics'), asyncHandler(async (req, res) => {
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
}));

// ADMIN ROUTES - Gestion des membres

// GET tous les utilisateurs (admin)
router.get('/admin/tous', authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  const utilisateurs = await Utilisateur.find()
    .select('-motDePasse')
    .sort({ createdAt: -1 });
  
  res.json(utilisateurs);
}));

// PUT suspendre/activer un utilisateur (admin)
router.put('/admin/:id/suspendre', authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  const utilisateur = await Utilisateur.findById(req.params.id);
  if (!utilisateur) {
    throw new AppError(404, 'Utilisateur non trouvé');
  }
  
  utilisateur.actif = !utilisateur.actif;
  await utilisateur.save();
  
  res.json({
    message: utilisateur.actif ? 'Utilisateur activé' : 'Utilisateur suspendu',
    utilisateur: {
      id: utilisateur._id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      actif: utilisateur.actif
    }
  });
}));

// PUT modifier le rôle d'un utilisateur (admin)
router.put('/admin/:id/role', authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  const validRoles = ['membre', 'admin'];
  if (!validRoles.includes(role)) {
    throw new AppError(400, 'Rôle invalide');
  }
  
  const utilisateur = await Utilisateur.findById(req.params.id);
  if (!utilisateur) {
    throw new AppError(404, 'Utilisateur non trouvé');
  }
  
  utilisateur.role = role;
  await utilisateur.save();
  
  res.json({
    message: 'Rôle modifié avec succès',
    utilisateur: {
      id: utilisateur._id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      role: utilisateur.role
    }
  });
}));

// PUT modifier les activités d'un utilisateur (admin)
router.put('/admin/:id/activites', authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  const { activites } = req.body;
  
  // Valider les activités
  const validActivites = activites.filter(act => Object.values(ACTIVITES).includes(act));
  if (validActivites.length !== activites.length) {
    throw new AppError(400, 'Activités invalides');
  }
  
  const utilisateur = await Utilisateur.findById(req.params.id);
  if (!utilisateur) {
    throw new AppError(404, 'Utilisateur non trouvé');
  }
  
  utilisateur.activites = validActivites;
  await utilisateur.save();
  
  res.json({
    message: 'Activités modifiées avec succès',
    utilisateur: {
      id: utilisateur._id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      activites: utilisateur.activites
    }
  });
}));

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