const mongoose = require('mongoose');
const Badge = require('../models/Badge');

async function initialiserBadges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ghars');
    console.log('Connecté à MongoDB');

    // Supprimer les badges existants
    await Badge.deleteMany({});
    console.log('Badges existants supprimés');

    // Créer les badges par défaut
    const badges = [
      {
        nom: 'Premier arbre',
        description: 'Vous avez planté votre premier arbre !',
        categorie: 'plantation',
        icone: '🥇',
        rarete: 'commun',
        conditions: {
          type: 'arbres_plantes',
          valeur: 1,
          descriptionCondition: 'Planter 1 arbre'
        },
        pointsBonus: 100,
        ordre: 1
      },
      {
        nom: '10 arbres plantés',
        description: 'Vous avez planté 10 arbres !',
        categorie: 'plantation',
        icone: '🌳',
        rarete: 'rare',
        conditions: {
          type: 'arbres_plantes',
          valeur: 10,
          descriptionCondition: 'Planter 10 arbres'
        },
        pointsBonus: 500,
        ordre: 2
      },
      {
        nom: '100 L d\'eau',
        description: 'Vous avez apporté 100 litres d\'eau aux arbres !',
        categorie: 'arrosage',
        icone: '💧',
        rarete: 'commun',
        conditions: {
          type: 'eau_apportee',
          valeur: 100,
          descriptionCondition: 'Apporter 100 L d\'eau'
        },
        pointsBonus: 100,
        ordre: 3
      },
      {
        nom: '50 arbres',
        description: 'Vous avez planté 50 arbres !',
        categorie: 'plantation',
        icone: '🌲',
        rarete: 'epique',
        conditions: {
          type: 'arbres_plantes',
          valeur: 50,
          descriptionCondition: 'Planter 50 arbres'
        },
        pointsBonus: 2000,
        ordre: 4
      },
      {
        nom: 'Protecteur de la forêt',
        description: 'Vous avez planté 100 arbres !',
        categorie: 'plantation',
        icone: '🏆',
        rarete: 'legendaire',
        conditions: {
          type: 'arbres_plantes',
          valeur: 100,
          descriptionCondition: 'Planter 100 arbres'
        },
        pointsBonus: 5000,
        ordre: 5
      },
      {
        nom: 'Ambassadeur de l\'association',
        description: 'Vous avez participé à 20 événements !',
        categorie: 'evenement',
        icone: '🌍',
        rarete: 'legendaire',
        conditions: {
          type: 'evenements_participes',
          valeur: 20,
          descriptionCondition: 'Participer à 20 événements'
        },
        pointsBonus: 3000,
        ordre: 6
      },
      {
        nom: 'Parrain d\'arbres',
        description: 'Vous avez adopté 5 arbres !',
        categorie: 'engagement',
        icone: '👨‍👩‍👧‍👦',
        rarete: 'rare',
        conditions: {
          type: 'arbres_adoptes',
          valeur: 5,
          descriptionCondition: 'Adopter 5 arbres'
        },
        pointsBonus: 300,
        ordre: 7
      },
      {
        nom: 'Générosité',
        description: 'Vous avez donné 100 DT !',
        categorie: 'don',
        icone: '💰',
        rarete: 'rare',
        conditions: {
          type: 'don_montant',
          valeur: 100,
          descriptionCondition: 'Donner 100 DT'
        },
        pointsBonus: 200,
        ordre: 8
      },
      {
        nom: 'Score d\'impact 1000',
        description: 'Vous avez atteint un score d\'impact de 1000 points !',
        categorie: 'engagement',
        icone: '⭐',
        rarete: 'epique',
        conditions: {
          type: 'score_impact',
          valeur: 1000,
          descriptionCondition: 'Atteindre 1000 points d\'impact'
        },
        pointsBonus: 1000,
        ordre: 9
      },
      {
        nom: 'Bénévole dévoué',
        description: 'Vous avez participé à 5 événements !',
        categorie: 'evenement',
        icone: '🤝',
        rarete: 'commun',
        conditions: {
          type: 'evenements_participes',
          valeur: 5,
          descriptionCondition: 'Participer à 5 événements'
        },
        pointsBonus: 150,
        ordre: 10
      },
      {
        nom: 'Arrosage régulier',
        description: 'Vous avez apporté 500 L d\'eau !',
        categorie: 'arrosage',
        icone: '🚿',
        rarete: 'rare',
        conditions: {
          type: 'eau_apportee',
          valeur: 500,
          descriptionCondition: 'Apporter 500 L d\'eau'
        },
        pointsBonus: 300,
        ordre: 11
      },
      {
        nom: 'Mécène',
        description: 'Vous avez donné 500 DT !',
        categorie: 'don',
        icone: '💎',
        rarete: 'epique',
        conditions: {
          type: 'don_montant',
          valeur: 500,
          descriptionCondition: 'Donner 500 DT'
        },
        pointsBonus: 800,
        ordre: 12
      }
    ];

    await Badge.insertMany(badges);
    console.log(`${badges.length} badges créés avec succès`);

    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

initialiserBadges();