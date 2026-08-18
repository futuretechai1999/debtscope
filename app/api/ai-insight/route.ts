import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Key ko .env.local se uthana
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { debtData, language } = await req.json();
    
    // Gemini model ko call karna
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // AI ko instruction dena
    const prompt = `You are a helpful financial expert. Look at this data: "${debtData}". 
    Translate and explain this very simply in ${language} language. 
    Keep it short, just 1 or 2 sentences. Make it easy for a normal person to understand.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ insight: text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: 'Failed to generate AI insight' }, { status: 500 });
  }
}