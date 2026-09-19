// Gestion d'erreurs centralisée.
// - AppError : erreur applicative avec statut HTTP explicite
// - asyncHandler : élimine les try/catch redondants dans les routes
// - errorHandler : dernier filet, transforme toute erreur en réponse JSON propre
const mongoose = require('mongoose');

class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details;
    this.isOperational = true;
  }
}

// Enveloppe un handler async : toute erreur rejetée est transmise au middleware d'erreur.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Route inconnue
const notFound = (req, res, next) =>
  next(new AppError(404, `Route non trouvée : ${req.method} ${req.originalUrl}`));

function formaterErreurValidationMongoose(err) {
  const details = {};
  for (const [champ, valeur] of Object.entries(err.errors || {})) {
    details[champ] = valeur.message;
  }
  return details;
}

function formaterErreurZod(err) {
  const details = {};
  for (const [champ, probleme] of Object.entries(err.flatten().fieldErrors)) {
    details[champ] = probleme;
  }
  return details;
}

// Middleware d'erreur final — toujours 4 paramètres (Express le détecte par arité).
function errorHandler(err, req, res, next) {
  // Erreurs applicatives connues
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message, ...(err.details ? { details: err.details } : {}) });
  }

  // Erreurs de validation Zod (request validation)
  if (err && err.name === 'ZodError') {
    return res.status(400).json({ message: 'Données invalides', details: formaterErreurZod(err) });
  }

  // Erreurs Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: 'Données invalides', details: formaterErreurValidationMongoose(err) });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: `Identifiant invalide pour ${err.path}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Un enregistrement avec ces valeurs existe déjà' });
  }

  // Lié au rate limiting (express-rate-limit)
  if (err.statusCode === 429) {
    return res.status(429).json({ message: 'Trop de requêtes, veuillez réessayer plus tard' });
  }

  // Erreurs inattendues : ne jamais exposer la stack en production
  console.error('Erreur non gérée:', err);
  return res.status(500).json({
    message: 'Erreur serveur',
    ...(req.app.get('env') === 'development' ? { detail: err.message } : {}),
  });
}

module.exports = { AppError, asyncHandler, notFound, errorHandler };