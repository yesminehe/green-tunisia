// Script de démonstration : remplit la base avec des données réalistes
// (zones, arbres, événements et comptes de démo) pour que le frontend ait
// quelque chose à afficher dès la première connexion.
//
// Usage : npm run seed   (exécuter après npm run init-badges)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const config = require('../config');
const Zone = require('../models/Zone');
const Arbre = require('../models/Arbre');
const Evenement = require('../models/Evenement');
const Utilisateur = require('../models/Utilisateur');
const Campagne = require('../models/Campagne');
const Partenaire = require('../models/Partenaire');

const joursAgo = (jours) => new Date(Date.now() - jours * 24 * 60 * 60 * 1000);
const joursAhead = (jours) => new Date(Date.now() + jours * 24 * 60 * 60 * 1000);

// === Données géographiques (coordonnées [lon, lat]) =====================
const villes = {
  tunis: {
    nom: 'Parc El Menzah — Tunis',
    adresse: 'El Menzah, Tunis, Tunisie',
    ville: 'Tunis',
    region: 'Tunis',
    centre: [10.1824, 36.8530],
  },
  sousse: {
    nom: 'Ceinture verte de Sousse',
    adresse: 'Boulevard de la Ceinture, Sousse, Tunisie',
    ville: 'Sousse',
    region: 'Sousse',
    centre: [10.6406, 35.8256],
  },
  nabeul: {
    nom: 'Ceinture verte de Nabeul',
    adresse: 'Avenue Habib Bourguiba, Nabeul, Tunisie',
    ville: 'Nabeul',
    region: 'Nabeul',
    centre: [10.7356, 36.4561],
  },
  mahdia: {
    nom: 'Esplanade de Mahdia',
    adresse: 'Corniche, Mahdia, Tunisie',
    ville: 'Mahdia',
    region: 'Mahdia',
    centre: [11.0655, 35.5035],
  },
};

function polygoneAutour(centre, demiCoteDeg = 0.012) {
  const [lon, lat] = centre;
  return {
    type: 'Polygon',
    coordinates: [[
      [lon - demiCoteDeg, lat - demiCoteDeg],
      [lon + demiCoteDeg, lat - demiCoteDeg],
      [lon + demiCoteDeg, lat + demiCoteDeg],
      [lon - demiCoteDeg, lat + demiCoteDeg],
      [lon - demiCoteDeg, lat - demiCoteDeg],
    ]],
    centre: { type: 'Point', coordinates: centre },
    adresse: null,
    ville: null,
    region: null,
  };
}

// Espèces locales et leurs caractéristiques
const especes = [
  'Olivier', 'Amandier', 'Caroubier', 'Figuier', 'Pistachier',
  'Jujubier', 'Grenadier', 'Pin d\'Alep', 'Eucalyptus', 'Robinier',
];

