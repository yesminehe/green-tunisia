'use client';

import { useEffect, useState } from 'react';
import { apiClient, Arbre } from '@/lib/api';

export default function DashboardPage() {
  const [arbres, setArbres] = useState<Arbre[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<string>('checking');

  useEffect(() => {
    loadDashboard();
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await apiClient.healthCheck();
      setHealthStatus(health.statut === 'ok' ? 'connected' : 'disconnected');
    } catch (err) {
      setHealthStatus('disconnected');
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getArbres();
      setArbres(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: arbres.length,
    sain: arbres.filter(a => a.statut === 'sain').length,
    malade: arbres.filter(a => a.statut === 'malade').length,
    recentlyWatered: arbres.filter(a => {
      if (!a.dateDernierArrosage) return false;
      const daysSinceWatering = (Date.now() - new Date(a.dateDernierArrosage).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceWatering <= 7;
    }).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Backend Status: <span className={`font-semibold ${healthStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
              {healthStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
            </span>
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-green-600">{stats.total}</div>
              <div className="text-gray-600 mt-1">Total Trees</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-green-600">{stats.sain}</div>
              <div className="text-gray-600 mt-1">Healthy Trees</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-red-600">{stats.malade}</div>
              <div className="text-gray-600 mt-1">Sick Trees</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.recentlyWatered}</div>
              <div className="text-gray-600 mt-1">Recently Watered</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {arbres.length === 0 ? (
            <p className="text-gray-600">No trees yet. Start by adding some trees!</p>
          ) : (
            <div className="space-y-3">
              {arbres.slice(0, 5).map((arbre) => (
                <div key={arbre._id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <span className="font-medium">{arbre.nom}</span>
                    <span className="text-gray-500 ml-2">- {arbre.espece}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    arbre.statut === 'sain' ? 'bg-green-100 text-green-800' :
                    arbre.statut === 'malade' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {arbre.statut}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
