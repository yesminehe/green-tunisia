'use client';

import { useEffect, useState } from 'react';
import { apiClient, Arbre } from '@/lib/api';

export default function ArbresPage() {
  const [arbres, setArbres] = useState<Arbre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<string>('checking');

  useEffect(() => {
    loadArbres();
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await apiClient.healthCheck();
      setHealthStatus(health.statut === 'ok' ? 'connected' : 'disconnected');
    } catch (err) {
      setHealthStatus('disconnected');
      console.error('Backend health check failed:', err);
    }
  };

  const loadArbres = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getArbres();
      setArbres(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trees');
      console.error('Failed to load trees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArroser = async (id: string) => {
    try {
      await apiClient.arroserArbre(id, 5, 'Demo User');
      await loadArbres();
    } catch (err) {
      console.error('Failed to water tree:', err);
      alert('Failed to water tree');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Arbres</h1>
          <p className="mt-2 text-gray-600">
            Backend Status: <span className={`font-semibold ${healthStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
              {healthStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading trees...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arbres.map((arbre) => (
              <div key={arbre._id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{arbre.type}</h3>
                <p className="text-gray-600 mb-1">QR Code: {arbre.qrCode || 'N/A'}</p>
                <p className="text-gray-600 mb-1">Status: <span className={`inline-block px-2 py-1 rounded text-sm ${
                  arbre.statut === 'vivant' ? 'bg-green-100 text-green-800' :
                  arbre.statut === 'malade' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>{arbre.statut}</span></p>
                <p className="text-gray-600 mb-1">Planted: {new Date(arbre.datePlantation).toLocaleDateString()}</p>
                {arbre.agePlantation && (
                  <p className="text-gray-600 mb-1">Age: {arbre.agePlantation} year(s)</p>
                )}
                {arbre.dateDernierArrosage && (
                  <p className="text-gray-600 mb-3">
                    Last watered: {new Date(arbre.dateDernierArrosage).toLocaleDateString()}
                  </p>
                )}
                {arbre.quantiteEau && (
                  <p className="text-gray-600 mb-3">
                    Water quantity: {arbre.quantiteEau}L
                  </p>
                )}
                <button
                  onClick={() => handleArroser(arbre._id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Water Tree
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && arbres.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">No trees found. Add some trees to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
