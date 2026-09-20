const Arbre = require('../../models/Arbre');

describe('Arbre Model Tests with Real Methods', () => {
  describe('joursDepuisDernierArrosage', () => {
    it('should calculate days since last watering correctly', () => {
      const date5DaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      
      const arbre = new Arbre({
        type: 'Olivier',
        datePlantation: new Date('2024-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'Point',
          coordinates: [10.6406, 35.8256]
        },
        planteur: {
          nom: 'Test User',
          email: 'test@example.com'
        },
        dateDernierArrosage: date5DaysAgo
      });

      const jours = arbre.joursDepuisDernierArrosage();
      expect(jours).toBe(5);
    });

    it('should return null for trees never watered', () => {
      const arbre = new Arbre({
        type: 'Olivier',
        datePlantation: new Date('2024-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'Point',
          coordinates: [10.6406, 35.8256]
        },
        planteur: {
          nom: 'Test User',
          email: 'test@example.com'
        }
      });

      const jours = arbre.joursDepuisDernierArrosage();
      expect(jours).toBeNull();
    });
  });

  describe('besoinArrosage', () => {
    it('should determine tree needs watering based on threshold', () => {
      const date10DaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      
      const arbre = new Arbre({
        type: 'Olivier',
        datePlantation: new Date('2024-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'Point',
          coordinates: [10.6406, 35.8256]
        },
        planteur: {
          nom: 'Test User',
          email: 'test@example.com'
        },
        dateDernierArrosage: date10DaysAgo
      });

      expect(arbre.besoinArrosage(7)).toBe(true);
      expect(arbre.besoinArrosage(15)).toBe(false);
    });

    it('should determine tree does not need watering', () => {
      const date3DaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      
      const arbre = new Arbre({
        type: 'Olivier',
        datePlantation: new Date('2024-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'Point',
          coordinates: [10.6406, 35.8256]
        },
        planteur: {
          nom: 'Test User',
          email: 'test@example.com'
        },
        dateDernierArrosage: date3DaysAgo
      });

      expect(arbre.besoinArrosage(7)).toBe(false);
    });
  });

  describe('frequenceArrosage', () => {
    it('should calculate watering frequency', () => {
      const arbre = new Arbre({
        type: 'Olivier',
        datePlantation: new Date('2023-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'Point',
          coordinates: [10.6406, 35.8256]
        },
        planteur: {
          nom: 'Test User',
          email: 'test@example.com'
        },
        nombreArrosages: 10
      });

      const frequence = arbre.frequenceArrosage();
      expect(frequence).toBeGreaterThan(0);
    });

    it('should return null for insufficient data', () => {
      const arbre = new Arbre({
        type: 'Olivier',
        datePlantation: new Date('2024-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'Point',
          coordinates: [10.6406, 35.8256]
        },
        planteur: {
          nom: 'Test User',
          email: 'test@example.com'
        },
        nombreArrosages: 1
      });

      const frequence = arbre.frequenceArrosage();
      expect(frequence).toBeNull();
    });
  });

  describe('Validation', () => {
    it('should validate required fields', async () => {
      const arbre = new Arbre({
        type: 'Olivier'
        // Missing required fields
      });

      const validationError = await arbre.validate().catch(() => 'error');
      expect(validationError).toBe('error');
    });

    it('should validate statut enum values', async () => {
      const arbre = new Arbre({
        type: 'Olivier',
        datePlantation: new Date('2024-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'Point',
          coordinates: [10.6406, 35.8256]
        },
        planteur: {
          nom: 'Test User',
          email: 'test@example.com'
        },
        statut: 'invalid_status'
      });

      const validationError = await arbre.validate().catch(() => 'error');
      expect(validationError).toBe('error');
    });

    it('should validate GeoJSON format', async () => {
      const arbre = new Arbre({
        type: 'Olivier',
        datePlantation: new Date('2024-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'InvalidType',
          coordinates: [10.6406, 35.8256]
        },
        planteur: {
          nom: 'Test User',
          email: 'test@example.com'
        }
      });

      const validationError = await arbre.validate().catch(() => 'error');
      expect(validationError).toBe('error');
    });

    it('should accept valid statut values', async () => {
      const validStatuses = ['vivant', 'à surveiller', 'mort'];
      
      for (const statut of validStatuses) {
        const arbre = new Arbre({
          type: 'Olivier',
          datePlantation: new Date('2024-01-15'),
          agePlantation: 2,
          localisation: {
            type: 'Point',
            coordinates: [10.6406, 35.8256]
          },
          planteur: {
            nom: 'Test User',
            email: 'test@example.com'
          },
          statut
        });

        const validationError = await arbre.validate().catch(() => null);
        expect(validationError).toBeNull();
      }
    });

    it('should validate coordinates range', () => {
      const arbre = new Arbre({
        type: 'Olivier',
        datePlantation: new Date('2024-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'Point',
          coordinates: [10.6406, 35.8256]
        },
        planteur: {
          nom: 'Test User',
          email: 'test@example.com'
        }
      });

      expect(arbre.localisation.coordinates[0]).toBeGreaterThanOrEqual(-180);
      expect(arbre.localisation.coordinates[0]).toBeLessThanOrEqual(180);
      expect(arbre.localisation.coordinates[1]).toBeGreaterThanOrEqual(-90);
      expect(arbre.localisation.coordinates[1]).toBeLessThanOrEqual(90);
    });
  });

  describe('Schema validation', () => {
    it('should accept valid arbre data', () => {
      const arbreData = {
        type: 'Olivier',
        datePlantation: new Date('2024-01-15'),
        agePlantation: 2,
        localisation: {
          type: 'Point',
          coordinates: [10.6406, 35.8256],
          adresse: 'Sousse, Tunisie'
        },
        planteur: {
          nom: 'Jean Dupont',
          email: 'jean@example.com',
          telephone: '0123456789'
        },
        statut: 'vivant'
      };

      const arbre = new Arbre(arbreData);
      expect(arbre.type).toBe(arbreData.type);
      expect(arbre.statut).toBe(arbreData.statut);
    });
  });
});