// === Démarrage ==========================================================
async function seed() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connecté à MongoDB');

    // Reset des collections de données (on garde les badges d'initBadges)
    await Promise.all([
      Zone.deleteMany({}),
      Arbre.deleteMany({}),
      Evenement.deleteMany({}),
      Utilisateur.deleteMany({}),
      Campagne.deleteMany({}),
      Partenaire.deleteMany({}),
    ]);
    console.log('Collections de données réinitialisées');

    // 1) Utilisateurs de démo --------------------------------
    const mdpAdmin = await bcrypt.hash('Admin123!', 10);
    const mdpMembre = await bcrypt.hash('Demo123!', 10);

    const admin = await Utilisateur.create({
      nom: 'Ben Salah',
      prenom: 'Amine',
      email: 'admin@ghars.tn',
      motDePasse: mdpAdmin,
      telephone: '+216 98 000 111',
      role: 'admin',
      localisation: { type: 'Point', coordinates: [10.1824, 36.8530] },
      preferencesParticipation: { planter: true, arroser: true, donner: true, evenements: true },
      statistiques: { arbresPlantes: 42, eauApportee: 850, donnees: 600, evenementsParticipes: 12, arbresAdoptes: 3 },
    });
    admin.calculerScoreImpact();

    const membre = await Utilisateur.create({
      nom: 'Trabelsi',
      prenom: 'Sara',
      email: 'membre@ghars.tn',
      motDePasse: mdpMembre,
      telephone: '+216 22 555 888',
      role: 'membre',
      localisation: { type: 'Point', coordinates: [10.6406, 35.8256] },
      preferencesParticipation: { planter: true, arroser: true, donner: false, evenements: true },
      statistiques: { arbresPlantes: 3, eauApportee: 120, donnees: 0, evenementsParticipes: 2, arbresAdoptes: 1 },
    });
    membre.calculerScoreImpact();
    await admin.save();
    await membre.save();
    console.log(`Utilisateurs créés : ${admin.email} (admin) / ${membre.email} (membre)`);

    // 2) Zones ------------------------------------------------
    const zones = {};
    for (const [cle, v] of Object.entries(villes)) {
      zones[cle] = await Zone.create({
        nom: v.nom,
        description: `Zone de plantation située ${v.adresse}.`,
        localisation: { ...polygoneAutour(v.centre), adresse: v.adresse, ville: v.ville, region: v.region },
        etat: 'correct',
        responsable: admin._id,
        benevoles: [membre._id],
      });
    }
    console.log(`${Object.keys(zones).length} zones créées`);

    // 3) Arbres ------------------------------------------------
    const arbres = [];
    const typeZones = ['tunis', 'sousse', 'nabeul', 'mahdia'];
    let compteur = 0;

    typeZones.forEach((zoneCle) => {
      const zone = zones[zoneCle];
      const v = villes[zoneCle];
      const nbArbres = 6;

      for (let i = 0; i < nbArbres; i++) {
        compteur += 1;
        const espece = especes[(compteur + i) % especes.length];
        // Décalage de quelques centaines de mètres autour du centre
        const decal = (i - (nbArbres - 1) / 2) * 0.0022 + (Math.random() - 0.5) * 0.0012;
        const statut = i % 7 === 6 ? 'à surveiller' : i % 11 === 8 ? 'mort' : 'vivant';
        const arroseIlY = i % 4 === 0 ? 12 : i % 4 === 1 ? 9 : 2; // 12j/9j => besoin d'arrosage

        arbres.push({
          type: espece,
          datePlantation: joursAgo(220 + (i * 37) % 400),
          agePlantation: Math.round((220 + (i * 37) % 400) / 365),
          localisation: {
            type: 'Point',
            coordinates: [v.centre[0] + decal, v.centre[1] + decal * 0.8],
            adresse: `${v.adresse} (Zone ${zone.nom})`,
          },
          dateDernierArrosage: statut === 'mort' ? joursAgo(60) : joursAgo(arroseIlY),
          quantiteEau: statut === 'mort' ? 20 : 40 + (i % 5) * 15,
          nombreArrosages: 3 + (i % 6),
          statut,
          qrCode: `TN-${v.ville.substring(0, 3).toUpperCase()}-${1000 + compteur}`,
          zone: zone._id,
          planteur: { nom: 'Ghars Tunisie', email: 'contact@ghars.tn' },
          historique: [
            { date: joursAgo(220), action: 'plantation', description: `Plantation d'un ${espece}`, utilisateur: 'Ghars Tunisie' },
            { date: joursAgo(arroseIlY), action: 'arrosage', description: 'Arrosage périodique', utilisateur: 'Sara Trabelsi' },
          ],
          journalVie: [
            { date: joursAgo(220), typeEvenement: 'plantation', description: 'Plantation', utilisateur: admin._id },
            { date: joursAgo(Math.min(arroseIlY, 210)), typeEvenement: 'arrosage', description: 'Premier arrosage', utilisateur: membre._id },
          ],
        });
      }
    });

    await Arbre.insertMany(arbres);
    console.log(`${arbres.length} arbres créés`);

    // 4) Événements --------------------------------------------
    const evenements = [
      {
        titre: 'Plantation Sousse — Décembre 2026',
        description: 'Grande opération de plantation de 200 arbres dans la ceinture verte de Sousse. Venez nombreux !',
        type: 'plantation',
        date: joursAhead(30),
        heureDebut: '08:00',
        heureFin: '12:00',
        localisation: {
          type: 'Point',
          coordinates: villes.sousse.centre,
          adresse: villes.sousse.adresse,
          ville: 'Sousse',
          region: 'Sousse',
        },
        objectifs: { nombreArbresCible: 200, nombreParticipantsCible: 50 },
        organisateur: admin._id,
        statut: 'ouvert',
        zone: zones.sousse._id,
        materielNecessaire: ['Gants', 'Pioche', 'Seau 10L'],
        instructions: 'Rendez-vous au parking de la ceinture verte à 8h.',
      },
      {
        titre: 'Journée d\'arrosage des jeunes plants — Nabeul',
        description: 'Arrosage des 80 jeunes plants du verger communautaire de Nabeul avant l\'été.',
        type: 'arrosage',
        date: joursAhead(14),
        heureDebut: '17:00',
        heureFin: '19:30',
        localisation: {
          type: 'Point',
          coordinates: villes.nabeul.centre,
          adresse: villes.nabeul.adresse,
          ville: 'Nabeul',
          region: 'Nabeul',
        },
        objectifs: { nombreArbresCible: 0, nombreParticipantsCible: 20 },
        organisateur: admin._id,
        statut: 'ouvert',
        zone: zones.nabeul._id,
        materielNecessaire: ['Arrosoir', 'Gants'],
      },
      {
        titre: 'Nettoyage de l\'esplanade de Mahdia',
        description: 'Opération de nettoyage et d\'entretien autour des arbres de l\'esplanade.',
        type: 'nettoyage',
        date: joursAgo(20),
        heureDebut: '09:00',
        heureFin: '12:00',
        localisation: {
          type: 'Point',
          coordinates: villes.mahdia.centre,
          adresse: villes.mahdia.adresse,
          ville: 'Mahdia',
          region: 'Mahdia',
        },
        objectifs: { nombreArbresCible: 0, nombreParticipantsCible: 15 },
        organisateur: admin._id,
        statut: 'termine',
        zone: zones.mahdia._id,
        resultats: { nombreParticipants: 18 },
      },
    ];

    await Evenement.insertMany(evenements);
    console.log(`${evenements.length} événements créés`);

    // 5) Mettre à jour les statistiques des zones --------------
    for (const zone of Object.values(zones)) {
      await zone.mettreAJourStatistiques();
    }
    console.log('Statistiques des zones mises à jour');

    console.log('\n=== Résumé du seed ===');
    console.log(`Comptes de démo :
  Admin  : admin@ghars.tn / Admin123!
  Membre : membre@ghars.tn / Demo123!`);
    console.log(`Zones   : ${Object.keys(zones).length}`);
    console.log(`Arbres  : ${arbres.length}`);
    console.log(`Événements : ${evenements.length}`);

    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed :', error);
    process.exit(1);
  }
}

seed();