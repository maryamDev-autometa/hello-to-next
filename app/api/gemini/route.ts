import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const systemPrompt = "you are a good researcher"
    const body = await request.json();
    const { prompt =  systemPrompt, model = 'gemini-1.5-flash' } = body;

    // Validate the prompt
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Get the generative model
    const generativeModel = genAI.getGenerativeModel({ model });

    // Generate content
    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Return the response
    return NextResponse.json({
      success: true,
      text,
      model
    });

  } catch (error: any) {
    console.error('Gemini API Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate content',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Gemini API endpoint is running',
    apiKeyConfigured: !!process.env.GEMINI_API_KEY
  });
}
