import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required', success: false },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log('[Chat API] API Key exists:', !!apiKey);
    console.log('[Chat API] Messages count:', messages.length);

    if (!apiKey) {
      console.error('[Chat API] Missing OPENROUTER_API_KEY');
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY is not configured', success: false },
        { status: 500 }
      );
    }

    // Format messages for OpenRouter API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    console.log('[Chat API] Calling OpenRouter API...');

    // Call OpenRouter API with v1/chat/completions
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://nexus-lab.com',
        'X-Title': 'Nexus Chatbot',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('[Chat API] Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('[Chat API] OpenRouter API error:', error);
      return NextResponse.json(
        { 
          error: `OpenRouter API error: ${response.statusText}`,
          details: error,
          success: false 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Chat API] Response received:', !!data.choices?.[0]?.message);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('[Chat API] Invalid response format:', data);
      return NextResponse.json(
        { 
          error: 'Invalid response format from OpenRouter API',
          success: false 
        },
        { status: 500 }
      );
    }

    const assistantMessage = data.choices[0].message.content;

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      usage: data.usage,
    });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: `Internal server error: ${errorMessage}`,
        success: false 
      },
      { status: 500 }
    );
  }
}
