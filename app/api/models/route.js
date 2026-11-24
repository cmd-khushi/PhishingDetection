import { NextResponse } from 'next/server.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryKey = searchParams.get('apiKey');
    const envKey = process.env.GEMINI_API_KEY;
    const key = queryKey || envKey;

    if (!key) {
      return NextResponse.json({
        success: false,
        hasServerKey: Boolean(envKey),
        message: 'No API key provided. Supply ?apiKey= query parameter or set GEMINI_API_KEY environment variable.'
      }, { status: 400 });
    }

    // Try fetching available models from Google Gemini API
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      `https://generativelanguage.googleapis.com/v1/models?key=${key}`
    ];

    let lastError = null;
    let data = null;
    let successfulApiVersion = 'v1beta';

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { method: 'GET' });
        const json = await res.json();
        if (res.ok && Array.isArray(json.models)) {
          data = json;
          successfulApiVersion = url.includes('/v1beta/') ? 'v1beta' : 'v1';
          break;
        } else {
          lastError = json.error || { message: `HTTP ${res.status}: ${res.statusText}` };
        }
      } catch (err) {
        lastError = { message: err.message };
      }
    }

    if (!data || !data.models) {
      return NextResponse.json({
        success: false,
        hasServerKey: Boolean(envKey),
        error: lastError || { message: 'Failed to retrieve models from Google Gemini API' }
      }, { status: 400 });
    }

    // Filter models that support generateContent
    const eligibleModels = data.models
      .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
      .map(m => ({
        name: m.name.replace(/^models\//, ''),
        fullName: m.name,
        displayName: m.displayName || m.name,
        description: m.description || '',
        supportedMethods: m.supportedGenerationMethods
      }));

    // Find recommended model
    const priorityNames = [
      'gemini-3.5-flash-lite',
      'gemini-2.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest'
    ];

    let recommendedModel = eligibleModels.find(m => priorityNames.includes(m.name))?.name;
    if (!recommendedModel && eligibleModels.length > 0) {
      recommendedModel = eligibleModels[0].name;
    }

    return NextResponse.json({
      success: true,
      hasServerKey: Boolean(envKey),
      keySource: queryKey ? 'custom' : 'server_env',
      apiVersion: successfulApiVersion,
      recommendedModel: recommendedModel || 'gemini-3.5-flash-lite',
      models: eligibleModels
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: { message: err.message }
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const key = body.apiKey || process.env.GEMINI_API_KEY;

    if (!key) {
      return NextResponse.json({
        success: false,
        message: 'No API key provided.'
      }, { status: 400 });
    }

    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const res = await fetch(testUrl, { method: 'GET' });
    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: json.error || { message: `HTTP ${res.status}` }
      }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      models: json.models || []
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: { message: err.message }
    }, { status: 500 });
  }
}
