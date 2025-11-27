const {createClient} = require('@sanity/client');
const {schemaTypes} = require('../sanity/schemaTypes/index.ts');

try {
  console.log('Schema types:', schemaTypes.map(t => t.name || t.type));
  console.log('\nValidating schema...');
  
  // Try to find issues
  schemaTypes.forEach((type, i) => {
    if (!type) {
      console.error(`❌ Schema type at index ${i} is undefined/null`);
      return;
    }
    if (!type.name) {
      console.error(`❌ Schema type at index ${i} has no name:`, type);
      return;
    }
    console.log(`✓ ${type.name}`);
  });
} catch (error) {
  console.error('Error loading schema:', error);
  console.error('Stack:', error.stack);
}
