const mongoose = require('mongoose');

const partenaireSchema = new mongoose.Schema({
  // Informations de l'entreprise
  nomEntreprise: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Contact
  contact: {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    telephone: {
      type: String,
      trim: true
    },
    poste: {
      type: String,
      trim: true
    }
  },
  
  // Adresse
  adresse: {
    rue: {
      type: String,
      trim: true
    },
    ville: {
      type: String,
      trim: true
    },
    codePostal: {
      type: String,
      trim: true
    },
    pays: {
      type: String,
      default: 'Tunisie',
      trim: true
    }
  },
  
  // Site web et réseaux sociaux
  siteWeb: {
    type: String,
    trim: true
  },
  reseauxSociaux: {
    linkedin: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    }
  },
  
  // Logo
  logo: {
    type: String,
    trim: true
  },
  
  // Niveau de partenariat
  niveauPartenariat: {
    type: String,
    enum: ['bronze', 'argent', 'or', 'platine'],
    default: 'bronze'
  },
  
  // Statistiques du partenaire
  statistiques: {
    arbresFinances: {
      type: Number,
      default: 0
    },
    montantTotal: {
      type: Number,
      default: 0
    },
    nombreCampagnes: {
      type: Number,
      default: 0
    },
    litresEau: {
      type: Number,
      default: 0
    },
    benevolesImpliques: {
      type: Number,
      default: 0
    }
  },
  
  // Campagnes associées
  campagnes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campagne'
  }],
  
  // Zones soutenues
  zones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone'
  }],
  
  // Événements sponsorisés
  evenements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evenement'
  }],
  
  // Historique des contributions
  historiqueContributions: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['financement', 'benevolat', 'materiel', 'autre']
    },
    description: {
      type: String,
      trim: true
    },
    montant: {
      type: Number
    },
    arbresConcernes: {
      type: Number
    }
  }],
  
  // Statut
  statut: {
    type: String,
    enum: ['prospect', 'actif', 'inactif', 'suspendu'],
    default: 'prospect'
  },
  
  // Date de début du partenariat
  dateDebutPartenariat: {
    type: Date
  },
  
  // Date de fin du partenariat
  dateFinPartenariat: {
    type: Date
  },
  
  // Visibilité sur la page publique
  visiblePubliquement: {
    type: Boolean,
    default: true
  },
  
  // Message personnalisé pour la page publique
  messagePublic: {
    type: String,
    trim: true
  },
  
  // Certificat de partenariat
  certificat: {
    emis: {
      type: Boolean,
      default: false
    },
    dateEmission: {
      type: Date
    },
    urlCertificat: {
      type: String,
      trim: true
    }
  },
  
  // Notes internes
  notesInternes: {
    type: String,
    trim: true
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
partenaireSchema.index({ statut: 1 });

// Index pour la recherche par niveau de partenariat
partenaireSchema.index({ niveauPartenariat: 1 });

// Middleware pour mettre à jour la date de modification
partenaireSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour mettre à jour les statistiques
partenaireSchema.methods.mettreAJourStatistiques = async function() {
  const Campagne = mongoose.model('Campagne');
  const Evenement = mongoose.model('Evenement');
  
  // Récupérer les campagnes du partenaire
  const campagnes = await Campagne.find({ partenaire: this._id });
  
  // Calculer les statistiques
  this.statistiques.nombreCampagnes = campagnes.length;
  this.statistiques.montantTotal = campagnes.reduce((sum, c) => sum + c.resultats.montantCollecte, 0);
  this.statistiques.arbresFinances = campagnes.reduce((sum, c) => sum + c.resultats.nombreArbresFinances, 0);
  
  // Récupérer les événements du partenaire
  const evenements = await Evenement.find({ _id: { $in: this.evenements } });
  this.statistiques.benevolesImpliques = evenements.reduce((sum, e) => sum + e.resultats.nombreParticipants, 0);
  
  return this.save();
};

// Méthode pour ajouter une contribution
partenaireSchema.methods.ajouterContribution = function(type, description, montant, arbresConcernes) {
  this.historiqueContributions.push({
    type,
    description,
    montant,
    arbresConcernes,
    date: new Date()
  });
  
  // Mettre à jour les statistiques
  if (montant) {
    this.statistiques.montantTotal += montant;
  }
  if (arbresConcernes) {
    this.statistiques.arbresFinances += arbresConcernes;
  }
  
  return this.save();
};

// Méthode pour activer le partenariat
partenaireSchema.methods.activerPartenariat = function() {
  this.statut = 'actif';
  this.dateDebutPartenariat = new Date();
  this.certificat.emis = true;
  this.certificat.dateEmission = new Date();
  return this.save();
};

const Partenaire = mongoose.model('Partenaire', partenaireSchema);

module.exports = Partenaire;