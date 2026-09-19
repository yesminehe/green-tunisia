const mongoose = require('mongoose');

// Sous-schéma du centre géométrique d'une zone.
// Déclaré en sous-schéma explicite : la forme d'objet inline avec un champ
// nommé `type` provoquait une erreur de casting Mongoose qui cassait la
// création des zones (conflit "type" vs champ "type").
const pointGeographiqueSchema = new mongoose.Schema({
  type: { type: String, enum: ['Point'], required: true, default: 'Point' },
  coordinates: { type: [Number], required: true, default: [0, 0] },
}, { _id: false });

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
      type: [[[Number]]], // Polygon GeoJSON : [ [ [lon, lat], ... ] ]
      required: true
    },
    centre: pointGeographiqueSchema,
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

// Méthode pour calculer l'état réel de la zone à partir des arbres en base.
// Uniquement les arbres vivants ou à surveiller sont comptés, en tenant compte
// de la date de plantation pour les arbres jamais arrosés.
zoneSchema.methods.calculerEtat = async function() {
  const Arbre = mongoose.model('Arbre');
  const totalArbres = await Arbre.countDocuments({ zone: this._id });
  if (totalArbres === 0) {
    this.etat = 'correct';
    return this.etat;
  }

  const dateLimite = new Date();
  dateLimite.setDate(dateLimite.getDate() - 7);

  const arbresNonArroses = await Arbre.countDocuments({
    zone: this._id,
    statut: { $in: ['vivant', 'à surveiller'] },
    $or: [
      { dateDernierArrosage: { $lt: dateLimite } },
      { dateDernierArrosage: null, datePlantation: { $lte: dateLimite } }
    ]
  });

  const tauxArbresNonArroses = arbresNonArroses / totalArbres;

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
zoneSchema.methods.resoudreAlerte = async function(alerteId) {
  const alerte = this.alertes.id(alerteId);
  if (!alerte) {
    throw new Error('Alerte non trouvée');
  }
  alerte.resolue = true;
  alerte.dateResolution = new Date();

  // Recalculer l'état réel de la zone
  await this.calculerEtat();

  return this.save();
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
  // Calculer l'état AVANT la sauvegarde pour persister le vrai état.
  await this.calculerEtat();

  return this.save();
};

const Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;