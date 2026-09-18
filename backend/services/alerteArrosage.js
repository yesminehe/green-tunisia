const Arbre = require('../models/Arbre');
const Zone = require('../models/Zone');
const Utilisateur = require('../models/Utilisateur');

class AlerteArrosageService {
  constructor() {
    this.seuilJoursDefaut = 7; // Seuil par défaut : 7 jours sans arrosage
    this.intervalVerification = null;
  }

  // Démarrer le service de vérification
  demarrer(intervalleMinutes = 60) {
    if (this.intervalVerification) {
      console.log('Service d\'alerte d\'arrosage déjà en cours');
      return;
    }

    console.log(`Démarrage du service d'alerte d'arrosage (vérification toutes les ${intervalleMinutes} minutes)`);
    
    // Vérification immédiate
    this.verifierAlertes();
    
    // Vérification périodique
    this.intervalVerification = setInterval(() => {
      this.verifierAlertes();
    }, intervalleMinutes * 60 * 1000);
  }

  // Arrêter le service
  arreter() {
    if (this.intervalVerification) {
      clearInterval(this.intervalVerification);
      this.intervalVerification = null;
      console.log('Service d\'alerte d\'arrosage arrêté');
    }
  }

  // Vérifier les arbres nécessitant un arrosage
  async verifierAlertes(seuilJours = this.seuilJoursDefaut) {
    try {
      console.log(`Vérification des arbres nécessitant un arrosage (seuil: ${seuilJours} jours)`);
      
      const dateLimite = new Date();
      dateLimite.setDate(dateLimite.getDate() - seuilJours);
      
      // Trouver les arbres qui n'ont pas été arrosés depuis le seuil
      const arbresAArroser = await Arbre.find({
        $or: [
          { dateDernierArrosage: { $lt: dateLimite } },
          { dateDernierArrosage: null }
        ],
        statut: { $in: ['vivant', 'à surveiller'] }
      })
        .populate('zone', 'nom region responsable')
        .populate('planteur', 'nom email');

      console.log(`${arbresAArroser.length} arbres nécessitent un arrosage`);

      // Grouper par zone
      const arbresParZone = {};
      arbresAArroser.forEach(arbre => {
        const zoneId = arbre.zone?._id?.toString() || 'sans_zone';
        if (!arbresParZone[zoneId]) {
          arbresParZone[zoneId] = {
            zone: arbre.zone,
            arbres: []
          };
        }
        arbresParZone[zoneId].arbres.push(arbre);
      });

      // Créer ou mettre à jour les alertes pour chaque zone
      for (const [zoneId, data] of Object.entries(arbresParZone)) {
        if (data.zone) {
          await this.creerOuMettreAJourAlerteZone(data.zone, data.arbres, seuilJours);
        }
      }

      // Notifier les administrateurs
      await this.notifierAdministrateurs(arbresAArroser.length);

      return {
        total: arbresAArroser.length,
        parZone: Object.keys(arbresParZone).length,
        arbres: arbresAArroser
      };
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes:', error);
      throw error;
    }
  }

  // Créer ou mettre à jour une alerte pour une zone
  async creerOuMettreAJourAlerteZone(zone, arbres, seuilJours) {
    try {
      const gravite = this.determinerGravite(arbres.length, seuilJours);
      const description = `${arbres.length} arbre(s) n'ont pas reçu d'eau depuis ${seuilJours} jours ou plus`;

      // Vérifier s'il existe déjà une alerte non résolue pour cette zone
      const alerteExistante = zone.alertes.find(
        a => a.type === 'arrosage' && !a.resolue
      );

      if (alerteExistante) {
        // Mettre à jour l'alerte existante
        alerteExistante.description = description;
        alerteExistante.gravite = gravite;
        alerteExistante.dateCreation = new Date();
      } else {
        // Créer une nouvelle alerte
        zone.alertes.push({
          type: 'arrosage',
          description,
          gravite,
          dateCreation: new Date(),
          resolue: false
        });
      }

      // Mettre à jour l'état de la zone
      if (gravite === 'critique' || gravite === 'haute') {
        zone.etat = 'critique';
      } else if (gravite === 'moyenne' && zone.etat === 'correct') {
        zone.etat = 'besoin_arrosage';
      }

      await zone.save();
      console.log(`Alerte créée/mise à jour pour la zone ${zone.nom}`);
    } catch (error) {
      console.error(`Erreur pour la zone ${zone.nom}:`, error);
    }
  }

  // Déterminer la gravité de l'alerte
  determinerGravite(nombreArbres, seuilJours) {
    if (nombreArbres > 20 || seuilJours > 14) return 'critique';
    if (nombreArbres > 10 || seuilJours > 10) return 'haute';
    if (nombreArbres > 5) return 'moyenne';
    return 'faible';
  }

  // Notifier les administrateurs
  async notifierAdministrateurs(nombreArbres) {
    try {
      const administrateurs = await Utilisateur.find({ role: 'admin' });
      
      console.log(`Notification à envoyer à ${administrateurs.length} administrateurs`);
      
      // Ici, vous pourriez intégrer un système de notification réel
      // (email, SMS, push notification, etc.)
      
      // Pour l'instant, on log juste
      administrateurs.forEach(admin => {
        console.log(`Notification pour ${admin.email}: ${nombreArbres} arbres nécessitent un arrosage`);
      });
    } catch (error) {
      console.error('Erreur lors de la notification des administrateurs:', error);
    }
  }

  // Obtenir les arbres à arroser près d'une position
  async obtenirArbresAArroserProches(latitude, longitude, rayonKm = 5, seuilJours = 7) {
    try {
      const dateLimite = new Date();
      dateLimite.setDate(dateLimite.getDate() - seuilJours);

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
            $maxDistance: rayonKm * 1000 // Convertir en mètres
          }
        }
      })
        .select('type localisation dateDernierArrosage qrCode zone')
        .populate('zone', 'nom');

      // Calculer la distance pour chaque arbre
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

      // Trier par distance
      arbres.sort((a, b) => a.distance - b.distance);

      return arbres;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'arbres proches:', error);
      throw error;
    }
  }

  // Calculer la distance entre deux points (formule de Haversine)
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

  // Obtenir les statistiques d'arrosage
  async obtenirStatistiquesArrosage() {
    try {
      const totalArbres = await Arbre.countDocuments();
      const arbresArrosesRecemment = await Arbre.countDocuments({
        dateDernierArrosage: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });
      const arbresNonArroses = totalArbres - arbresArrosesRecemment;

      // Distribution par jours sans arrosage
      const distributionParJours = await Arbre.aggregate([
        {
          $project: {
            joursSansArrosage: {
              $cond: [
                { $ne: ['$dateDernierArrosage', null] },
                {
                  $divide: [
                    { $subtract: [new Date(), '$dateDernierArrosage'] },
                    1000 * 60 * 60 * 24
                  ]
                },
                999 // Valeur arbitraire pour les arbres jamais arrosés
              ]
            }
          }
        },
        {
          $bucket: {
            groupBy: '$joursSansArrosage',
            boundaries: [0, 3, 7, 14, 30, 999],
            default: '30+',
            output: {
              count: { $sum: 1 }
            }
          }
        }
      ]);

      return {
        totalArbres,
        arbresArrosesRecemment,
        arbresNonArroses,
        tauxArrosage: totalArbres > 0 ? ((arbresArrosesRecemment / totalArbres) * 100).toFixed(1) : 0,
        distributionParJours
      };
    } catch (error) {
      console.error('Erreur lors de l\'obtention des statistiques:', error);
      throw error;
    }
  }
}

module.exports = new AlerteArrosageService();