// Authentification et autorisation.
// Un seul endroit traite les JWT (remplace les 7 copies dupliquées dans les routes).
const jwt = require('jsonwebtoken');
const config = require('../config');
const { AppError, asyncHandler } = require('./error');
const Utilisateur = require('../models/Utilisateur');
const { userHasPermission, getUserPermissions } = require('../config/permissions');

// Vérifie le token JWT et injecte req.utilisateur (payload décodé).
const authMiddleware = asyncHandler(async (req, _res, next) => {
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError(401, 'Token manquant');
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    throw new AppError(401, 'Token manquant');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (_err) {
    throw new AppError(401, 'Token invalide ou expiré');
  }

  // Vérifier que l'utilisateur existe toujours (compte supprimé / rôle modifié).
  const utilisateur = await Utilisateur.findById(decoded.id).select('_id role actif activites');
  if (!utilisateur) {
    throw new AppError(401, 'Utilisateur introuvable');
  }
  if (utilisateur.actif === false) {
    throw new AppError(403, 'Compte désactivé');
  }

  req.utilisateur = {
    id: utilisateur._id.toString(),
    role: utilisateur.role,
    activites: utilisateur.activites || [],
    permissions: getUserPermissions(utilisateur),
  };
  next();
});

// Restreint l'accès aux utilisateurs ayant l'un des rôles donnés.
const requireRole = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.utilisateur) {
      throw new AppError(401, 'Authentification requise');
    }
    if (!roles.includes(req.utilisateur.role)) {
      throw new AppError(403, 'Non autorisé');
    }
    next();
  });

// Restreint l'accès aux utilisateurs ayant une permission spécifique
const requirePermission = (permission) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.utilisateur) {
      throw new AppError(401, 'Authentification requise');
    }
    if (!req.utilisateur.permissions || !req.utilisateur.permissions.includes(permission)) {
      throw new AppError(403, 'Permission insuffisante');
    }
    next();
  });

// Restreint l'accès aux administrateurs
const requireAdmin = requireRole('admin');

// Restreint l'accès aux membres (inclut les admins)
const requireMember = requireRole('membre', 'admin');

module.exports = { 
  authMiddleware, 
  requireRole, 
  requirePermission, 
  requireAdmin, 
  requireMember 
};