const mongoose = require('mongoose');
const config = require('./config');
const Utilisateur = require('./models/Utilisateur');

mongoose.connect(config.mongoUri).then(async () => {
  const membre = await Utilisateur.findOne({ email: 'membre@ghars.tn' });
  console.log('Member found:', membre ? 'Yes' : 'No');
  if (membre) {
    console.log('Role:', membre.role);
    console.log('Active:', membre.actif);
    console.log('Email:', membre.email);
  }
  await mongoose.disconnect();
}).catch(console.error);