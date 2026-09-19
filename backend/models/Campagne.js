const mongoose = require('mongoose');

const campagneSchema = new mongoose.Schema({
  // Informations de base
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Type de campagne
  type: {
    type: String,
    enum: ['financement', 'plantation', 'entreprise'],
    default: 'financement'
  },
  
  // Objectifs
  objectifs: {
    montantCible: {
      type: Number,
      required: true
    },
    nombreArbresCible: {
      type: Number,
      default: 0
    },
    dateDebut: {
      type: Date,
      required: true
    },
    dateFin: {
      type: Date,
      required: true
    }
  },
  
  // Résultats
  resultats: {
    montantCollecte: {
      type: Number,
      default: 0
    },
    nombreArbresFinances: {
      type: Number,
      default: 0
    },
    nombreDonateurs: {
      type: Number,
      default: 0
    }
  },
  
  // Localisation cible
  localisation: {
    ville: {
      type: String,
      trim: true
    },
    region: {
      type: String,
      trim: true
    },
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone'
    }
  },
  
  // Zone géographique (pour les campagnes de plantation)
  zoneGeographique: {
    type: {
      type: String,
      enum: ['Polygon']
    },
    coordinates: {
      type: [[[[Number]]]]
    }
  },
  
  // Donateurs
  donateurs: [{
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur'
    },
    montant: {
      type: Number,
      required: true
    },
    dateDon: {
      type: Date,
      default: Date.now
    },
    anonyme: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      trim: true
    },
    arbresFinances: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Arbre'
    }]
  }],
  
  // Arbres associés à la campagne
  arbres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Arbre'
  }],
  
  // Événement associé
  evenement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evenement'
  },
  
  // Partenaire entreprise (si applicable)
  partenaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partenaire'
  },
  
  // Organisation
  organisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  
  // Images
  image: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  
  // Statut
  statut: {
    type: String,
    enum: ['brouillon', 'active', 'pause', 'terminee', 'annulee'],
    default: 'brouillon'
  },
  
  // Visibilité
  visible: {
    type: Boolean,
    default: true
  },
  
  // Niveaux de donation suggérés
  niveauxDon: [{
    montant: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    arbresEquivalents: {
      type: Number,
      default: 1
    }
  }],
  
  // Metas pour le partage
  partageSocial: {
    titre: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    }
  },
  
  // Dates de création et de modification
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour la recherche par statut
campagneSchema.index({ statut: 1 });

// Index pour la recherche par date
campagneSchema.index({ 'objectifs.dateDebut': 1, 'objectifs.dateFin': 1 });

// Middleware pour mettre à jour la date de modification.
// Pas d'argument `next` : les hooks callback ont été retirés dans Mongoose 9.
campagneSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Méthode pour calculer le pourcentage de réalisation
campagneSchema.methods.pourcentageRealisation = function() {
  if (this.objectifs.montantCible === 0) return 0;
  return Math.round((this.resultats.montantCollecte / this.objectifs.montantCible) * 100);
};

// Méthode pour vérifier si la campagne est active
campagneSchema.methods.estActive = function() {
  const maintenant = new Date();
  return this.statut === 'active' &&
         maintenant >= new Date(this.objectifs.dateDebut) &&
         maintenant <= new Date(this.objectifs.dateFin);
};

// Méthode pour ajouter un don
campagneSchema.methods.ajouterDon = function(utilisateurId, montant, anonyme = false, message = '') {
  const donateur = {
    utilisateur: utilisateurId,
    montant,
    anonyme,
    message,
    dateDon: new Date()
  };
  
  this.donateurs.push(donateur);
  this.resultats.montantCollecte += montant;
  this.resultats.nombreDonateurs += 1;
  
  // Calculer le nombre d'arbres financés (environ 20 DT par arbre)
  const arbresFinances = Math.floor(montant / 20);
  this.resultats.nombreArbresFinances += arbresFinances;
  
  return this.save();
};

// Méthode pour attribuer des arbres à un donateur
campagneSchema.methods.attribuerArbres = function(donateurId, arbresIds) {
  const donateur = this.donateurs.id(donateurId);
  if (donateur) {
    donateur.arbresFinances = arbresIds;
    return this.save();
  }
  throw new Error('Donateur non trouvé');
};

const Campagne = mongoose.model('Campagne', campagneSchema);

module.exports = Campagne;