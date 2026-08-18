"use client";
import { useState } from 'react';

export default function DebtTellerAI() {
  const [aiResponse, setAiResponse] = useState("India's external debt moved higher year over year. This is preview copy for the interface. Verified World Bank data and source citations will replace it.");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const getAiInsight = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          debtData: "India's total external debt is $620.7 Billion and it is increasing year over year.", 
          language: "Hindi" 
        }),
      });
      const data = await res.json();
      if (data.insight) setAiResponse(data.insight);
    } catch (error) {
      console.error(error);
      setAiResponse("AI server se connect karne mein problem aayi.");
    }
    setIsAiLoading(false);
  };

  return (
    <div style={{ background: 'var(--panel-strong)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 'bold', marginBottom: '12px', letterSpacing: '1px' }}>
        INSIGHT OF THE DAY <span style={{ float: 'right' }}>EN</span>
      </div>
      <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '15px', lineHeight: '1.4' }}>
        {aiResponse}
      </p>
      <button 
        onClick={getAiInsight}
        disabled={isAiLoading}
        style={{ marginTop: '5px', color: '#06b6d4', background: 'none', border: 'none', cursor: isAiLoading ? 'wait' : 'pointer', fontWeight: 'bold', fontSize: '15px', padding: '0' }}
      >
        {isAiLoading ? 'AI Translate kar raha hai...' : 'Explain in हिन्दी ↗'}
      </button>
    </div>
  );
}