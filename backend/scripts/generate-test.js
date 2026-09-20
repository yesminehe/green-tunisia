const fs = require('fs');
const path = require('path');

const templates = {
  model: (modelName) => `const ${modelName} = require('../../models/${modelName}');

describe('${modelName} Model', () => {
  describe('Basic validations', () => {
    it('should create a valid ${modelName.toLowerCase()}', () => {
      // TODO: Add test data
      const data = {};
      const instance = new ${modelName}(data);
      
      expect(instance).toBeDefined();
    });

    it('should fail validation for missing required fields', () => {
      // TODO: Add validation test
      const instance = new ${modelName}({});
      
      // TODO: Add expectation
    });
  });

  describe('Business logic', () => {
    it('should calculate business metrics correctly', () => {
      // TODO: Add business logic tests
    });

    it('should handle edge cases', () => {
      // TODO: Add edge case tests
    });
  });
});`,

  route: (routeName) => `const request = require('supertest');
const express = require('express');
const ${routeName}Routes = require('../../routes/${routeName}');

const app = express();
app.use(express.json());
app.use('/api/${routeName}', ${routeName}Routes);

describe('${routeName} API', () => {
  describe('GET /api/${routeName}', () => {
    it('should get all ${routeName.toLowerCase()}s', async () => {
      const response = await request(app)
        .get('/api/${routeName}')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/${routeName}/:id', () => {
    it('should get a single ${routeName.toLowerCase()} by ID', async () => {
      // TODO: Add test with real ID
      const id = 'test-id';
      
      const response = await request(app)
        .get(\`/api/${routeName}/\${id}\`)
        .expect(200);

      expect(response.body._id).toBeDefined();
    });

    it('should return 404 for non-existent ${routeName.toLowerCase()}', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .get(\`/api/${routeName}/\${fakeId}\`)
        .expect(404);
    });
  });

  describe('POST /api/${routeName}', () => {
    it('should create a new ${routeName.toLowerCase()}', async () => {
      const newData = {
        // TODO: Add required fields
      };

      const response = await request(app)
        .post('/api/${routeName}')
        .send(newData)
        .expect(201);

      expect(response.body._id).toBeDefined();
    });

    it('should fail validation for invalid data', async () => {
      const invalidData = {
        // TODO: Add invalid data
      };

      await request(app)
        .post('/api/${routeName}')
        .send(invalidData)
        .expect(400);
    });
  });
});`,

  service: (serviceName) => `const ${serviceName} = require('../../services/${serviceName}');

describe('${serviceName} Service', () => {
  describe('Core functionality', () => {
    it('should perform main operation correctly', async () => {
      // TODO: Add service test
      const result = await ${serviceName}.mainMethod();
      
      expect(result).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      // TODO: Add error handling test
      await expect(
        ${serviceName}.mainMethod()
      ).resolves.toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty input', async () => {
      // TODO: Add edge case test
    });

    it('should handle concurrent operations', async () => {
      // TODO: Add concurrency test
    });
  });
});`
};

function generateTest(type, name, targetPath) {
  const template = templates[type];
  if (!template) {
    console.error(`Unknown type: ${type}. Available: model, route, service`);
    return;
  }

  const testContent = template(name);
  const testFileName = `${name}.test.js`;
  const testFilePath = path.join(targetPath, testFileName);

  // Create directory if it doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  fs.writeFileSync(testFilePath, testContent);
  console.log(`✅ Generated: ${testFilePath}`);
  console.log(`📝 Don't forget to implement the TODO items in the test file.`);
}

// CLI usage
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node scripts/generate-test.js <type> <name> <targetPath>');
  console.log('Types: model, route, service');
  console.log('Examples:');
  console.log('  node scripts/generate-test.js model Zone tests/models');
  console.log('  node scripts/generate-test.js route evenements tests/api');
  console.log('  node scripts/generate-test.js service badgeService tests/services');
  process.exit(1);
}

const [type, name, targetPath] = args;
generateTest(type, name, targetPath);