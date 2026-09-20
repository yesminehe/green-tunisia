'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false, requireMember = false }: { children: React.ReactNode; requireAdmin?: boolean; requireMember?: boolean }) {
  const { isAuthenticated, isAdmin, isMember, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
      } else if (requireAdmin && !isAdmin) {
        setError('Accès non autorisé. Vous devez être administrateur.');
        setTimeout(() => router.push('/'), 2000);
      } else if (requireMember && !isMember) {
        setError('Accès non autorisé. Cette page est réservée aux membres.');
        setTimeout(() => router.push('/admin/dashboard'), 2000);
      }
    }
  }, [isAuthenticated, isAdmin, isMember, loading, router, requireAdmin, requireMember]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirection vers l'accueil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin) || (requireMember && !isMember)) {
    return null;
  }

  return <>{children}</>;
}