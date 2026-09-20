'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, Arbre } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface UserProfile {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  statistiques: {
    arbresPlantes: number;
    eauApportee: number;
    donnees: number;
    evenementsParticipes: number;
    arbresAdoptes: number;
  };
  scoreImpact: number;
  badges: any[];
  preferencesParticipation: {
    planter: boolean;
    arroser: boolean;
    donner: boolean;
    evenements: boolean;
  };
  arbresAdoptes: Array<{
    arbre: Arbre;
    dateAdoption: string;
    dureeAdoption: number;
  }>;
}

interface Evenement {
  _id: string;
  titre: string;
  description: string;
  type: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  localisation: {
    adresse: string;
    ville: string;
  };
  statut: string;
  objectifs: {
    nombreArbresCible: number;
    nombreParticipantsCible: number;
  };
}

export default function MembreDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [arbres, setArbres] = useState<Arbre[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const profileData = await apiClient.getProfile();
      setProfile(profileData);
      
      // Load trees
      const arbresData = await apiClient.getArbres();
      setArbres(arbresData);
      
      // Load events (we'll need to add this API endpoint)
      try {
        const evenementsData = await apiClient.getEvenements();
        setEvenements(evenementsData);
      } catch (err) {
        console.log('Events endpoint not available yet');
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const upcomingEvents = evenements
    .filter(e => e.statut === 'ouvert' && new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const needsWatering = arbres.filter(a => {
    if (!a.dateDernierArrosage) return true;
    const daysSinceWatering = (Date.now() - new Date(a.dateDernierArrosage).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceWatering > 7;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireMember>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ghars - Espace Membre</h1>
                <p className="text-gray-600">Bienvenue, {profile?.prenom} {profile?.nom}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Score d'impact */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Votre Score d'Impact</h2>
                <p className="text-green-100">Continuez à contribuer à l'environnement!</p>
              </div>
              <div className="text-5xl font-bold">{profile?.scoreImpact || 0}</div>
            </div>
          </div>

          {/* Statistiques personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Arbres Plantés</h3>
              </div>
              <div className="text-3xl font-bold text-green-600">{profile?.statistiques?.arbresPlantes || 0}</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Eau Apportée (L)</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600">{profile?.statistiques?.eauApportee || 0}</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Dons (TND)</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{profile?.statistiques?.donnees || 0}</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Événements</h3>
              </div>
              <div className="text-3xl font-bold text-purple-600">{profile?.statistiques?.evenementsParticipes || 0}</div>
            </div>
          </div>

          {/* Arbres adoptés */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🌳 Mes Arbres Adoptés</h2>
            {profile?.arbresAdoptes && profile.arbresAdoptes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.arbresAdoptes.map((adoption, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="font-semibold text-gray-900">{adoption.arbre.type}</div>
                    <div className="text-sm text-gray-600">{adoption.arbre.localisation?.adresse || 'Adresse non disponible'}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Adopté le: {new Date(adoption.dateAdoption).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-500">
                      Durée: {adoption.dureeAdoption} mois
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Vous n'avez pas encore adopté d'arbre. <span className="text-green-600 cursor-pointer hover:underline">Adoptez votre premier arbre!</span></p>
            )}
          </div>

          {/* Arbres nécessitant un arrosage */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">💧 Arbres Nécessitant un Arrosage</h2>
            {needsWatering.length > 0 ? (
              <div className="space-y-3">
                {needsWatering.slice(0, 5).map((arbre) => (
                  <div key={arbre._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <span className="font-medium">{arbre.type}</span>
                      <span className="text-gray-500 ml-2 text-sm">{arbre.localisation?.adresse}</span>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                      Arroser
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Tous les arbres sont bien arrosés! 🎉</p>
            )}
          </div>

          {/* Événements à venir */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Événements à Venir</h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((evenement) => (
                  <div key={evenement._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{evenement.titre}</h3>
                        <p className="text-sm text-gray-600 mt-1">{evenement.description}</p>
                        <div className="text-sm text-gray-500 mt-2">
                          📍 {evenement.localisation?.adresse}, {evenement.localisation?.ville}
                        </div>
                        <div className="text-sm text-gray-500">
                          🕐 {new Date(evenement.date).toLocaleDateString('fr-FR')} - {evenement.heureDebut} à {evenement.heureFin}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        evenement.type === 'plantation' ? 'bg-green-100 text-green-800' :
                        evenement.type === 'arrosage' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {evenement.type}
                      </span>
                    </div>
                    <button className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      Participer
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucun événement à venir pour le moment.</p>
            )}
          </div>

          {/* Préférences de participation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">⚙️ Mes Préférences de Participation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg text-center ${profile?.preferencesParticipation?.planter ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">🌱</div>
                <div className="font-medium">Planter</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${profile?.preferencesParticipation?.arroser ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">💧</div>
                <div className="font-medium">Arroser</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${profile?.preferencesParticipation?.donner ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">💰</div>
                <div className="font-medium">Donner</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${profile?.preferencesParticipation?.evenements ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">🎉</div>
                <div className="font-medium">Événements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}