import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Translation and Summarization API
 * Used by n8n workflows to process scraped content
 */
export async function POST(request: NextRequest) {
  try {
    // First, read the raw text
    const rawText = await request.text();
    console.log('[DEBUG] Raw request body (first 300 chars):', rawText.substring(0, 300));

    let body;
    try {
      body = JSON.parse(rawText);
      console.log('[DEBUG] Parsed successfully. Keys:', Object.keys(body).join(', '));
    } catch (jsonError) {
      console.error('[DEBUG] Failed to parse JSON:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', details: jsonError instanceof Error ? jsonError.message : 'Unknown error', rawBody: rawText.substring(0, 200) },
        { status: 400 }
      );
    }

    const { text, source_language = 'en', target_language = 'zh', title = '' } = body;

    if (!text) {
      console.log('[DEBUG] Error: text is missing');
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    console.log('[DEBUG] Processing with provider:', process.env.AI_PROVIDER);

    // Select AI provider based on environment variables
    const aiProvider = process.env.AI_PROVIDER || 'openai';
    let result;

    switch (aiProvider) {
      case 'anthropic':
        result = await translateWithAnthropic(text, source_language, target_language, title);
        break;
      case 'deepseek':
        result = await translateWithDeepSeek(text, source_language, target_language, title);
        break;
      case 'openrouter':
        result = await translateWithOpenRouter(text, source_language, target_language, title);
        break;
      case 'openai':
      default:
        result = await translateWithOpenAI(text, source_language, target_language, title);
        break;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Translation Error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Translate using OpenAI GPT-4
 */
async function translateWithOpenAI(
  text: string,
  sourceLang: string,
  targetLang: string,
  title: string
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const systemPrompt = `You are an expert cryptocurrency content translator and summarizer.
Translate the content from ${sourceLang} to ${targetLang} professionally, maintaining technical accuracy.
Also generate a concise summary (2-3 sentences) and extract 3-5 relevant keywords.

Output format (JSON):
{
  "translated_title": "translated title here",
  "translated_text": "full translated content here",
  "summary": "2-3 sentence summary in ${targetLang}",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

  const userPrompt = `Title: ${title}\n\nContent:\n${text}`;

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
    translated_title: result.translated_title || title,
    translated_text: result.translated_text,
    summary: result.summary,
    keywords: result.keywords || [],
    provider: 'openai'
  };
}

/**
 * Translate using Anthropic Claude
 */
async function translateWithAnthropic(
  text: string,
  sourceLang: string,
  targetLang: string,
  title: string
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const prompt = `Translate this cryptocurrency content from ${sourceLang} to ${targetLang}.
Also provide a concise summary and keywords.

Title: ${title}

Content:
${text}

Respond in JSON format:
{
  "translated_title": "translated title",
  "translated_text": "full translation",
  "summary": "2-3 sentence summary",
  "keywords": ["keyword1", "keyword2"]
}`;

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
        { role: 'user', content: prompt }
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
    translated_title: result.translated_title || title,
    translated_text: result.translated_text,
    summary: result.summary,
    keywords: result.keywords || [],
    provider: 'anthropic'
  };
}

/**
 * Translate using DeepSeek
 */
async function translateWithDeepSeek(
  text: string,
  sourceLang: string,
  targetLang: string,
  title: string
) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  const systemPrompt = `You are a cryptocurrency content translator. Translate from ${sourceLang} to ${targetLang}.
Return JSON with: translated_title, translated_text, summary, keywords.`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Title: ${title}\n\nContent: ${text}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);

  return {
    translated_title: result.translated_title || title,
    translated_text: result.translated_text,
    summary: result.summary,
    keywords: result.keywords || [],
    provider: 'deepseek'
  };
}

/**
 * Translate using OpenRouter
 */
async function translateWithOpenRouter(
  text: string,
  sourceLang: string,
  targetLang: string,
  title: string
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const systemPrompt = `You are an expert cryptocurrency content translator and summarizer.
Translate the content from ${sourceLang} to ${targetLang} professionally, maintaining technical accuracy.
Also generate a concise summary (2-3 sentences) and extract 3-5 relevant keywords.

Output format (JSON):
{
  "translated_title": "translated title here",
  "translated_text": "full translated content here",
  "summary": "2-3 sentence summary in ${targetLang}",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

  const userPrompt = `Title: ${title}\n\nContent:\n${text}`;

  // OpenRouter uses OpenAI-compatible API
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
      // Note: response_format not supported by all OpenRouter models
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenRouter API error: ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content;

  // Debug: log the raw content
  console.log('[OpenRouter] Raw response content:', content);

  // Extract JSON from markdown code blocks if present
  const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) {
    content = jsonMatch[1];
    console.log('[OpenRouter] Extracted from code block');
  }

  // Trim whitespace
  content = content.trim();

  if (!content || content === '') {
    throw new Error('OpenRouter returned empty content');
  }

  const result = JSON.parse(content);

  return {
    translated_title: result.translated_title || title,
    translated_text: result.translated_text,
    summary: result.summary,
    keywords: result.keywords || [],
    provider: 'openrouter'
  };
}
