const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
});

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create live_opportunities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS live_opportunities (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        symbol VARCHAR(20) NOT NULL,
        data JSONB NOT NULL,
        profit_percent DECIMAL(8,4),
        risk_level INTEGER,
        liquidity_score VARCHAR(20),
        quality_score VARCHAR(20),
        detected_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_live_opportunities_type ON live_opportunities(type);
      CREATE INDEX IF NOT EXISTS idx_live_opportunities_symbol ON live_opportunities(symbol);
      CREATE INDEX IF NOT EXISTS idx_live_opportunities_status ON live_opportunities(status);
      CREATE INDEX IF NOT EXISTS idx_live_opportunities_detected ON live_opportunities(detected_at DESC);

      COMMENT ON TABLE live_opportunities IS '实时套利机会表（仅主流类型）';
    `);

    console.log('✅ live_opportunities table created successfully');

    // Verify
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'live_opportunities'
      ORDER BY ordinal_position;
    `);

    console.log('\n📊 live_opportunities columns:');
    result.rows.forEach(row => console.log(`   - ${row.column_name}: ${row.data_type}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();