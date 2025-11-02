import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Content Categorization API
 * Automatically categorizes crypto content into predefined categories
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title && !content) {
      return NextResponse.json(
        { error: 'Title or content is required' },
        { status: 400 }
      );
    }

    const result = await categorizeContent(title, content);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Categorization Error:', error);
    return NextResponse.json(
      { error: 'Categorization failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Categorize content using AI
 */
async function categorizeContent(title: string, content: string) {
  const aiProvider = process.env.AI_PROVIDER || 'openai';
  const apiKey = process.env[`${aiProvider.toUpperCase()}_API_KEY`];

  if (!apiKey) {
    throw new Error(`${aiProvider.toUpperCase()}_API_KEY not configured`);
  }

  // Define available categories
  const categories = [
    { id: 'defi', name: 'DeFi', keywords: ['lending', 'borrowing', 'yield', 'liquidity', 'dex', 'swap'] },
    { id: 'nft', name: 'NFT', keywords: ['nft', 'collectible', 'art', 'marketplace', 'opensea'] },
    { id: 'layer2', name: 'Layer 2', keywords: ['layer2', 'scaling', 'rollup', 'arbitrum', 'optimism'] },
    { id: 'trading', name: 'Trading', keywords: ['trading', 'exchange', 'cex', 'spot', 'futures'] },
    { id: 'airdrop', name: 'Airdrop & Points', keywords: ['airdrop', 'points', 'reward', 'incentive'] },
    { id: 'staking', name: 'Staking', keywords: ['staking', 'validator', 'pos', 'delegation'] },
    { id: 'gaming', name: 'GameFi', keywords: ['game', 'gaming', 'play2earn', 'metaverse'] },
    { id: 'infrastructure', name: 'Infrastructure', keywords: ['infrastructure', 'protocol', 'blockchain', 'network'] },
  ];

  const systemPrompt = `You are an expert in cryptocurrency and blockchain technology.
Categorize the given content into ONE primary category and optional subcategories.
Also extract relevant tags and provide a confidence score.

Available categories:
${categories.map(c => `- ${c.name} (${c.id}): ${c.keywords.join(', ')}`).join('\n')}

Return JSON format:
{
  "category": "category_id",
  "subcategory": "optional_subcategory",
  "confidence": 0.0-1.0,
  "tags": ["tag1", "tag2", "tag3"],
  "reasoning": "brief explanation"
}`;

  const userPrompt = `Title: ${title}\n\nContent: ${content.substring(0, 1000)}`;

  if (aiProvider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return { ...result, provider: 'openai' };
  } else if (aiProvider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    return { ...result, provider: 'anthropic' };
  } else if (aiProvider === 'openrouter') {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'CryptoPlay News Scraper',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenRouter API error: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }

    const result = JSON.parse(content);
    return { ...result, provider: 'openrouter' };
  }

  throw new Error(`Unsupported AI provider: ${aiProvider}`);
}
