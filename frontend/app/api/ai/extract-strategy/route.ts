import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Strategy Extraction API
 * Extracts structured strategy information from unstructured content
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, url = '', title = '' } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const result = await extractStrategy(content, title, url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Strategy Extraction Error:', error);
    return NextResponse.json(
      { error: 'Strategy extraction failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Extract strategy using AI
 */
async function extractStrategy(content: string, title: string, url: string) {
  const aiProvider = process.env.AI_PROVIDER || 'openai';
  const apiKey = process.env[`${aiProvider.toUpperCase()}_API_KEY`];

  if (!apiKey) {
    throw new Error(`${aiProvider.toUpperCase()}_API_KEY not configured`);
  }

  const systemPrompt = `You are an expert DeFi strategy analyst. Extract structured information from crypto strategy content.

Extract the following information:
1. Title: Clear, concise strategy title in Chinese
2. Summary: 2-3 sentence overview
3. Steps: Detailed step-by-step instructions (in Chinese)
4. Risk Level: 1-5 (1=very low, 5=very high)
5. APY Range: Estimated annual percentage yield (min and max)
6. Required Capital: Minimum recommended investment
7. Difficulty: beginner/intermediate/advanced
8. Protocols: List of protocols/platforms used
9. Chains: Blockchain networks involved
10. Tags: Relevant keywords

Return JSON format:
{
  "title": "strategy title in Chinese",
  "summary": "brief overview in Chinese",
  "steps": [
    "步骤 1: detailed instruction",
    "步骤 2: detailed instruction"
  ],
  "risk_level": 1-5,
  "apy_range": {
    "min": 0,
    "max": 100
  },
  "required_capital": "$1000" or "具体金额",
  "difficulty": "beginner|intermediate|advanced",
  "protocols": ["Protocol1", "Protocol2"],
  "chains": ["Ethereum", "Arbitrum"],
  "tags": ["tag1", "tag2"],
  "warnings": ["warning1", "warning2"] // if any risks
}`;

  const userPrompt = `Title: ${title}\nURL: ${url}\n\nContent:\n${content}`;

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
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      ...result,
      source_url: url,
      provider: 'openai'
    };
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
        max_tokens: 4096,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.content[0].text);

    return {
      ...result,
      source_url: url,
      provider: 'anthropic'
    };
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
        temperature: 0.3,
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

    return {
      ...result,
      source_url: url,
      provider: 'openrouter'
    };
  }

  throw new Error(`Unsupported AI provider: ${aiProvider}`);
}
