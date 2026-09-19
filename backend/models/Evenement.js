const mongoose = require('mongoose');

const evenementSchema = new mongoose.Schema({
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
  
  // Type d'événement
  type: {
    type: String,
    enum: ['plantation', 'arrosage', 'nettoyage', 'formation', 'autre'],
    default: 'plantation'
  },
  
  // Date et lieu
  date: {
    type: Date,
    required: true
  },
  heureDebut: {
    type: String,
    required: true
  },
  heureFin: {
    type: String
  },
  
  localisation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    adresse: {
      type: String,
      required: true,
      trim: true
    },
    ville: {
      type: String,
      required: true,
      trim: true
    },
    region: {
      type: String,
      trim: true
    }
  },
  
  // Objectifs
  objectifs: {
    nombreArbresCible: {
      type: Number,
      default: 0
    },
    nombreParticipantsCible: {
      type: Number,
      default: 0
    },
    budgetCible: {
      type: Number,
      default: 0
    }
  },
  
  // Résultats
  resultats: {
    nombreArbresPlantes: {
      type: Number,
      default: 0
    },
    nombreParticipants: {
      type: Number,
      default: 0
    },
    budgetCollecte: {
      type: Number,
      default: 0
    },
    litresEauApportes: {
      type: Number,
      default: 0
    }
  },
  
  // Participants
  participants: [{
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur'
    },
    dateInscription: {
      type: Date,
      default: Date.now
    },
    statut: {
      type: String,
      enum: ['inscrit', 'confirme', 'present', 'absent'],
      default: 'inscrit'
    },
    contribution: {
      type: String,
      trim: true
    }
  }],
  
  // Photos de l'événement
  photos: [{
    type: String,
    trim: true
  }],
  
  // Photos avant/après
  photosAvantApres: {
    avant: {
      type: String,
      trim: true
    },
    apres: {
      type: String,
      trim: true
    }
  },
  
  // Organisation
  organisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  
  // Statut
  statut: {
    type: String,
    enum: ['planifie', 'ouvert', 'complet', 'en_cours', 'termine', 'annule'],
    default: 'planifie'
  },
  
  // Capacité maximale
  capaciteMax: {
    type: Number,
    default: 50
  },
  
  // Zone concernée
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone'
  },
  
  // Notes et instructions
  instructions: {
    type: String,
    trim: true
  },
  
  // Matériel nécessaire
  materielNecessaire: [{
    type: String,
    trim: true
  }],
  
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

// Index géospatial
evenementSchema.index({ localisation: '2dsphere' });

// Index pour la recherche par date
evenementSchema.index({ date: 1 });

// Middleware pour mettre à jour la date de modification.
// Pas d'argument `next` : les hooks callback ont été retirés dans Mongoose 9.
evenementSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Méthode pour vérifier si l'événement est complet
evenementSchema.methods.estComplet = function() {
  return this.participants.length >= this.capaciteMax;
};

// Méthode pour ajouter un participant
evenementSchema.methods.ajouterParticipant = function(utilisateurId) {
  if (this.estComplet()) {
    throw new Error('L\'événement est complet');
  }
  
  const dejaInscrit = this.participants.some(
    p => p.utilisateur.toString() === utilisateurId.toString()
  );
  
  if (dejaInscrit) {
    throw new Error('L\'utilisateur est déjà inscrit');
  }
  
  this.participants.push({
    utilisateur: utilisateurId,
    dateInscription: new Date(),
    statut: 'inscrit'
  });
  
  return this.save();
};

// Méthode pour calculer le taux de réalisation
evenementSchema.methods.tauxRealisation = function() {
  if (this.objectifs.nombreArbresCible === 0) return 0;
  return Math.round((this.resultats.nombreArbresPlantes / this.objectifs.nombreArbresCible) * 100);
};

const Evenement = mongoose.model('Evenement', evenementSchema);

module.exports = Evenement;