import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Content Quality Scoring API
 * Evaluates content quality and provides improvement suggestions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title = '', content_type = 'news' } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const result = await evaluateQuality(content, title, content_type);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Quality Scoring Error:', error);
    return NextResponse.json(
      { error: 'Quality scoring failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Evaluate content quality using AI
 */
async function evaluateQuality(content: string, title: string, contentType: string) {
  const aiProvider = process.env.AI_PROVIDER || 'openai';
  const apiKey = process.env[`${aiProvider.toUpperCase()}_API_KEY`];

  if (!apiKey) {
    throw new Error(`${aiProvider.toUpperCase()}_API_KEY not configured`);
  }

  const systemPrompt = `You are a content quality analyst for cryptocurrency content.
Evaluate the content based on multiple factors and provide a comprehensive quality score.

Evaluation Criteria:
1. Readability (0-100): Grammar, structure, clarity
2. Informativeness (0-100): Depth of information, practical value
3. Accuracy (0-100): Technical correctness, factual information
4. Originality (0-100): Unique insights, not just aggregated news
5. Structure (0-100): Organization, formatting, use of headers

For strategy content, also consider:
- Clear step-by-step instructions
- Risk disclosure
- Capital requirements
- Expected outcomes

Return JSON format:
{
  "overall_score": 0-100,
  "factors": {
    "readability": 0-100,
    "informativeness": 0-100,
    "accuracy": 0-100,
    "originality": 0-100,
    "structure": 0-100
  },
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "is_publishable": true/false,
  "reasoning": "brief explanation"
}`;

  const userPrompt = `Content Type: ${contentType}\nTitle: ${title}\n\nContent:\n${content}`;

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

    return {
      ...result,
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
        max_tokens: 2048,
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

    return {
      ...result,
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

    return {
      ...result,
      provider: 'openrouter'
    };
  }

  throw new Error(`Unsupported AI provider: ${aiProvider}`);
}
