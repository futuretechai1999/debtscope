import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { debtData } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 })
    }

    const systemPrompt = `
You are DebtTeller AI, the intelligent assistant for the "DebtTeller" (DebtScope) platform.

Website context:
- India External Debt: $620.7 Billion (+5.8% YoY)
- Global External Debt: $98.4 Trillion
- Top economies debt: USA ($36.2T), China ($16.1T), Japan ($13.0T), Germany ($5.0T), UK ($4.7T).
- Platform features: Interactive World Map, Country Comparison (e.g. India vs China), Country debt breakdown, Data Quality filters.

User query: "${debtData}"

Rules:
1. Detect the language of the user's query:
   - If the user writes in English, reply in clean, concise English.
   - If the user writes in Hindi or Hinglish, reply in simple, natural Hindi/Hinglish.
2. Keep answers concise, clear, and informative (2 to 4 sentences maximum).
3. Always stay relevant to economics, global debt, countries, or how to use the DebtTeller platform.
`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }],
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API Error:', data)
      return NextResponse.json({ error: data.error?.message || 'API call failed' }, { status: response.status })
    }

    const insight =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'DebtTeller allows you to track, compare, and understand global debt datasets easily.'

    return NextResponse.json({ insight: insight.trim() })
  } catch (error: any) {
    console.error('Server Catch Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}