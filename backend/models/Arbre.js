const mongoose = require('mongoose');

const arbreSchema = new mongoose.Schema({
  // ID unique (automatiquement généré par MongoDB)
  
  // Type / espèce
  type: {
    type: String,
    required: true,
    trim: true
  },
  
  // Date de plantation
  datePlantation: {
    type: Date,
    required: true
  },
  
  // Âge lors de la plantation (en années)
  agePlantation: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Localisation (coordonnées GPS ou adresse)
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
      trim: true
    }
  },
  
  // Date du dernier arrosage
  dateDernierArrosage: {
    type: Date,
    default: null
  },
  
  // Quantité d'eau reçue (en litres)
  quantiteEau: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Nombre total d'arrosages
  nombreArrosages: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Statut : vivant / à surveiller / mort
  statut: {
    type: String,
    enum: ['vivant', 'à surveiller', 'mort'],
    default: 'vivant'
  },
  
  // Photos (tableau d'URLs)
  photos: [{
    type: String,
    trim: true
  }],
  
  // Historique (tableau d'événements)
  historique: [{
    date: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    utilisateur: {
      type: String,
      trim: true
    }
  }],
  
  // Personne ayant planté l'arbre
  planteur: {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    telephone: {
      type: String,
      trim: true
    }
  },
  
  // QR Code unique (ex: TN-SOU-00125)
  qrCode: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  // Adoption/Parrainage
  adoption: {
    adopte: {
      type: Boolean,
      default: false
    },
    parrain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur'
    },
    dateAdoption: {
      type: Date
    },
    dureeAdoption: {
      type: Number, // en mois
      default: 12
    },
    dateFinAdoption: {
      type: Date
    }
  },
  
  // Zone de plantation
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone'
  },
  
  // Journal de vie (timeline photos)
  journalVie: [{
    date: {
      type: Date,
      required: true
    },
    typeEvenement: {
      type: String,
      enum: ['plantation', 'arrosage', 'croissance', 'photo', 'evenement'],
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    photo: {
      type: String,
      trim: true
    },
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur'
    }
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

// Index géospatial pour les recherches par localisation
arbreSchema.index({ localisation: '2dsphere' });

// Middleware pour mettre à jour la date de modification
arbreSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Générer automatiquement le QR code s'il n'existe pas
  if (!this.qrCode) {
    const prefix = 'TN';
    const region = this.localisation.adresse ? this.localisation.adresse.substring(0, 3).toUpperCase() : 'XXX';
    const random = Math.floor(Math.random() * 90000) + 10000;
    this.qrCode = `${prefix}-${region}-${random}`;
  }
  
  next();
});

// Méthode pour calculer les jours depuis le dernier arrosage
arbreSchema.methods.joursDepuisDernierArrosage = function() {
  if (!this.dateDernierArrosage) return null;
  const aujourdHui = new Date();
  const dernierArrosage = new Date(this.dateDernierArrosage);
  const differenceTemps = aujourdHui - dernierArrosage;
  return Math.floor(differenceTemps / (1000 * 60 * 60 * 24));
};

// Méthode pour calculer la fréquence d'arrosage (jours entre arrosages)
arbreSchema.methods.frequenceArrosage = function() {
  if (this.nombreArrosages < 2 || !this.datePlantation) return null;
  const joursDepuisPlantation = Math.floor((new Date() - new Date(this.datePlantation)) / (1000 * 60 * 60 * 24));
  return Math.round(joursDepuisPlantation / this.nombreArrosages);
};

// Méthode pour vérifier si l'arbre a besoin d'arrosage
arbreSchema.methods.besoinArrosage = function(seuilJours = 7) {
  const jours = this.joursDepuisDernierArrosage();
  return jours !== null && jours >= seuilJours;
};

const Arbre = mongoose.model('Arbre', arbreSchema);

module.exports = Arbre;