import { NextResponse } from 'next/server'

// Updated Knowledge Base with latest $716.5B India Debt
const LOCAL_KNOWLEDGE = {
  hi: {
    india: "भारत का कुल बाहरी ऋण (External Debt) लगभग $716.5 बिलियन है, जो भारत की GDP का लगभग 18.7% है। भारत के पास पर्याप्त विदेशी मुद्रा भंडार होने के कारण इसे सुरक्षित और स्थिर माना जाता है।",
    us: "अमेरिका (USA) का कुल बाहरी ऋण दुनिया में सबसे ज्यादा लगभग $36.2 ट्रिलियन है।",
    china: "चीन का बाहरी ऋण लगभग $16.1 ट्रिलियन है, जिसके साथ चीन के पास भारी विदेशी व्यापार अधिशेष (trade surplus) भी है।",
    compare: "तुलना: अमेरिका का विदेशी कर्ज $36.2 ट्रिलियन और चीन का $16.1 ट्रिलियन है, जबकि भारत का बाहरी कर्ज $716.5 बिलियन है जो कि काफी नियंत्रित स्तर पर है।",
    platform: "DebtTeller एक आर्थिक डेटा प्लेटफॉर्म है जहां आप दुनिया भर के देशों के कर्ज के आंकड़े, 10 साल के रुझान और तुलनात्मक विश्लेषण देख सकते हैं।",
    gdp: "ऋण-से-जीडीपी (Debt-to-GDP) अनुपात यह बताता है कि किसी देश की अर्थव्यवस्था के मुकाबले उसका कुल कर्ज कितना है। कम अनुपात अर्थव्यवस्था की मजबूती को दर्शाता है।",
    default: "DebtTeller पर आप विभिन्न देशों के वास्तविक ऋण आंकड़े और आर्थिक रुझान आसानी से समझ सकते हैं।"
  },
  en: {
    india: "India's external debt stands at approximately $716.5 Billion (around 18.7% of GDP), which remains stable and well-buffered by strong foreign exchange reserves.",
    us: "The United States holds the largest external debt globally at around $36.2 Trillion, driven by international holdings of US Treasuries.",
    china: "China's external debt is estimated at approximately $16.1 Trillion, backed by strong trade surpluses.",
    compare: "Comparison: The US has over $36.2T in external debt and China holds $16.1T, while India's external debt stands at $716.5B with a healthier debt-to-GDP ratio.",
    platform: "DebtTeller is an economic intelligence dashboard designed to track, visualize, and compare external debt statistics worldwide.",
    gdp: "Debt-to-GDP ratio compares a country's public/external debt to its economic output. A lower percentage indicates higher repayment capacity.",
    default: "DebtTeller allows you to explore global debt rankings, charts, and macro comparisons with ease."
  }
}

function getLocalFallback(query: string): string {
  const q = query.toLowerCase()
  // Check if query is Hindi / Hinglish
  const isHindi = /[ऀ-ॿ]/.test(query) || 
    q.includes('kya') || q.includes('kitna') || q.includes('batao') || 
    q.includes('hai') || q.includes('bharat') || q.includes('kaise') || q.includes('desh')

  const lang = isHindi ? LOCAL_KNOWLEDGE.hi : LOCAL_KNOWLEDGE.en

  if (q.includes('india') && (q.includes('china') || q.includes('vs') || q.includes('compare') || q.includes('tulna'))) {
    return lang.compare
  }
  if (q.includes('india') || q.includes('bharat') || q.includes('भारत')) {
    return lang.india
  }
  if (q.includes('us') || q.includes('usa') || q.includes('america') || q.includes('अमेरिका')) {
    return lang.us
  }
  if (q.includes('china') || q.includes('चीन')) {
    return lang.china
  }
  if (q.includes('gdp') || q.includes('ratio') || q.includes('anupat')) {
    return lang.gdp
  }
  if (q.includes('website') || q.includes('debtteller') || q.includes('debtscope') || q.includes('platform')) {
    return lang.platform
  }
  return lang.default
}

export async function POST(req: Request) {
  try {
    const { debtData } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY
    const query = debtData || ''

    if (!apiKey) {
      return NextResponse.json({ insight: getLocalFallback(query) })
    }

    const systemPrompt = `
You are DebtTeller AI, an expert economic assistant.
Latest Global Data:
- India's External Debt: $716.5 Billion (18.7% Debt-to-GDP)
- USA External Debt: $36.2 Trillion
- China External Debt: $16.1 Trillion
- Global Debt Total: ~$98.4 Trillion

Query: "${query}"

Strict Language Rules:
1. If the user asks in Hindi / Hinglish (e.g. "bharat ka debt kitna hai", "batao", "kya hai"), respond STRICTLY in clear Hindi (Devanagari script like "भारत का कुल बाहरी ऋण...").
2. If the user asks in English, respond strictly in English.
3. Keep the answer accurate, factual, and limited to 2-3 sentences.
`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ insight: getLocalFallback(query) })
    }

    const data = await response.json()
    const insight = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (insight && insight.trim().length > 0) {
      return NextResponse.json({ insight: insight.trim() })
    }

    return NextResponse.json({ insight: getLocalFallback(query) })
  } catch {
    return NextResponse.json({ insight: getLocalFallback('') })
  }
}