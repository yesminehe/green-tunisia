const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  // Informations de base
  nom: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Localisation (polygone pour délimiter la zone)
  localisation: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[[Number]]]], // Polygon GeoJSON format
      required: true
    },
    centre: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number]
      }
    },
    adresse: {
      type: String,
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
  
  // Statistiques de la zone
  statistiques: {
    nombreArbres: {
      type: Number,
      default: 0
    },
    nombreEspeces: {
      type: Number,
      default: 0
    },
    litresEau: {
      type: Number,
      default: 0
    },
    nombreParticipants: {
      type: Number,
      default: 0
    },
    arbresVivants: {
      type: Number,
      default: 0
    },
    arbresMorts: {
      type: Number,
      default: 0
    },
    arbresSurveillance: {
      type: Number,
      default: 0
    }
  },
  
  // Espèces présentes dans la zone
  especes: [{
    type: String,
    trim: true
  }],
  
  // État de la zone
  etat: {
    type: String,
    enum: ['correct', 'besoin_arrosage', 'critique'],
    default: 'correct'
  },
  
  // Alertes pour la zone
  alertes: [{
    type: {
      type: String,
      enum: ['arrosage', 'maladie', 'secheresse', 'autre']
    },
    description: {
      type: String,
      required: true
    },
    gravite: {
      type: String,
      enum: ['faible', 'moyenne', 'haute', 'critique']
    },
    dateCreation: {
      type: Date,
      default: Date.now
    },
    resolue: {
      type: Boolean,
      default: false
    },
    dateResolution: {
      type: Date
    }
  }],
  
  // Responsable de la zone
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur'
  },
  
  // Bénévoles actifs dans la zone
  benevoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur'
  }],
  
  // Photos de la zone
  photos: [{
    type: String,
    trim: true
  }],
  
  // Date de création de la zone
  dateCreation: {
    type: Date,
    default: Date.now
  },
  
  // Date de la dernière mise à jour
  derniereMiseAJour: {
    type: Date,
    default: Date.now
  },
  
  // Statut
  statut: {
    type: String,
    enum: ['active', 'en_developpement', 'suspendue', 'fermee'],
    default: 'active'
  }
});

// Index géospatial
zoneSchema.index({ localisation: '2dsphere' });

// Méthode pour calculer l'état de la zone
zoneSchema.methods.calculerEtat = function() {
  const stats = this.statistiques;
  const totalArbres = stats.nombreArbres;
  
  if (totalArbres === 0) {
    this.etat = 'correct';
    return this.etat;
  }
  
  // Calculer le pourcentage d'arbres qui n'ont pas été arrosés récemment
  const tauxArbresNonArroses = 0.1; 
  
  if (tauxArbresNonArroses > 0.3) {
    this.etat = 'critique';
  } else if (tauxArbresNonArroses > 0.15) {
    this.etat = 'besoin_arrosage';
  } else {
    this.etat = 'correct';
  }
  
  return this.etat;
};

// Méthode pour ajouter une alerte
zoneSchema.methods.ajouterAlerte = function(type, description, gravite) {
  this.alertes.push({
    type,
    description,
    gravite,
    dateCreation: new Date()
  });
  
  // Mettre à jour l'état de la zone si nécessaire
  if (gravite === 'critique' || gravite === 'haute') {
    this.etat = 'critique';
  } else if (gravite === 'moyenne' && this.etat === 'correct') {
    this.etat = 'besoin_arrosage';
  }
  
  return this.save();
};

// Méthode pour résoudre une alerte
zoneSchema.methods.resoudreAlerte = function(alerteId) {
  const alerte = this.alertes.id(alerteId);
  if (alerte) {
    alerte.resolue = true;
    alerte.dateResolution = new Date();
    
    // Recalculer l'état de la zone
    this.calculerEtat();
    
    return this.save();
  }
  throw new Error('Alerte non trouvée');
};

// Méthode pour mettre à jour les statistiques
zoneSchema.methods.mettreAJourStatistiques = async function() {
  const Arbre = mongoose.model('Arbre');
  const arbres = await Arbre.find({ zone: this._id });
  
  this.statistiques.nombreArbres = arbres.length;
  this.statistiques.arbresVivants = arbres.filter(a => a.statut === 'vivant').length;
  this.statistiques.arbresMorts = arbres.filter(a => a.statut === 'mort').length;
  this.statistiques.arbresSurveillance = arbres.filter(a => a.statut === 'à surveiller').length;
  this.statistiques.litresEau = arbres.reduce((sum, a) => sum + (a.quantiteEau || 0), 0);
  
  // Espèces uniques
  const especesUniques = [...new Set(arbres.map(a => a.type))];
  this.especes = especesUniques;
  this.statistiques.nombreEspeces = especesUniques.length;
  
  this.derniereMiseAJour = new Date();
  this.calculerEtat();
  
  return this.save();
};

const Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;