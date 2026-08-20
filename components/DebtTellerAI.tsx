"use client"

import { useState } from 'react'

export default function DebtTellerAI() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Namaste! Main DebtTeller AI hoon. Aap mujhse kisi bhi desh ke external debt, comparison ya is platform ke baare mein kuch bhi pooch sakte hain.',
    },
  ])
  const [inputQuery, setInputQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickPrompts = [
    "India ka kul debt kitna hai?",
    "India vs China debt compare karo",
    "DebtScope/DebtTeller kya kaam karta hai?",
    "Debt-to-GDP ratio ka kya matlab hota hai?",
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
        body: JSON.stringify({
          debtData: textToSend,
        }),
      })

      const data = await res.json()

      if (res.ok && data.insight) {
        setMessages([...newMessages, { role: 'assistant', content: data.insight }])
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: 'Maaf kijiye, main abhi response process nahi kar pa raha hoon. Kripya dobara try karein.',
          },
        ])
      }
    } catch (err) {
      console.error(err)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Server connection mein samasya aayi. Kripya apna internet ya backend check karein.',
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
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#06b6d4', letterSpacing: '1px' }}>
          ✦ DEBTTELLER AI INTELLIGENCE
        </div>
        <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
          Live Q&A
        </span>
      </div>

      {/* Chat Messages Window */}
      <div
        style={{
          minHeight: '180px',
          maxHeight: '260px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '6px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#06b6d4' : 'rgba(255,255,255,0.05)',
              color: msg.role === 'user' ? '#000' : 'var(--text)',
              padding: '10px 14px',
              borderRadius: '12px',
              maxWidth: '85%',
              fontSize: '14px',
              lineHeight: '1.5',
              fontWeight: msg.role === 'user' ? '600' : '400',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
            }}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', fontSize: '13px', color: '#06b6d4' }}>
            DebtTeller AI soch raha hai...
          </div>
        )}
      </div>

      {/* Quick Suggestion Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            type="button"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '4px 10px',
              fontSize: '11px',
              color: 'var(--muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        style={{ display: 'flex', gap: '8px', marginTop: '4px' }}
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Website ya debt ke baare mein kuch bhi poochein..."
          style={{
            flex: 1,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            padding: '10px 14px',
            borderRadius: '8px',
            color: 'var(--text)',
            fontSize: '14px',
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
            padding: '0 16px',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: isLoading || !inputQuery.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          Poochhein
        </button>
      </form>
    </div>
  )
}