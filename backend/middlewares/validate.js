// Validation des requêtes avec Zod.
// validate() remplace req.source par les données validées et nettoyées,
// ce qui élimine aussi les failles d'assignation de masse.
const { z } = require('zod');

const sources = {
  body: 'body',
  query: 'query',
  params: 'params',
};

function validate(schema, source = sources.body) {
  return (req, _res, next) => {
    const donnees = req[source];
    const resultat = schema.safeParse(donnees ?? {});

    if (!resultat.success) {
      const err = new Error('Données invalides');
      err.name = 'ZodError';
      err.flatten = () => ({ fieldErrors: resultat.error.flatten().fieldErrors });
      return next(err);
    }

    // Remplacer par les données validées (les champs non déclarés sont retirés).
    req[source] = resultat.data;
    return next();
  };
}

// Types Zod réutilisables à travers les routes.
const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Identifiant invalide');
const geojsonPointSchema = z
  .object({
    type: z.literal('Point'),
    coordinates: z.tuple([
      z.number().min(-180).max(180), // longitude
      z.number().min(-90).max(90), // latitude
    ]),
  })
  .strict();

module.exports = { validate, sources, idSchema, geojsonPointSchema, z };