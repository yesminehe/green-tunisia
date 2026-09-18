# Backend API Ghars - Plateforme de Gestion des Arbres

Backend Node.js complet avec Express et MongoDB pour la plateforme de gestion des arbres "Ghars".

## 🌟 Fonctionnalités

- 🗺️ **Carte interactive** des arbres avec clustering et filtres
- 🌳 **Fiche détaillée** de chaque arbre avec historique et photos
- 💧 **Suivi d'arrosage** avec statistiques et alertes automatiques
- 👤 **Système d'inscription** avec préférences de participation
- 🏆 **Gamification** complète avec badges et score d'impact
- 📅 **Gestion d'événements** de plantation
- 📍 **Zones de plantation** avec gestion par zone
- 💰 **Campagnes de financement** avec suivi des dons
- 🤝 **Partenariats entreprises** avec suivi de contribution
- 🚨 **Système d'alertes** intelligent pour l'arrosage
- 🎯 **Mission du jour** pour mobiliser les bénévoles
- 📊 **Dashboard statistiques** complet avec heatmaps

## Installation

```bash
npm install
```

## Configuration

1. Copier le fichier `.env.example` en `.env` :
```bash
cp .env.example .env
```

2. Éditer le fichier `.env` avec vos configurations :
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ghars
JWT_SECRET=votre_secret_jwt_à_changer_en_production
```

## Initialisation

Initialiser les badges par défaut :
```bash
npm run init-badges
```

## Démarrage

```bash
npm start
```

Le serveur démarrera sur le port 5000.

## 📚 API Endpoints

### 👤 Utilisateurs (`/api/utilisateurs`)

- `POST /api/utilisateurs/inscription` - Inscription d'un nouvel utilisateur
- `POST /api/utilisateurs/connexion` - Connexion d'un utilisateur
- `GET /api/utilisateurs/profil` - Obtenir le profil utilisateur (authentifié)
- `PUT /api/utilisateurs/profil` - Mettre à jour le profil (authentifié)
- `POST /api/utilisateurs/adopter-arbre/:arbreId` - Adopter un arbre (authentifié)
- `GET /api/utilisateurs/statistiques` - Obtenir les statistiques utilisateur (authentifié)
- `GET /api/utilisateurs/classement` - Obtenir le classement (authentifié)

### 🌳 Arbres (`/api/arbres`)

- `GET /api/arbres` - Récupérer tous les arbres
- `GET /api/arbres/:id` - Récupérer un arbre par ID
- `POST /api/arbres` - Créer un nouvel arbre
- `PUT /api/arbres/:id` - Mettre à jour un arbre
- `DELETE /api/arbres/:id` - Supprimer un arbre
- `POST /api/arbres/:id/historique` - Ajouter un événement à l'historique
- `POST /api/arbres/:id/arrosage` - Enregistrer un arrosage
- `PUT /api/arbres/:id/statut` - Mettre à jour le statut
- `POST /api/arbres/:id/photos` - Ajouter une photo
- `GET /api/arbres/recherche/localisation` - Rechercher par localisation
- `GET /api/arbres/filtre/statut/:statut` - Filtrer par statut

### 📅 Événements (`/api/evenements`)

- `GET /api/evenements` - Récupérer tous les événements
- `GET /api/evenements/:id` - Récupérer un événement par ID
- `POST /api/evenements` - Créer un nouvel événement (authentifié)
- `PUT /api/evenements/:id` - Mettre à jour un événement (authentifié)
- `DELETE /api/evenements/:id` - Supprimer un événement (authentifié)
- `POST /api/evenements/:id/inscription` - S'inscrire à un événement (authentifié)
- `DELETE /api/evenements/:id/inscription` - Se désinscrire d'un événement (authentifié)
- `POST /api/evenements/:id/resultats` - Ajouter des résultats (authentifié)
- `GET /api/evenements/upcoming/list` - Événements à venir
- `GET /api/evenements/ville/:ville` - Événements par ville

### 📍 Zones (`/api/zones`)

- `GET /api/zones` - Récupérer toutes les zones
- `GET /api/zones/:id` - Récupérer une zone par ID
- `POST /api/zones` - Créer une nouvelle zone (authentifié, admin)
- `PUT /api/zones/:id` - Mettre à jour une zone (authentifié)
- `DELETE /api/zones/:id` - Supprimer une zone (authentifié, admin)
- `POST /api/zones/:id/statistiques` - Mettre à jour les statistiques (authentifié)
- `POST /api/zones/:id/alertes` - Ajouter une alerte (authentifié)
- `PUT /api/zones/:id/alertes/:alerteId/resoudre` - Résoudre une alerte (authentifié)
- `POST /api/zones/:id/benevoles` - Ajouter un bénévole (authentifié)
- `DELETE /api/zones/:id/benevoles` - Retirer un bénévole (authentifié)
- `GET /api/zones/aide/requise` - Zones nécessitant de l'aide
- `GET /api/zones/:id/arbres-a-arroser` - Arbres à arroser dans une zone

### 💰 Campagnes (`/api/campagnes`)

- `GET /api/campagnes` - Récupérer toutes les campagnes
- `GET /api/campagnes/:id` - Récupérer une campagne par ID
- `POST /api/campagnes` - Créer une nouvelle campagne (authentifié)
- `PUT /api/campagnes/:id` - Mettre à jour une campagne (authentifié)
- `DELETE /api/campagnes/:id` - Supprimer une campagne (authentifié)
- `POST /api/campagnes/:id/don` - Faire un don (authentifié)
- `POST /api/campagnes/:id/attribuer-arbres` - Attribuer des arbres (authentifié, admin)
- `GET /api/campagnes/actives/list` - Campagnes actives
- `GET /api/campagnes/partenaire/:partenaireId` - Campagnes par partenaire
- `PUT /api/campagnes/:id/activer` - Activer une campagne (authentifié)
- `PUT /api/campagnes/:id/pause` - Mettre en pause une campagne (authentifié)
- `GET /api/campagnes/:id/donateurs` - Donneurs d'une campagne

### 📊 Dashboard (`/api/dashboard`)

- `GET /api/dashboard/statistiques-globales` - Statistiques globales
- `GET /api/dashboard/statistiques-par-region` - Statistiques par région
- `GET /api/dashboard/statistiques-par-espece` - Statistiques par espèce
- `GET /api/dashboard/statistiques-temporelles` - Évolution temporelle
- `GET /api/dashboard/top-contributeurs` - Top contributeurs
- `GET /api/dashboard/alertes-actives` - Alertes actives
- `GET /api/dashboard/heatmap` - Heatmap des arbres
- `GET /api/dashboard/impact-personnel` - Impact personnel (authentifié)

### 🏆 Badges (`/api/badges`)

- `GET /api/badges` - Récupérer tous les badges
- `GET /api/badges/:id` - Récupérer un badge par ID
- `POST /api/badges` - Créer un nouveau badge (authentifié, admin)
- `PUT /api/badges/:id` - Mettre à jour un badge (authentifié, admin)
- `DELETE /api/badges/:id` - Supprimer un badge (authentifié, admin)
- `GET /api/badges/utilisateur/mes-badges` - Badges de l'utilisateur (authentifié)
- `GET /api/badges/disponibles/pour-moi` - Badges disponibles (authentifié)
- `POST /api/badges/verifier-attribution` - Vérifier et attribuer les badges (authentifié)
- `GET /api/badges/classement/categorie/:categorie` - Classement par catégorie
- `GET /api/badges/statistiques/globales` - Statistiques globales des badges

### 🚨 Alertes (`/api/alertes`)

- `POST /api/alertes/verifier` - Déclencher une vérification manuelle (authentifié, admin)
- `GET /api/alertes/arbres-proches` - Arbres à arroser près d'une position
- `GET /api/alertes/statistiques` - Statistiques d'arrosage
- `GET /api/alertes/mes-alertes` - Alertes personnelles (authentifié)
- `POST /api/alertes/declarer-arrosage/:arbreId` - Déclarer un arrosage (authentifié)
- `GET /api/alertes/urgence` - Arbres nécessitant une attention urgente

### 🎯 Missions (`/api/missions`)

- `GET /api/missions/ma-mission` - Obtenir la mission du jour (authentifié)
- `POST /api/missions/valider` - Valider la complétion d'une mission (authentifié)
- `GET /api/missions/statistiques` - Statistiques des missions
- `GET /api/missions/position` - Mission pour une position spécifique
- `GET /api/missions/zone/:zoneId` - Missions disponibles dans une zone

## 🗄️ Modèles de données

### Arbre
- ID unique (auto-généré)
- QR Code unique (ex: TN-SOU-00125)
- Type/espèce
- Date de plantation et âge
- Localisation GPS et adresse
- Historique d'arrosage
- Statut (vivant/à surveiller/mort)
- Photos et journal de vie
- Système d'adoption/parrainage
- Zone de plantation

### Utilisateur
- Informations personnelles
- Préférences de participation
- Statistiques (arbres plantés, eau apportée, dons, événements)
- Score d'impact
- Badges obtenus
- Arbres adoptés
- Localisation

### Événement
- Informations de base
- Date, lieu et objectifs
- Participants et résultats
- Photos avant/après
- Zone concernée

### Zone
- Localisation (polygone)
- Statistiques détaillées
- État et alertes
- Responsable et bénévoles

### Campagne
- Objectifs et résultats
- Localisation cible
- Donneurs et arbres associés
- Partenariat entreprise

### Badge
- Conditions d'obtention
- Catégorie et rareté
- Points bonus

## 🔐 Authentification

L'API utilise des tokens JWT pour l'authentification. Pour accéder aux routes protégées, incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer <votre_token_jwt>
```

