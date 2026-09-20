const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Generating all test files...\n');

const testCommands = [
  // Model tests
  { type: 'model', name: 'Zone', path: 'tests/models' },
  { type: 'model', name: 'Utilisateur', path: 'tests/models' },
  { type: 'model', name: 'Campagne', path: 'tests/models' },
  { type: 'model', name: 'Evenement', path: 'tests/models' },
  { type: 'model', name: 'Badge', path: 'tests/models' },
  { type: 'model', name: 'Partenaire', path: 'tests/models' },
  
  // Route tests
  { type: 'route', name: 'arbres', path: 'tests/api' },
  { type: 'route', name: 'evenements', path: 'tests/api' },
  { type: 'route', name: 'campagnes', path: 'tests/api' },
  { type: 'route', name: 'utilisateurs', path: 'tests/api' },
  { type: 'route', name: 'zones', path: 'tests/api' },
  { type: 'route', name: 'badges', path: 'tests/api' },
  { type: 'route', name: 'alertes', path: 'tests/api' },
  { type: 'route', name: 'missions', path: 'tests/api' },
  { type: 'route', name: 'dashboard', path: 'tests/api' },
  
  // Service tests
  { type: 'service', name: 'alerteArrosage', path: 'tests/services' },
  { type: 'service', name: 'badgeService', path: 'tests/services' },
  { type: 'service', name: 'missionJour', path: 'tests/services' },
];

testCommands.forEach(({ type, name, path: targetPath }) => {
  try {
    console.log(`Generating ${type} test for ${name}...`);
    execSync(`node scripts/generate-test.js ${type} ${name} ${targetPath}`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.error(`❌ Failed to generate test for ${name}:`, error.message);
  }
});

console.log('\n✅ All test files generated!');
console.log('📝 Don\'t forget to implement the TODO items in each test file.');
console.log('🧪 Run "npm test" to execute the tests.');