"use client"

import { useState } from 'react'

export default function DebtTellerAI() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'नमस्ते! मैं DebtTeller AI हूँ। आप मुझसे भारत या किसी भी देश के कर्ज और इस वेबसाइट के बारे में पूछ सकते हैं।',
    },
  ])
  const [inputQuery, setInputQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickPrompts = [
    { label: "भारत का कुल कर्ज कितना है?", query: "bharat ka total debt kitna hai?" },
    { label: "What is US total debt?", query: "What is US total debt?" },
    { label: "India vs China Debt", query: "India vs China debt compare" },
    { label: "Debt-to-GDP क्या है?", query: "Debt to GDP ratio ka matlab kya hai?" },
  ]

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery
    if (!textToSend.trim() || isLoading) return

    const newMessages = [...messages, { role: 'user' as const, content: textToSend }]
    setMessages(newMessages)
    if (!queryText) setInputQuery('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debtData: textToSend }),
      })

      const data = await res.json()
      if (data && data.insight) {
        setMessages([...newMessages, { role: 'assistant', content: data.insight }])
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: 'भारत का बाहरी ऋण लगभग $716.5 बिलियन है। अधिक जानकारी के लिए ऊपर दिए गए आंकड़े देखें।',
          },
        ])
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'डेटा लोड करने में असमर्थ। कृपया पुनः प्रयास करें।',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        background: 'var(--panel-strong)',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#06b6d4', letterSpacing: '0.8px' }}>
          ✦ DEBTTELLER AI
        </div>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--muted)',
            background: 'rgba(255,255,255,0.06)',
            padding: '3px 8px',
            borderRadius: '12px',
          }}
        >
          Live Assistant
        </span>
      </div>

      {/* Chat Window */}
      <div
        style={{
          maxHeight: '220px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: '4px',
          scrollbarWidth: 'thin',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#06b6d4' : 'rgba(255,255,255,0.05)',
              color: msg.role === 'user' ? '#000' : 'var(--text)',
              padding: '9px 13px',
              borderRadius: '10px',
              maxWidth: '90%',
              fontSize: '13px',
              lineHeight: '1.45',
              fontWeight: msg.role === 'user' ? '600' : '400',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              wordBreak: 'break-word',
            }}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#06b6d4' }}>
            उत्तर तैयार हो रहा है...
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {quickPrompts.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSend(item.query)}
            type="button"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '4px 10px',
              fontSize: '11px',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        style={{ display: 'flex', gap: '8px' }}
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="सवाल पूछें (Ask in English or Hindi)..."
          style={{
            flex: 1,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            padding: '8px 12px',
            borderRadius: '8px',
            color: 'var(--text)',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          style={{
            background: '#06b6d4',
            color: '#000',
            border: 'none',
            padding: '0 14px',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: isLoading || !inputQuery.trim() ? 'not-allowed' : 'pointer',
            fontSize: '13px',
          }}
        >
          पूछें
        </button>
      </form>
    </div>
  )
}