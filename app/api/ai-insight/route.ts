import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { debtData } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key missing on server' }, { status: 500 })
    }

    const promptText = `Aap ek financial expert hain. Neeche diye gaye debt data ko aasan aur saral Hindi bhasha mein sirf 2 chhote sentences mein explain karein. Data: ${debtData || 'India external debt is $620.7 Billion'}`

    // Google Gemini 1.5 Flash endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Google API Error Response:', data)
      return NextResponse.json(
        { error: data?.error?.message || 'Google API returned an error' },
        { status: response.status }
      )
    }

    const insight =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'भारत का बाहरी ऋण पिछले वर्ष की तुलना में बढ़ा है।'

    return NextResponse.json({ insight: insight.trim() })
  } catch (error: any) {
    console.error('Server Catch Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}