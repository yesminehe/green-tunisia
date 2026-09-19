// Utilitaires géographiques partagés.
// La formule de Haversine était dupliquée dans 3 fichiers (zones, alerteArrosage, missionJour).

const RAYON_TERRE_KM = 6371;

function toRad(valeur) {
  return (valeur * Math.PI) / 180;
}

// Distance en kilomètres entre deux points GPS (formule de Haversine).
function distanceKm(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return RAYON_TERRE_KM * c;
}

// Distance en mètres, arrondie à l'entier.
function distanceMeters(lat1, lon1, lat2, lon2) {
  return Math.round(distanceKm(lat1, lon1, lat2, lon2) * 1000);
}

module.exports = { distanceKm, distanceMeters, RAYON_TERRE_KM };