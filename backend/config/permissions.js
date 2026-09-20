// Système de permissions et rôles pour Green Tunisia

// Rôles disponibles
const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'membre'
};

// Activités disponibles pour les membres
const ACTIVITES = {
  MONEY_DONOR: 'MONEY_DONOR',
  TREE_DONOR: 'TREE_DONOR',
  PLANTER: 'PLANTER',
  WATERER: 'WATERER'
};

// Permissions par rôle
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'manage_members',
    'accept_reject_membership',
    'suspend_members',
    'manage_trees',
    'validate_planting',
    'validate_watering',
    'manage_donations',
    'manage_zones',
    'manage_campaigns',
    'view_statistics',
    'view_audit_history',
    // Inherit all member permissions
    'view_public_trees',
    'report_planted_tree',
    'report_watering',
    'make_contribution',
    'report_zone',
    'participate_campaigns',
    'view_own_activity'
  ],
  [ROLES.MEMBER]: [
    'view_public_trees',
    'report_planted_tree',
    'report_watering',
    'make_contribution',
    'report_zone',
    'participate_campaigns',
    'view_own_activity'
  ]
};

// Permissions par activité
const ACTIVITE_PERMISSIONS = {
  [ACTIVITES.MONEY_DONOR]: ['make_contribution'],
  [ACTIVITES.TREE_DONOR]: ['make_contribution'],
  [ACTIVITES.PLANTER]: ['report_planted_tree', 'participate_campaigns'],
  [ACTIVITES.WATERER]: ['report_watering', 'participate_campaigns']
};

// Vérifier si un rôle a une permission spécifique
const roleHasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

// Vérifier si une activité permet une permission spécifique
const activiteHasPermission = (activite, permission) => {
  const permissions = ACTIVITE_PERMISSIONS[activite] || [];
  return permissions.includes(permission);
};

// Obtenir toutes les permissions d'un utilisateur (rôle + activités)
const getUserPermissions = (user) => {
  if (!user) return [];
  
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  const activitePermissions = [];
  
  if (user.activites && Array.isArray(user.activites)) {
    user.activites.forEach(activite => {
      const perms = ACTIVITE_PERMISSIONS[activite] || [];
      activitePermissions.push(...perms);
    });
  }
  
  // Combiner les permissions du rôle et des activités (sans doublons)
  return [...new Set([...rolePermissions, ...activitePermissions])];
};

// Vérifier si un utilisateur a une permission spécifique
const userHasPermission = (user, permission) => {
  const permissions = getUserPermissions(user);
  return permissions.includes(permission);
};

module.exports = {
  ROLES,
  ACTIVITES,
  ROLE_PERMISSIONS,
  ACTIVITE_PERMISSIONS,
  roleHasPermission,
  activiteHasPermission,
  getUserPermissions,
  userHasPermission
};