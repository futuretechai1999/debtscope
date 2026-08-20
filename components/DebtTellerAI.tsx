"use client"

import { useState } from 'react'

export default function DebtTellerAI() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Hello! I am DebtTeller AI. Ask me about global external debt, country comparisons, or how to navigate this platform.',
    },
  ])
  const [inputQuery, setInputQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickPrompts = [
    "What is US total debt?",
    "India ka kul debt kitna hai?",
    "India vs China debt compare",
    "Debt-to-GDP ratio meaning",
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
            content: 'DebtTeller provides verified economic debt data. Please check the overview rankings above.',
          },
        ])
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Unable to connect right now. Please try again in a moment.',
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
          Live Q&A
        </span>
      </div>

      {/* Clean Chat Window with slim scrollbar */}
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
              background: msg.role === 'user' ? '#06b6d4' : 'rgba(255,255,255,0.04)',
              color: msg.role === 'user' ? '#000' : 'var(--text)',
              padding: '8px 12px',
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
            DebtTeller AI is typing...
          </div>
        )}
      </div>

      {/* Chips */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            type="button"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '4px 9px',
              fontSize: '11px',
              color: 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            {prompt}
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
          placeholder="Ask anything about debt or platform..."
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
          Ask
        </button>
      </form>
    </div>
  )
}