const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  // Informations de base
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  motDePasse: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    trim: true
  },
  
  // Préférences de participation
  preferencesParticipation: {
    planter: {
      type: Boolean,
      default: false
    },
    arroser: {
      type: Boolean,
      default: false
    },
    donner: {
      type: Boolean,
      default: false
    },
    evenements: {
      type: Boolean,
      default: false
    }
  },
  
  // Statistiques du membre
  statistiques: {
    arbresPlantes: {
      type: Number,
      default: 0
    },
    eauApportee: {
      type: Number,
      default: 0
    },
    donnees: {
      type: Number,
      default: 0
    },
    evenementsParticipes: {
      type: Number,
      default: 0
    },
    arbresAdoptes: {
      type: Number,
      default: 0
    }
  },
  
  // Score d'impact
  scoreImpact: {
    type: Number,
    default: 0
  },
  
  // Badges obtenus
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  
  // Arbres adoptés/parrainés (sous-document : référence + métadonnées)
  arbresAdoptes: [{
    arbre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Arbre',
      required: true
    },
    dateAdoption: {
      type: Date,
      default: Date.now
    },
    dureeAdoption: {
      type: Number,
      min: 1,
      default: 12
    }
  }],
  
  // Position géographique (pour trouver les arbres à proximité)
  localisation: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
  },
  
  // Photo de profil
  photoProfil: {
    type: String,
    trim: true
  },
  
  // Rôle
  role: {
    type: String,
    default: 'membre'
  },

  // Activités du membre (pour les membres)
  activites: [{
    type: String,
    enum: ['MONEY_DONOR', 'TREE_DONOR', 'PLANTER', 'WATERER']
  }],

  // Compte actif (désactivation possible par un admin)
  actif: {
    type: Boolean,
    default: true
  },
  
  // Date de création
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Dernière connexion
  derniereConnexion: {
    type: Date,
    default: Date.now
  }
});

// Index pour la recherche géospatiale
utilisateurSchema.index({ localisation: '2dsphere' });

// Méthode pour calculer le score d'impact
utilisateurSchema.methods.calculerScoreImpact = function() {
  const stats = this.statistiques;
  const score = 
    (stats.arbresPlantes * 100) +
    (stats.eauApportee * 1) +
    (stats.donnees * 0.5) +
    (stats.evenementsParticipes * 20) +
    (stats.arbresAdoptes * 50);
  
  this.scoreImpact = Math.round(score);
  return this.scoreImpact;
};

// Méthode pour vérifier si l'utilisateur a un badge spécifique
utilisateurSchema.methods.aBadge = function(badgeId) {
  return this.badges.some(badge => badge.toString() === badgeId.toString());
};

// Méthode pour vérifier si l'utilisateur a une activité spécifique
utilisateurSchema.methods.hasActivite = function(activite) {
  return this.activites && this.activites.includes(activite);
};

// Méthode pour ajouter une activité
utilisateurSchema.methods.addActivite = function(activite) {
  if (!this.activites) {
    this.activites = [];
  }
  if (!this.activites.includes(activite)) {
    this.activites.push(activite);
  }
};

// Méthode pour supprimer une activité
utilisateurSchema.methods.removeActivite = function(activite) {
  if (this.activites) {
    this.activites = this.activites.filter(a => a !== activite);
  }
};

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;