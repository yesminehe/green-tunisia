// Logique métier des badges, centralisée.
// La vérification d'attribution était dupliquée dans utilisateurs.js et badges.js.
const Badge = require('../models/Badge');

// Évalue si l'utilisateur remplit les conditions d'un badge donné.
function evaluerCondition(badge, utilisateur) {
  const stats = utilisateur.statistiques || {};
  const condition = badge.conditions;
  if (!condition || typeof condition.valeur !== 'number') return false;

  switch (condition.type) {
    case 'arbres_plantes':
      return (stats.arbresPlantes || 0) >= condition.valeur;
    case 'eau_apportee':
      return (stats.eauApportee || 0) >= condition.valeur;
    case 'don_montant':
      return (stats.donnees || 0) >= condition.valeur;
    case 'evenements_participes':
      return (stats.evenementsParticipes || 0) >= condition.valeur;
    case 'arbres_adoptes':
      return (stats.arbresAdoptes || 0) >= condition.valeur;
    case 'score_impact':
      return (utilisateur.scoreImpact || 0) >= condition.valeur;
    // Les badges 'special' sont attribués manuellement par un admin.
    case 'special':
      return false;
    default:
      return false;
  }
}

// Vérifie tous les badges actifs et attribue ceux dont l'utilisateur remplit
// les conditions. Retourne la liste des badges nouvellement attribués.
async function verifierEtAttribuerBadges(utilisateur) {
  const badges = await Badge.find({ actif: true });
  const nouveauxBadges = [];

  for (const badge of badges) {
    if (utilisateur.aBadge(badge._id)) continue;
    if (evaluerCondition(badge, utilisateur)) {
      utilisateur.badges.push(badge._id);
      utilisateur.scoreImpact = (utilisateur.scoreImpact || 0) + (badge.pointsBonus || 0);
      nouveauxBadges.push(badge);
    }
  }

  if (nouveauxBadges.length > 0) {
    await utilisateur.save();
  }

  return nouveauxBadges;
}

module.exports = { verifierEtAttribuerBadges, evaluerCondition };