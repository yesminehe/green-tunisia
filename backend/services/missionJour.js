const Arbre = require('../models/Arbre');
const Utilisateur = require('../models/Utilisateur');
const Zone = require('../models/Zone');

class MissionJourService {
  // Générer la mission du jour pour un utilisateur
  async genererMissionPourUtilisateur(utilisateurId, rayonKm = 5) {
    try {
      const utilisateur = await Utilisateur.findById(utilisateurId);
      
      if (!utilisateur || !utilisateur.localisation) {
        throw new Error('Utilisateur non trouvé ou localisation non définie');
      }

      const latitude = utilisateur.localisation.coordinates[1];
      const longitude = utilisateur.localisation.coordinates[0];

      // Trouver les arbres nécessitant un arrosage urgent à proximité
      const arbresUrgents = await this.trouverArbresUrgentsProches(
        latitude,
        longitude,
        rayonKm
      );

      if (arbresUrgents.length === 0) {
        return {
          message: 'Aucune mission disponible pour le moment',
          arbres: [],
          total: 0
        };
      }

      // Limiter à 3-5 arbres pour la mission
      const arbresMission = arbresUrgents.slice(0, 5);

      // Calculer les informations de la mission
      const mission = {
        titre: this.genererTitreMission(arbresMission.length),
        description: this.genererDescriptionMission(arbresMission),
        arbres: arbresMission,
        totalArbres: arbresMission.length,
        distanceTotale: this.calculerDistanceTotale(arbresMission),
        dureeEstimee: this.estimerDuree(arbresMission.length),
        difficulte: this.evaluerDifficulte(arbresMission),
        pointsEstimes: this.calculerPointsEstimes(arbresMission),
        recommandations: this.genererRecommandations(arbresMission)
      };

      return mission;
    } catch (error) {
      console.error('Erreur lors de la génération de la mission:', error);
      throw error;
    }
  }

  // Trouver les arbres urgents proches
  async trouverArbresUrgentsProches(latitude, longitude, rayonKm) {
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - 10); // 10 jours sans arrosage

