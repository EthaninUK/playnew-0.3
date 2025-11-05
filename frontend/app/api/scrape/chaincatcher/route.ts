import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * API endpoint to trigger ChainCatcher scraping
 *
 * POST /api/scrape/chaincatcher
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting ChainCatcher scraping via API...');

    // Execute the scraper script
    // In production with PM2, cwd is /var/www/playnew/frontend, so we need to go up one level
    // In development, cwd is the project root
    const projectRoot = process.cwd();
    const scriptPath = projectRoot.endsWith('frontend')
      ? path.join(projectRoot, '..', 'scrape-chaincatcher-simple.js')
      : path.join(projectRoot, 'scrape-chaincatcher-simple.js');

    const { stdout, stderr } = await execAsync(`node ${scriptPath}`, {
      timeout: 60000 // 60 second timeout
    });

    console.log('✅ Scraper completed');

    // Parse the output to extract statistics
    const savedMatch = stdout.match(/Saved: (\d+)/);
    const skippedMatch = stdout.match(/Skipped: (\d+)/);
    const errorsMatch = stdout.match(/Errors: (\d+)/);

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        saved: savedMatch ? parseInt(savedMatch[1]) : 0,
        skipped: skippedMatch ? parseInt(skippedMatch[1]) : 0,
        errors: errorsMatch ? parseInt(errorsMatch[1]) : 0
      },
      output: stdout,
      stderr: stderr || null
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Scraper failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check scraper status
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ready',
    message: 'ChainCatcher scraper API is ready. Use POST to trigger scraping.',
    endpoint: '/api/scrape/chaincatcher'
  });
}
