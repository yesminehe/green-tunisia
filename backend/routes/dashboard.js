const express = require('express');
const router = express.Router();
const Arbre = require('../models/Arbre');
const Utilisateur = require('../models/Utilisateur');
const Evenement = require('../models/Evenement');
const Zone = require('../models/Zone');
const Campagne = require('../models/Campagne');

// GET statistiques globales du dashboard
router.get('/statistiques-globales', async (req, res) => {
  try {
    // Statistiques des arbres
    const totalArbres = await Arbre.countDocuments();
    const arbresVivants = await Arbre.countDocuments({ statut: 'vivant' });
    const arbresMorts = await Arbre.countDocuments({ statut: 'mort' });
    const arbresSurveillance = await Arbre.countDocuments({ statut: 'à surveiller' });
    
    // Calculer le taux de survie
    const tauxSurvie = totalArbres > 0 ? ((arbresVivants / totalArbres) * 100).toFixed(1) : 0;
    
    // Statistiques d'eau
    const arbresEau = await Arbre.aggregate([
      { $group: { _id: null, totalEau: { $sum: '$quantiteEau' } } }
    ]);
    const totalEau = arbresEau[0]?.totalEau || 0;
    
    // Statistiques des utilisateurs
    const totalUtilisateurs = await Utilisateur.countDocuments();
    const totalBenevoles = await Utilisateur.countDocuments({ role: 'benevole' });
    
    // Statistiques des événements
    const totalEvenements = await Evenement.countDocuments();
    const evenementsTermine = await Evenement.countDocuments({ statut: 'termine' });
    
    // Statistiques des zones
    const totalZones = await Zone.countDocuments();
    const zonesActives = await Zone.countDocuments({ statut: 'active' });
    
    // Statistiques des campagnes
    const totalCampagnes = await Campagne.countDocuments();
    const campagnesActives = await Campagne.countDocuments({ statut: 'active' });
    
    // Collecte totale
    const campagnesCollecte = await Campagne.aggregate([
      { $group: { _id: null, totalCollecte: { $sum: '$resultats.montantCollecte' } } }
    ]);
    const totalCollecte = campagnesCollecte[0]?.totalCollecte || 0;
    
    // Espèces d'arbres
    const especes = await Arbre.distinct('type');
    
    // Régions couvertes
    const regions = await Zone.distinct('region');
    
    res.json({
      arbres: {
        total: totalArbres,
        vivants: arbresVivants,
        morts: arbresMorts,
        surveillance: arbresSurveillance,
        tauxSurvie: parseFloat(tauxSurvie)
      },
      eau: {
        totalLitres: totalEau
      },
      utilisateurs: {
        total: totalUtilisateurs,
        benevoles: totalBenevoles
      },
      evenements: {
        total: totalEvenements,
        termines: evenementsTermine
      },
      zones: {
        total: totalZones,
        actives: zonesActives
      },
      campagnes: {
        total: totalCampagnes,
        actives: campagnesActives,
        totalCollecte: totalCollecte
      },
      diversite: {
        especes: especes.length,
        regions: regions.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistiques par région
router.get('/statistiques-par-region', async (req, res) => {
  try {
    const statistiquesParRegion = await Zone.aggregate([
      {
        $lookup: {
          from: 'arbres',
          localField: '_id',
          foreignField: 'zone',
          as: 'arbres'
        }
      },
      {
        $project: {
          nom: 1,
          region: 1,
          ville: 1,
          'statistiques.nombreArbres': { $size: '$arbres' },
          'statistiques.arbresVivants': {
            $size: {
              $filter: {
                input: '$arbres',
                as: 'arbre',
                cond: { $eq: ['$$arbre.statut', 'vivant'] }
              }
            }
          },
          'statistiques.arbresMorts': {
            $size: {
              $filter: {
                input: '$arbres',
                as: 'arbre',
                cond: { $eq: ['$$arbre.statut', 'mort'] }
              }
            }
          },
          'statistiques.totalEau': {
            $sum: '$arbres.quantiteEau'
          }
        }
      },
      {
        $group: {
          _id: '$region',
          totalArbres: { $sum: '$statistiques.nombreArbres' },
          totalEau: { $sum: '$statistiques.totalEau' },
          zones: { $push: '$$ROOT' }
        }
      }
    ]);
    
    res.json(statistiquesParRegion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistiques par espèce d'arbre
router.get('/statistiques-par-espece', async (req, res) => {
  try {
    const statistiquesParEspece = await Arbre.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          vivants: {
            $sum: {
              $cond: [{ $eq: ['$statut', 'vivant'] }, 1, 0]
            }
          },
          morts: {
            $sum: {
              $cond: [{ $eq: ['$statut', 'mort'] }, 1, 0]
            }
          },
          totalEau: { $sum: '$quantiteEau' }
        }
      },
      {
        $project: {
          espece: '$_id',
          total: 1,
          vivants: 1,
          morts: 1,
          tauxSurvie: {
            $multiply: [
              { $divide: ['$vivants', '$total'] },
              100
            ]
          },
          totalEau: 1
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    res.json(statistiquesParEspece);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistiques temporelles (évolution dans le temps)
router.get('/statistiques-temporelles', async (req, res) => {
  try {
    const { periode = 'mois' } = req.query;
    
    let groupBy;
    switch (periode) {
      case 'jour':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'semaine':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'mois':
      default:
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
    }
    
    // Évolution des plantations
    const evolutionPlantations = await Arbre.aggregate([
      {
        $group: {
          _id: groupBy,
          nombre: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);
    
    // Évolution des arrosages
    const evolutionArrosages = await Arbre.aggregate([
      {
        $unwind: '$historique'
      },
      {
        $match: {
          'historique.action': 'arrosage'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$historique.date' },
            month: { $month: '$historique.date' },
            day: { $dayOfMonth: '$historique.date' }
          },
          nombre: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);
    
    // Évolution des dons
    const evolutionDons = await Campagne.aggregate([
      {
        $unwind: '$donateurs'
      },
      {
        $group: {
          _id: {
            year: { $year: '$donateurs.dateDon' },
            month: { $month: '$donateurs.dateDon' },
            day: { $dayOfMonth: '$donateurs.dateDon' }
          },
          montant: { $sum: '$donateurs.montant' },
          nombre: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);
    
    res.json({
      plantations: evolutionPlantations,
      arrosages: evolutionArrosages,
      dons: evolutionDons
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET top contributeurs
router.get('/top-contributeurs', async (req, res) => {
  try {
    const { limite = 10 } = req.query;
    
    const topContributeurs = await Utilisateur.find()
      .select('nom prenom photoProfil scoreImpact statistiques')
      .sort({ scoreImpact: -1 })
      .limit(parseInt(limite));
    
    res.json(topContributeurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET alertes actives
router.get('/alertes-actives', async (req, res) => {
  try {
    const zonesAvecAlertes = await Zone.find({
      'alertes.resolue': false
    })
      .select('nom region alertes etat')
      .populate('responsable', 'nom prenom');
    
    const alertes = [];
    zonesAvecAlertes.forEach(zone => {
      zone.alertes
        .filter(alerte => !alerte.resolue)
        .forEach(alerte => {
          alertes.push({
            zone: zone.nom,
            region: zone.region,
            responsable: zone.responsable,
            alerte
          });
        });
    });
    
    // Trier par gravité
    const ordreGravite = { critique: 0, haute: 1, moyenne: 2, faible: 3 };
    alertes.sort((a, b) => ordreGravite[a.alerte.gravite] - ordreGravite[b.alerte.gravite]);
    
    res.json(alertes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET heatmap des arbres
router.get('/heatmap', async (req, res) => {
  try {
    const heatmapData = await Arbre.aggregate([
      {
        $group: {
          _id: {
            latitude: { $round: ['$localisation.coordinates[1]', 4] },
            longitude: { $round: ['$localisation.coordinates[0]', 4] }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          latitude: '$_id.latitude',
          longitude: '$_id.longitude',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistiques d'impact personnel (protégé)
router.get('/impact-personnel', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const utilisateur = await Utilisateur.findById(decoded.id)
      .select('nom prenom scoreImpact statistiques badges')
      .populate('badges');
    
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Calculer le rang de l'utilisateur
    const rang = await Utilisateur.countDocuments({
      scoreImpact: { $gt: utilisateur.scoreImpact }
    }) + 1;
    
    // Calculer les pourcentages pour l'affichage
    const totalUtilisateurs = await Utilisateur.countDocuments();
    const pourcentageRang = ((rang / totalUtilisateurs) * 100).toFixed(1);
    
    res.json({
      utilisateur: {
        nom: utilisateur.nom,
        prenom: utilisateur.prenom
      },
      scoreImpact: utilisateur.scoreImpact,
      rang,
      pourcentageRang,
      statistiques: utilisateur.statistiques,
      badges: utilisateur.badges
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;