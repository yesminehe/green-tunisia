const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  // Informations de base
  nom: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Catégorie du badge
  categorie: {
    type: String,
    enum: ['plantation', 'arrosage', 'don', 'evenement', 'engagement', 'special'],
    required: true
  },
  
  // Icône/emoji du badge
  icone: {
    type: String,
    required: true
  },
  
  // Niveau de rareté
  rarete: {
    type: String,
    enum: ['commun', 'rare', 'epique', 'legendaire'],
    default: 'commun'
  },
  
  // Conditions pour obtenir le badge
  conditions: {
    type: {
      type: String,
      enum: ['arbres_plantes', 'eau_apportee', 'don_montant', 'evenements_participes', 'arbres_adoptes', 'score_impact', 'special'],
      required: true
    },
    valeur: {
      type: Number,
      required: true
    },
    descriptionCondition: {
      type: String,
      required: true
    }
  },
  
  // Points supplémentaires accordés par le badge
  pointsBonus: {
    type: Number,
    default: 0
  },
  
  // Statut
  actif: {
    type: Boolean,
    default: true
  },
  
  // Ordre d'affichage
  ordre: {
    type: Number,
    default: 0
  },
  
  // Date de création
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour la recherche par catégorie
badgeSchema.index({ categorie: 1 });

// Index pour la recherche par rareté
badgeSchema.index({ rarete: 1 });

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;