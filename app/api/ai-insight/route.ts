import { NextResponse } from 'next/server'

// Instant local fallback knowledge-base agar API key block/delayed ho
const LOCAL_KNOWLEDGE: Record<string, string> = {
  us: "The United States currently has the world's largest external debt, standing at approximately $36.2 Trillion, driven by high global holdings of US Treasuries.",
  india: "India's external debt stands at around $620.7 Billion (approx 18.7% of GDP), which is considered stable and well-managed with high foreign exchange reserves.",
  china: "China's external debt is estimated at approximately $16.1 Trillion, with a strong trade surplus and substantial global assets.",
  compare: "Comparison: The US has an external debt of over $36T, China has around $16.1T, while India's external debt is around $620.7B with a much lower debt-to-GDP ratio.",
  debtscope: "DebtTeller (DebtScope) is an economic intelligence platform that simplifies global external debt datasets with interactive maps, country comparisons, and AI explanations.",
  gdp: "Debt-to-GDP ratio measures a country's total debt against its economic output. A lower percentage generally indicates a healthier ability to pay back debt without refinancing.",
}

function getLocalResponse(query: string): string {
  const q = query.toLowerCase()
  if (q.includes('us') || q.includes('usa') || q.includes('united states') || q.includes('america')) {
    return LOCAL_KNOWLEDGE.us
  }
  if (q.includes('india') && (q.includes('china') || q.includes('compare') || q.includes('vs'))) {
    return LOCAL_KNOWLEDGE.compare
  }
  if (q.includes('india') || q.includes('bharat')) {
    return LOCAL_KNOWLEDGE.india
  }
  if (q.includes('china')) {
    return LOCAL_KNOWLEDGE.china
  }
  if (q.includes('debtscope') || q.includes('debtteller') || q.includes('website') || q.includes('platform')) {
    return LOCAL_KNOWLEDGE.debtscope
  }
  if (q.includes('gdp') || q.includes('ratio')) {
    return LOCAL_KNOWLEDGE.gdp
  }
  return "DebtTeller lets you track global debt datasets easily. You can explore country rankings, 10-year trends, and comparison metrics from the interactive dashboard above."
}

export async function POST(req: Request) {
  try {
    const { debtData } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ insight: getLocalResponse(debtData || '') })
    }

    const systemPrompt = `
You are DebtTeller AI, a financial intelligence assistant.
Website data:
- US External Debt: $36.2 Trillion
- China External Debt: $16.1 Trillion
- Japan: $13.0T, Germany: $5.0T, UK: $4.7T, France: $4.6T
- India External Debt: $620.7 Billion (18.7% Debt-to-GDP, +5.8% YoY)
- Global Total Debt: ~$98.4 Trillion

User question: "${debtData}"

Instructions:
1. Detect language automatically: Answer in English if query is in English. Answer in Hindi/Hinglish if query is in Hindi/Hinglish.
2. Provide a direct, factual answer in 2 to 3 concise sentences.
`

    // Multiple endpoint attempts for maximum reliability
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
      }),
    })

    if (!response.ok) {
      console.warn('Gemini API returned error, falling back to instant knowledge base.')
      return NextResponse.json({ insight: getLocalResponse(debtData || '') })
    }

    const data = await response.json()
    const insight = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (insight && insight.trim().length > 0) {
      return NextResponse.json({ insight: insight.trim() })
    }

    return NextResponse.json({ insight: getLocalResponse(debtData || '') })
  } catch (error) {
    console.error('AI Route error:', error)
    return NextResponse.json({
      insight: getLocalResponse(''),
    })
  }
}