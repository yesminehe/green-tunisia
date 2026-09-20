# Testing Guide

## Test Generation Commands

### Model Tests
```bash
npm run generate:test model Zone tests/models
npm run generate:test model Utilisateur tests/models
npm run generate:test model Campagne tests/models
npm run generate:test model Evenement tests/models
npm run generate:test model Badge tests/models
npm run generate:test model Partenaire tests/models
```

### Route Tests
```bash
npm run generate:test route arbres tests/api
npm run generate:test route evenements tests/api
npm run generate:test route campagnes tests/api
npm run generate:test route utilisateurs tests/api
npm run generate:test route zones tests/api
npm run generate:test route badges tests/api
npm run generate:test route alertes tests/api
npm run generate:test route missions tests/api
npm run generate:test route dashboard tests/api
```

### Service Tests
```bash
npm run generate:test service alerteArrosage tests/services
npm run generate:test service badgeService tests/services
npm run generate:test service missionJour tests/services
```

### Middleware Tests
```bash
npm run generate:test middleware auth tests/middlewares
npm run generate:test middleware error tests/middlewares
npm run generate:test middleware validate tests/middlewares
```

## Test Execution Commands

```bash
# Run all tests (logic + integration)
npm test

# Run only logic tests (no database)
npm run test:logic

# Run only integration tests (with database)
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.js              # Test configuration with MongoDB Memory Server
├── models/                # Model logic tests (no database)
│   ├── Arbre.test.js
│   ├── Zone.test.js
│   ├── Utilisateur.test.js
│   └── Campagne.test.js
├── api/                   # API logic tests (no database)
│   └── arbres.test.js
├── services/              # Service logic tests (no database)
│   ├── alerteArrosage.test.js
│   └── badgeService.test.js
└── integration/           # Integration tests (with database)
    ├── Arbre.integration.test.js
    └── api.integration.test.js
```

## Integration Tests

Integration tests use MongoDB Memory Server for:
- Real database operations
- Testing model methods and validations
- Testing API endpoints with actual data
- Higher code coverage

## TODO Items

After generating test files, you need to:
1. Replace TODO comments with actual test data
2. Add specific assertions for your business logic
3. Test edge cases and error scenarios
4. Ensure tests are independent and repeatable