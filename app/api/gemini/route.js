import { NextResponse } from 'next/server.js';

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const { sender = '', subject = '', body = '', apiKey: customKey, model: requestedModel } = payload;

    const apiKey = customKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'No Gemini API key found. Set GEMINI_API_KEY in .env.local or enter key in settings modal.'
        }
      }, { status: 400 });
    }

    if (!sender && !subject && !body) {
      return NextResponse.json({
        success: false,
        error: { message: 'Email content is empty. Provide sender, subject, or body.' }
      }, { status: 400 });
    }

    const promptText = `You are a cybersecurity email threat triage specialist. Analyze the following email metadata and content for phishing, impersonation, credential harvesting, social engineering, and legitimacy.

EMAIL METADATA & BODY:
========================
SENDER: ${sender}
SUBJECT: ${subject}
BODY:
${body}
========================

Perform a rigorous security triage. Respond ONLY with a valid JSON object matching this exact schema:
{
  "classification": "Likely Phishing" | "Suspicious" | "Likely Legitimate",
  "score": <number 0-100, where 0 is legitimate and 100 is severe phishing>,
  "primaryIntent": "<short phrase e.g. Credential Harvesting, Financial Wire BEC, Social Engineering, Identity Theft, Routine Inquiry, Legitimate Transaction>",
  "urgencyLevel": "Critical" | "High" | "Moderate" | "Low" | "None",
  "toneAnalysis": "<concise description of communication tone, e.g. Aggressive Coercion, Manufactured Authority, Defensive Assertion, Routine Transactional>",
  "summary": "<2-3 sentence technical assessment explaining the specific risk or legitimate characteristics found>",
  "technicalIndicators": [
    "<specific observation 1>",
    "<specific observation 2>"
  ],
  "legitimacyFactors": [
    "<factors supporting legitimacy or absence of indicators>"
  ],
  "recommendedAction": "<clear, practical advice for the recipient>"
}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json'
      }
    };

    // Primary fast active model list (targeted, no cascading 404 delays)
    const targetModels = requestedModel
      ? [requestedModel, 'gemini-flash-lite-latest', 'gemini-3.5-flash-lite']
      : ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite'];

    let successfulResult = null;
    let modelUsed = null;
    let lastError = null;

    for (const model of targetModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const json = await response.json();

        if (response.ok && json.candidates?.[0]?.content?.parts?.[0]?.text) {
          successfulResult = json.candidates[0].content.parts[0].text;
          modelUsed = model;
          break;
        } else {
          lastError = json.error || { message: `HTTP ${response.status}: ${response.statusText}` };
          // If 400 invalid key, don't keep trying
          if (response.status === 400 && json.error?.message?.includes('API key')) {
            break;
          }
        }
      } catch (err) {
        lastError = { message: err.message };
      }
    }

    if (!successfulResult) {
      return NextResponse.json({
        success: false,
        error: lastError || { message: 'Gemini API call failed' }
      }, { status: 400 });
    }

    // Parse JSON
    let cleanJson = successfulResult.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    }

    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(cleanJson);
    } catch {
      parsedAnalysis = {
        classification: 'Suspicious',
        score: 55,
        primaryIntent: 'Unstructured Analysis',
        urgencyLevel: 'Moderate',
        toneAnalysis: 'Freeform Output',
        summary: cleanJson.slice(0, 300),
        technicalIndicators: ['Model output could not be strictly parsed as JSON'],
        legitimacyFactors: [],
        recommendedAction: 'Verify via standard out-of-band communication before acting.'
      };
    }

    return NextResponse.json({
      success: true,
      analysis: parsedAnalysis,
      modelUsed
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: { message: err.message || 'Internal server error' }
    }, { status: 500 });
  }
}
