import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { debtData } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 })
    }

    const systemPrompt = `
You are DebtTeller AI, the intelligent assistant for the "DebtTeller" (DebtScope) web platform.
Website context:
- India External Debt: $620.7 Billion (+5.8% YoY)
- Global External Debt: $98.4 Trillion
- USA Debt: $36.2T, China: $16.1T, Japan: $13.0T, Germany: $5.0T, UK: $4.7T.
- Features: Global Map, Live Comparison (India vs China), Country debt breakdown, Data Availability Filters.

User question/query: "${debtData}"

Instructions:
1. Answer clearly, accurately, and politely in easy-to-understand Hinglish/Hindi or English based on user's tone.
2. Keep answers concise (2 to 4 sentences).
3. If they ask about the website, guide them on what features DebtTeller provides.
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
      'DebtTeller par aap global debt trends, map aur country comparison dekh sakte hain.'

    return NextResponse.json({ insight: insight.trim() })
  } catch (error: any) {
    console.error('Server Catch Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}