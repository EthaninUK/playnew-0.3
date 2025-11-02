const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function configureFields() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('📝 Configuring fields for playnew_categories collection...\n');

    // Define all fields
    const fields = [
      { field: 'id', type: 'uuid', interface: 'input', readonly: true, hidden: true, required: true },
      { field: 'name', type: 'string', interface: 'input', required: true, sort: 1 },
      { field: 'slug', type: 'string', interface: 'input', required: true, sort: 2 },
      { field: 'type', type: 'string', interface: 'select-dropdown', required: true, sort: 3, options: { choices: [{ text: 'Parent', value: 'parent' }, { text: 'Strategy', value: 'strategy' }, { text: 'Tool', value: 'tool' }] } },
      { field: 'parent_id', type: 'uuid', interface: 'select-dropdown-m2o', special: ['m2o'], sort: 4, options: { template: '{{name}}' } },
      { field: 'description', type: 'text', interface: 'input-multiline', sort: 5 },
      { field: 'icon', type: 'string', interface: 'input', sort: 6 },
      { field: 'order_index', type: 'integer', interface: 'input', sort: 7 },
      { field: 'is_active', type: 'boolean', interface: 'boolean', sort: 8, default_value: true },
      { field: 'created_at', type: 'timestamp', interface: 'datetime', readonly: true, hidden: true, special: ['date-created'] },
      { field: 'updated_at', type: 'timestamp', interface: 'datetime', readonly: true, hidden: true, special: ['date-updated'] }
    ];

    for (const field of fields) {
      const options = field.options ? JSON.stringify(field.options) : null;
      const special = field.special ? JSON.stringify(field.special) : null;

      await client.query(`
        INSERT INTO directus_fields (collection, field, special, interface, options, display, display_options, readonly, hidden, sort, "group", translations, note, conditions, required, validation)
        VALUES ($1, $2, $3, $4, $5, NULL, NULL, $6, $7, $8, NULL, NULL, NULL, NULL, $9, NULL)
        ON CONFLICT (collection, field) DO UPDATE SET
          special = EXCLUDED.special,
          interface = EXCLUDED.interface,
          options = EXCLUDED.options,
          readonly = EXCLUDED.readonly,
          hidden = EXCLUDED.hidden,
          sort = EXCLUDED.sort,
          required = EXCLUDED.required;
      `, [
        'playnew_categories',
        field.field,
        special,
        field.interface,
        options,
        field.readonly || false,
        field.hidden || false,
        field.sort || null,
        field.required || false
      ]);

      console.log(`  ✅ ${field.field}`);
    }

    // Add relation for parent_id
    console.log('\n📝 Configuring parent_id relation...');
    await client.query(`
      INSERT INTO directus_relations (many_collection, many_field, one_collection, one_field, one_collection_field, one_allowed_collections, junction_field, sort_field, one_deselect_action)
      VALUES ('playnew_categories', 'parent_id', 'playnew_categories', NULL, NULL, NULL, NULL, NULL, 'nullify')
      ON CONFLICT (many_collection, many_field) DO UPDATE SET
        one_collection = EXCLUDED.one_collection,
        one_deselect_action = EXCLUDED.one_deselect_action;
    `);
    console.log('✅ Relation configured\n');

    // Configure permissions for public access
    console.log('📝 Configuring public read permissions...');

    // Get the public role ID (null role means public)
    const publicRoleQuery = await client.query(`
      SELECT id FROM directus_policies WHERE name = 'Public' LIMIT 1;
    `);

    let policyId = null;
    if (publicRoleQuery.rows.length > 0) {
      policyId = publicRoleQuery.rows[0].id;
    } else {
      // Create public policy if it doesn't exist
      const createPolicyResult = await client.query(`
        INSERT INTO directus_policies (name, icon, description, ip_access, enforce_tfa, admin_access, app_access)
        VALUES ('Public', 'public', 'Public access policy', NULL, false, false, false)
        RETURNING id;
      `);
      policyId = createPolicyResult.rows[0].id;
    }

    await client.query(`
      INSERT INTO directus_permissions (policy, collection, action, permissions, validation, presets, fields)
      VALUES ($1, 'playnew_categories', 'read', '{}', NULL, NULL, '*')
      ON CONFLICT (policy, collection, action) DO UPDATE SET
        permissions = EXCLUDED.permissions,
        fields = EXCLUDED.fields;
    `, [policyId]);
    console.log('✅ Public read permission granted\n');

    console.log('✅ All fields configured successfully!');
    console.log('\n📌 You can now access the playnew_categories collection in Directus admin panel.');
    console.log('📌 Collection URL: http://localhost:8055/admin/content/playnew_categories');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

configureFields();
