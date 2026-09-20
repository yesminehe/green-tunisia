const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');
const Utilisateur = require('./models/Utilisateur');

mongoose.connect(config.mongoUri).then(async () => {
  const membre = await Utilisateur.findOne({ email: 'membre@ghars.tn' });
  if (membre) {
    console.log('Testing password: Demo123!');
    const isValid = await bcrypt.compare('Demo123!', membre.motDePasse);
    console.log('Password valid:', isValid);
    
    console.log('\nTesting password: Demo123 (without !)');
    const isValid2 = await bcrypt.compare('Demo123', membre.motDePasse);
    console.log('Password valid:', isValid2);
  }
  await mongoose.disconnect();
}).catch(console.error);