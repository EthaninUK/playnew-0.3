const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function removeCategoriesCollection() {
  try {
    await client.connect();
    console.log('Connected to database\n');

    // Remove categories from directus_collections
    console.log('Removing categories collection from Directus...');

    // First, remove all fields related to categories
    const deleteFieldsQuery = `DELETE FROM directus_fields WHERE collection = 'categories';`;
    const fieldsResult = await client.query(deleteFieldsQuery);
    console.log(`✓ Removed ${fieldsResult.rowCount} field definitions`);

    // Remove relations
    const deleteRelationsQuery = `
      DELETE FROM directus_relations
      WHERE many_collection = 'categories' OR one_collection = 'categories';
    `;
    const relationsResult = await client.query(deleteRelationsQuery);
    console.log(`✓ Removed ${relationsResult.rowCount} relations`);

    // Remove permissions
    const deletePermissionsQuery = `DELETE FROM directus_permissions WHERE collection = 'categories';`;
    const permissionsResult = await client.query(deletePermissionsQuery);
    console.log(`✓ Removed ${permissionsResult.rowCount} permissions`);

    // Finally, remove the collection itself
    const deleteCollectionQuery = `DELETE FROM directus_collections WHERE collection = 'categories';`;
    const collectionResult = await client.query(deleteCollectionQuery);
    console.log(`✓ Removed ${collectionResult.rowCount} collection definition`);

    console.log('\n✅ Successfully removed categories collection from Directus');
    console.log('  (Note: The Chatwoot categories table remains intact)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

removeCategoriesCollection()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