## 🚀 Services d'arrière-plan

Le serveur inclut automatiquement :
- **Service d'alerte d'arrosage** : Vérification périodique des arbres nécessitant un arrosage (toutes les heures par défaut)

## 📝 Exemples d'utilisation

### Inscription d'un utilisateur
```json
POST /api/utilisateurs/inscription
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean@example.com",
  "motDePasse": "password123",
  "telephone": "0123456789",
  "preferencesParticipation": {
    "planter": true,
    "arroser": true,
    "donner": false,
    "evenements": true
  }
}
```

### Création d'un arbre
```json
POST /api/arbres
{
  "type": "Chêne",
  "datePlantation": "2024-01-15",
  "agePlantation": 2,
  "localisation": {
    "type": "Point",
    "coordinates": [10.6406, 35.8256],
    "adresse": "Sousse, Tunisie"
  },
  "planteur": {
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "telephone": "0123456789"
  }
}
```

### Création d'un événement
```json
POST /api/evenements
{
  "titre": "Plantation Sousse — Octobre 2024",
  "description": "Plantation de 200 arbres à Sousse",
  "type": "plantation",
  "date": "2024-10-10",
  "heureDebut": "08:00",
  "heureFin": "12:00",
  "localisation": {
    "type": "Point",
    "coordinates": [10.6406, 35.8256],
    "adresse": "Sousse, Tunisie",
    "ville": "Sousse",
    "region": "Sousse"
  },
  "objectifs": {
    "nombreArbresCible": 200,
    "nombreParticipantsCible": 50
  }
}
```

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM MongoDB
- **bcryptjs** - Hachage des mots de passe
- **jsonwebtoken** - Authentification JWT
- **cors** - Gestion CORS

## 📝 Structure du projet

```
backend/
├── models/           # Modèles Mongoose
│   ├── Arbre.js
│   ├── Utilisateur.js
│   ├── Evenement.js
│   ├── Zone.js
│   ├── Campagne.js
│   ├── Badge.js
│   └── Partenaire.js
├── routes/           # Routes API
│   ├── arbres.js
│   ├── utilisateurs.js
│   ├── evenements.js
│   ├── zones.js
│   ├── campagnes.js
│   ├── dashboard.js
│   ├── badges.js
│   ├── alertes.js
│   └── missions.js
├── services/         # Services d'arrière-plan
│   ├── alerteArrosage.js
│   └── missionJour.js
├── scripts/          # Scripts d'initialisation
│   └── initBadges.js
├── server.js         # Point d'entrée
├── package.json
├── .env.example
└── README.md
```