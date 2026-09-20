const Utilisateur = require('../../models/Utilisateur');

describe('Utilisateur Model Tests with Real Methods', () => {
  describe('Model Methods', () => {
    it('should calculate score impact correctly', () => {
      const utilisateur = new Utilisateur({
        nom: 'Test User',
        prenom: 'Test',
        email: 'test@example.com',
        motDePasse: 'hashedpassword',
        statistiques: {
          arbresPlantes: 5,
          eauApportee: 100,
          donnees: 50,
          evenementsParticipes: 2,
          arbresAdoptes: 1
        }
      });

      const score = utilisateur.calculerScoreImpact();
      expect(score).toBe(715);
    });

    it('should return zero score for no contributions', () => {
      const utilisateur = new Utilisateur({
        nom: 'Test User',
        prenom: 'Test',
        email: 'test@example.com',
        motDePasse: 'hashedpassword',
        statistiques: {
          arbresPlantes: 0,
          eauApportee: 0,
          donnees: 0,
          evenementsParticipes: 0,
          arbresAdoptes: 0
        }
      });

      const score = utilisateur.calculerScoreImpact();
      expect(score).toBe(0);
    });

    it('should check if user has badge', () => {
      const utilisateur = new Utilisateur({
        nom: 'Test User',
        prenom: 'Test',
        email: 'test@example.com',
        motDePasse: 'hashedpassword',
        badges: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
      });

      expect(utilisateur.aBadge('507f1f77bcf86cd799439011')).toBe(true);
      expect(utilisateur.aBadge('507f1f77bcf86cd799439013')).toBe(false);
    });

    it('should return false for no badges', () => {
      const utilisateur = new Utilisateur({
        nom: 'Test User',
        prenom: 'Test',
        email: 'test@example.com',
        motDePasse: 'hashedpassword',
        badges: []
      });

      expect(utilisateur.aBadge('507f1f77bcf86cd799439011')).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should validate required fields', async () => {
      const utilisateur = new Utilisateur({
        nom: 'Test User'
        // Missing required fields
      });

      let validationError = null;
      try {
        await utilisateur.validate();
      } catch (error) {
        validationError = error;
      }
      expect(validationError).not.toBeNull();
    });

    it('should accept valid utilisateur data', async () => {
      const utilisateur = new Utilisateur({
        nom: 'Test User',
        prenom: 'Test',
        email: 'test@example.com',
        motDePasse: 'hashedpassword'
      });

      let validationError = null;
      try {
        await utilisateur.validate();
      } catch (error) {
        validationError = error;
      }
      expect(validationError).toBeNull();
    });
  });

  describe('Schema Structure', () => {
    it('should have correct default values', () => {
      const utilisateur = new Utilisateur({
        nom: 'Test User',
        prenom: 'Test',
        email: 'test@example.com',
        motDePasse: 'hashedpassword'
      });

      expect(utilisateur.role).toBe('membre');
      expect(utilisateur.actif).toBe(true);
      expect(utilisateur.statistiques.arbresPlantes).toBe(0);
      expect(utilisateur.scoreImpact).toBe(0);
    });

    it('should handle preferences structure', () => {
      const utilisateur = new Utilisateur({
        nom: 'Test User',
        prenom: 'Test',
        email: 'test@example.com',
        motDePasse: 'hashedpassword',
        preferencesParticipation: {
          planter: true,
          arroser: true,
          donner: false,
          evenements: true
        }
      });

      expect(utilisateur.preferencesParticipation.planter).toBe(true);
      expect(utilisateur.preferencesParticipation.donner).toBe(false);
    });
  });
});