const express = require('express');
const router = express.Router();
const Arbre = require('../models/Arbre');
const { authMiddleware, requireAdmin, requirePermission, requireMember } = require('../middlewares/auth');
const { AppError, asyncHandler } = require('../middlewares/error');

// GET tous les arbres
router.get('/', asyncHandler(async (req, res) => {
  const arbres = await Arbre.find().sort({ createdAt: -1 });
  res.json(arbres);
}));

// GET un arbre par ID
router.get('/:id', asyncHandler(async (req, res) => {
  const arbre = await Arbre.findById(req.params.id);
  if (!arbre) {
    throw new AppError(404, 'Arbre non trouvé');
  }
  res.json(arbre);
}));

// POST créer un nouvel arbre
router.post('/', authMiddleware, requirePermission('report_planted_tree'), asyncHandler(async (req, res) => {
  const arbre = new Arbre(req.body);
  const nouvelArbre = await arbre.save();
  res.status(201).json(nouvelArbre);
}));

// PUT mettre à jour un arbre
router.put('/:id', authMiddleware, requirePermission('manage_trees'), asyncHandler(async (req, res) => {
  const arbre = await Arbre.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!arbre) {
    throw new AppError(404, 'Arbre non trouvé');
  }
  res.json(arbre);
}));

// DELETE supprimer un arbre
router.delete('/:id', authMiddleware, requirePermission('manage_trees'), asyncHandler(async (req, res) => {
  const arbre = await Arbre.findByIdAndDelete(req.params.id);
  if (!arbre) {
    throw new AppError(404, 'Arbre non trouvé');
  }
  res.json({ message: 'Arbre supprimé avec succès' });
}));

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
router.post('/:id/arrosage', authMiddleware, requirePermission('report_watering'), asyncHandler(async (req, res) => {
  const { quantiteEau, utilisateur } = req.body;
  const arbre = await Arbre.findById(req.params.id);
  
  if (!arbre) {
    throw new AppError(404, 'Arbre non trouvé');
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
}));

// PUT mettre à jour le statut
router.put('/:id/statut', authMiddleware, requirePermission('validate_planting'), asyncHandler(async (req, res) => {
  const { statut, utilisateur } = req.body;
  const arbre = await Arbre.findById(req.params.id);
  
  if (!arbre) {
    throw new AppError(404, 'Arbre non trouvé');
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
}));

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