const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Arbre {
  _id: string;
  type: string;
  datePlantation: string;
  statut: string;
  zone?: string;
  photos?: string[];
  historique?: Array<{
    action: string;
    description: string;
    utilisateur?: string;
    date: string;
  }>;
  dateDernierArrosage?: string;
  quantiteEau?: number;
  nombreArrosages?: number;
  agePlantation?: number;
  qrCode?: string;
  localisation: {
    type: string;
    coordinates: [number, number];
    adresse?: string;
  };
  planteur?: {
    nom: string;
    email: string;
  };
  adoption?: {
    adopte: boolean;
    dureeAdoption: number;
  };
  journalVie?: Array<{
    date: string;
    typeEvenement: string;
    description: string;
    utilisateur: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        console.error('API Error:', error);
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request<{ statut: string; baseDeDonnees: string; horodatage: string }>('/health');
  }

  // Arbres
  async getArbres(): Promise<Arbre[]> {
    return this.request<Arbre[]>('/arbres');
  }

  async getArbre(id: string): Promise<Arbre> {
    return this.request<Arbre>(`/arbres/${id}`);
  }

  async createArbre(arbre: Partial<Arbre>): Promise<Arbre> {
    return this.request<Arbre>('/arbres', {
      method: 'POST',
      body: JSON.stringify(arbre),
    });
  }

  async updateArbre(id: string, arbre: Partial<Arbre>): Promise<Arbre> {
    return this.request<Arbre>(`/arbres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(arbre),
    });
  }

  async deleteArbre(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/arbres/${id}`, {
      method: 'DELETE',
    });
  }

  async arroserArbre(id: string, quantiteEau: number, utilisateur?: string): Promise<Arbre> {
    return this.request<Arbre>(`/arbres/${id}/arrosage`, {
      method: 'POST',
      body: JSON.stringify({ quantiteEau, utilisateur }),
    });
  }

  async updateArbreStatut(id: string, statut: string, utilisateur?: string): Promise<Arbre> {
    return this.request<Arbre>(`/arbres/${id}/statut`, {
      method: 'PUT',
      body: JSON.stringify({ statut, utilisateur }),
    });
  }

  async addArbrePhoto(id: string, photoUrl: string, utilisateur?: string): Promise<Arbre> {
    return this.request<Arbre>(`/arbres/${id}/photos`, {
      method: 'POST',
      body: JSON.stringify({ photoUrl, utilisateur }),
    });
  }

  async searchArbresByLocation(longitude: number, latitude: number, rayon: number): Promise<Arbre[]> {
    return this.request<Arbre[]>(`/arbres/recherche/localisation?longitude=${longitude}&latitude=${latitude}&rayon=${rayon}`);
  }

  async filterArbresByStatut(statut: string): Promise<Arbre[]> {
    return this.request<Arbre[]>(`/arbres/filtre/statut/${statut}`);
  }

  // Authentication
  async login(email: string, motDePasse: string) {
    const response = await this.request<{
      message: string;
      token: string;
      utilisateur: {
        id: string;
        _id?: string;
        nom: string;
        prenom?: string;
        email: string;
        role?: string;
        preferencesParticipation?: any;
      };
    }>('/utilisateurs/connexion', {
      method: 'POST',
      body: JSON.stringify({ email, motDePasse }),
    });
    
    // Fix the user ID to match backend response
    response.utilisateur.id = response.utilisateur.id || response.utilisateur._id || '';
    // Ensure prenom exists
    if (!response.utilisateur.prenom) {
      response.utilisateur.prenom = '';
    }
    return response;
  }

  async register(data: {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    telephone?: string;
  }) {
    return this.request<{
      message: string;
      token: string;
      utilisateur: {
        id: string;
        nom: string;
        prenom: string;
        email: string;
      };
    }>('/utilisateurs/inscription', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request<any>('/utilisateurs/profil');
  }

  // Events
  async getEvenements() {
    return this.request<any[]>('/evenements');
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const apiClient = new ApiClient();
