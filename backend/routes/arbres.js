const express = require('express');
const router = express.Router();
const Arbre = require('../models/Arbre');

// GET tous les arbres
router.get('/', async (req, res) => {
  try {
    const arbres = await Arbre.find().sort({ createdAt: -1 });
    res.json(arbres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET un arbre par ID
router.get('/:id', async (req, res) => {
  try {
    const arbre = await Arbre.findById(req.params.id);
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }
    res.json(arbre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST créer un nouvel arbre
router.post('/', async (req, res) => {
  try {
    const arbre = new Arbre(req.body);
    const nouvelArbre = await arbre.save();
    res.status(201).json(nouvelArbre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT mettre à jour un arbre
router.put('/:id', async (req, res) => {
  try {
    const arbre = await Arbre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }
    res.json(arbre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE supprimer un arbre
router.delete('/:id', async (req, res) => {
  try {
    const arbre = await Arbre.findByIdAndDelete(req.params.id);
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }
    res.json({ message: 'Arbre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST ajouter un événement à l'historique
router.post('/:id/historique', async (req, res) => {
  try {
    const { action, description, utilisateur } = req.body;
    const arbre = await Arbre.findById(req.params.id);
    
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }
    
    arbre.historique.push({
      action,
      description,
      utilisateur
    });
    
    await arbre.save();
    res.json(arbre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST enregistrer un arrosage
router.post('/:id/arrosage', async (req, res) => {
  try {
    const { quantiteEau, utilisateur } = req.body;
    const arbre = await Arbre.findById(req.params.id);
    
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }
    
    arbre.dateDernierArrosage = new Date();
    arbre.quantiteEau = (arbre.quantiteEau || 0) + (quantiteEau || 0);
    arbre.nombreArrosages = (arbre.nombreArrosages || 0) + 1;
    
    arbre.historique.push({
      action: 'arrosage',
      description: `Arrosage de ${quantiteEau} litres`,
      utilisateur
    });
    
    await arbre.save();
    res.json(arbre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT mettre à jour le statut
router.put('/:id/statut', async (req, res) => {
  try {
    const { statut, utilisateur } = req.body;
    const arbre = await Arbre.findById(req.params.id);
    
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }
    
    const ancienStatut = arbre.statut;
    arbre.statut = statut;
    
    arbre.historique.push({
      action: 'changement_statut',
      description: `Statut changé de ${ancienStatut} à ${statut}`,
      utilisateur
    });
    
    await arbre.save();
    res.json(arbre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST ajouter une photo
router.post('/:id/photos', async (req, res) => {
  try {
    const { photoUrl, utilisateur } = req.body;
    const arbre = await Arbre.findById(req.params.id);
    
    if (!arbre) {
      return res.status(404).json({ message: 'Arbre non trouvé' });
    }
    
    arbre.photos.push(photoUrl);
    
    arbre.historique.push({
      action: 'ajout_photo',
      description: `Photo ajoutée: ${photoUrl}`,
      utilisateur
    });
    
    await arbre.save();
    res.json(arbre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET recherche par localisation (rayon en km)
router.get('/recherche/localisation', async (req, res) => {
  try {
    const { longitude, latitude, rayon } = req.query;
    
    const arbres = await Arbre.find({
      localisation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(rayon) * 1000 // Convertir en mètres
        }
      }
    });
    
    res.json(arbres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET filtrer par statut
router.get('/filtre/statut/:statut', async (req, res) => {
  try {
    const arbres = await Arbre.find({ statut: req.params.statut });
    res.json(arbres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;