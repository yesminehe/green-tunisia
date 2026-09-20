require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/Utilisateur');

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ghars');
    console.log('Connecté à MongoDB');

    // Check if admin already exists
    const existingAdmin = await Utilisateur.findOne({ email: 'admin@ghars.tn' });
    if (existingAdmin) {
      console.log('Un administrateur avec cet email existe déjà');
      console.log('Email: admin@ghars.tn');
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const motDePasseHash = await bcrypt.hash('admin123', 10);
    
    const admin = new Utilisateur({
      nom: 'Admin',
      prenom: 'Ghars',
      email: 'admin@ghars.tn',
      motDePasse: motDePasseHash,
      role: 'admin',
      actif: true,
      preferencesParticipation: {
        planter: true,
        arroser: true,
        donner: true,
        evenements: true
      }
    });

    await admin.save();
    console.log('Administrateur créé avec succès!');
    console.log('Email: admin@ghars.tn');
    console.log('Mot de passe: admin123');
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  }
}

createAdminUser();