    const arbres = await Arbre.find({
      $or: [
        { dateDernierArrosage: { $lt: dateLimite } },
        { dateDernierArrosage: null }
      ],
      statut: { $in: ['vivant', 'à surveiller'] },
      localisation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: rayonKm * 1000
        }
      }
    })
      .select('type localisation dateDernierArrosage qrCode statut zone')
      .populate('zone', 'nom region etat');

    // Calculer la distance et les jours sans arrosage
    arbres.forEach(arbre => {
      const distance = this.calculerDistance(
        latitude,
        longitude,
        arbre.localisation.coordinates[1],
        arbre.localisation.coordinates[0]
      );
      arbre.distance = Math.round(distance * 1000); // en mètres
      arbre.joursSansArrosage = arbre.joursDepuisDernierArrosage();
    });

    // Trier par urgence (jours sans arrosage) puis par distance
    arbres.sort((a, b) => {
      if (b.joursSansArrosage !== a.joursSansArrosage) {
        return b.joursSansArrosage - a.joursSansArrosage;
      }
      return a.distance - b.distance;
    });

    return arbres;
  }

  // Générer un titre pour la mission
  genererTitreMission(nombreArbres) {
    const titres = [
      `Mission du jour : ${nombreArbres} arbre(s) à arroser`,
      `Défi écologique : ${nombreArbres} arbre(s) ont besoin de vous`,
      `Action immédiate : ${nombreArbres} arbre(s) en détresse`,
      `Votre mission : Sauver ${nombreArbres} arbre(s)`
    ];
    return titres[Math.floor(Math.random() * titres.length)];
  }

  // Générer une description pour la mission
  genererDescriptionMission(arbres) {
    const arbresCritiques = arbres.filter(a => a.joursSansArrosage >= 14).length;
    const arbresModere = arbres.filter(a => a.joursSansArrosage >= 7 && a.joursSansArrosage < 14).length;
    
    let description = `Vous avez ${arbres.length} arbre(s) qui nécessitent votre attention aujourd'hui.\n\n`;
    
    if (arbresCritiques > 0) {
      description += `⚠️ ${arbresCritiques} arbre(s) critique(s) (plus de 14 jours sans eau)\n`;
    }
    if (arbresModere > 0) {
      description += `🟡 ${arbresModere} arbre(s) modéré(s) (7-14 jours sans eau)\n`;
    }
    
    description += `\nChaque arrosage compte pour la survie de ces arbres et vous rapporte des points d'impact !`;
    
    return description;
  }

  // Calculer la distance totale de la mission
  calculerDistanceTotale(arbres) {
    if (arbres.length < 2) return 0;
    
    let distanceTotale = 0;
    for (let i = 0; i < arbres.length - 1; i++) {
      distanceTotale += this.calculerDistance(
        arbres[i].localisation.coordinates[1],
        arbres[i].localisation.coordinates[0],
        arbres[i + 1].localisation.coordinates[1],
        arbres[i + 1].localisation.coordinates[0]
      );
    }
    
    return Math.round(distanceTotale * 1000); // en mètres
  }

  // Estimer la durée de la mission
  estimerDuree(nombreArbres) {
    // Estimation : 5 minutes par arbre + temps de déplacement
    const tempsArrosage = nombreArbres * 5; // minutes
    const tempsDeplacement = nombreArbres * 3; // minutes estimées
    return tempsArrosage + tempsDeplacement;
  }

  // Évaluer la difficulté de la mission
  evaluerDifficulte(arbres) {
    const nombreArbres = arbres.length;
    const joursMoyenSansArrosage = arbres.reduce((sum, a) => sum + a.joursSansArrosage, 0) / nombreArbres;
    const distanceMoyenne = arbres.reduce((sum, a) => sum + a.distance, 0) / nombreArbres;
    
    let score = 0;
    if (nombreArbres >= 5) score += 3;
    else if (nombreArbres >= 3) score += 2;
    else score += 1;
    
    if (joursMoyenSansArrosage >= 14) score += 2;
    else if (joursMoyenSansArrosage >= 7) score += 1;
    
    if (distanceMoyenne >= 2000) score += 2;
    else if (distanceMoyenne >= 1000) score += 1;
    
    if (score >= 5) return 'difficile';
    if (score >= 3) return 'moyenne';
    return 'facile';
  }

  // Calculer les points estimés
  calculerPointsEstimes(arbres) {
    // 10 points par arbre + bonus pour urgence
    let points = arbres.length * 10;
    
    arbres.forEach(arbre => {
      if (arbre.joursSansArrosage >= 14) points += 5;
      else if (arbre.joursSansArrosage >= 7) points += 2;
    });
    
    return points;
  }

  // Générer des recommandations
  genererRecommandations(arbres) {
    const recommandations = [];
    
    const besoinEauTotal = arbres.length * 10; // 10L par arbre en moyenne
    recommandations.push(`Prévoyez environ ${besoinEauTotal}L d'eau`);
    
    if (arbres.some(a => a.joursSansArrosage >= 14)) {
      recommandations.push('Priorisez les arbres critiques (plus de 14 jours sans eau)');
    }
    
    recommandations.push('Prenez des photos avant/après pour documenter votre action');
    recommandations.push('Scannez les QR codes pour valider chaque arrosage');
    
    if (arbres.length > 3) {
      recommandations.push('Planifiez votre itinéraire pour optimiser les déplacements');
    }
    
    return recommandations;
  }

  // Calculer la distance entre deux points
  calculerDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Valider la complétion d'une mission
  async validerMission(utilisateurId, arbresIds) {
    try {
      const utilisateur = await Utilisateur.findById(utilisateurId);
      if (!utilisateur) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier que tous les arbres existent
      const arbres = await Arbre.find({ _id: { $in: arbresIds } });
      if (arbres.length !== arbresIds.length) {
        throw new Error('Certains arbres n\'existent pas');
      }

      // Calculer les points gagnés
      let pointsGagnes = 0;
      let eauApportee = 0;

      for (const arbre of arbres) {
        pointsGagnes += 10; // 10 points par arbre
        if (arbre.joursSansArrosage() >= 14) pointsGagnes += 5;
        eauApportee += 10; // Estimation moyenne
      }

      // Mettre à jour les statistiques de l'utilisateur
      utilisateur.statistiques.eauApportee += eauApportee;
      utilisateur.calculerScoreImpact();
      await utilisateur.save();

      return {
        message: 'Mission validée avec succès !',
        pointsGagnes,
        eauApportee,
        nouveauScore: utilisateur.scoreImpact
      };
    } catch (error) {
      console.error('Erreur lors de la validation de la mission:', error);
      throw error;
    }
  }

  // Obtenir les statistiques de missions
  async obtenirStatistiquesMissions() {
    try {
      const totalArbres = await Arbre.countDocuments();
      const arbresBesoinAide = await Arbre.countDocuments({
        dateDernierArrosage: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });

      const zonesCritiques = await Zone.countDocuments({ etat: 'critique' });
      const zonesBesoinAide = await Zone.countDocuments({ etat: 'besoin_arrosage' });

      return {
        totalArbres,
        arbresBesoinAide,
        pourcentageBesoinAide: totalArbres > 0 ? ((arbresBesoinAide / totalArbres) * 100).toFixed(1) : 0,
        zonesCritiques,
        zonesBesoinAide
      };
    } catch (error) {
      console.error('Erreur lors de l\'obtention des statistiques:', error);
      throw error;
    }
  }
}

module.exports = new MissionJourService();