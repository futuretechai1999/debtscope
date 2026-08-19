import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { debtData, language } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 })
    }

    const prompt = `You are a financial expert. Explain this external debt data in 2 short, simple sentences. Keep it easy to understand for everyday people. Data: "${debtData}". The output language must strictly be ${language}.`

    // Agar standard AIzaSy key hai toh query param chalega, 
    // naye AQ.Ab format ke liye Authorization Bearer header aur x-goog-api-key dono support karte hain
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    let url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

    if (apiKey.startsWith('AIzaSy')) {
      url += `?key=${apiKey}`
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`
      headers['x-goog-api-key'] = apiKey
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API Error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'API request failed' },
        { status: response.status }
      )
    }

    const insight =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.'

    return NextResponse.json({ insight })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}