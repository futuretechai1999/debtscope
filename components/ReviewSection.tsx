"use client"

import { useState } from 'react'

interface Review {
  name: string
  rating: number
  comment: string
  date: string
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      name: 'Aman Sharma',
      rating: 5,
      comment: 'Website ka UI bohot clean hai aur map visualization se debt samajhna aasan ho gaya!',
      date: 'Aug 2026',
    },
    {
      name: 'Priya Mehta',
      rating: 5,
      comment: 'DebtTeller AI feature kaafi fast aur accurate explanation deta hai.',
      date: 'Aug 2026',
    },
  ])

  const [userName, setUserName] = useState('')
  const [userRating, setUserRating] = useState(5)
  const [userComment, setUserComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !userComment.trim()) return

    const newReview: Review = {
      name: userName.trim(),
      rating: userRating,
      comment: userComment.trim(),
      date: 'Just now',
    }

    setReviews([newReview, ...reviews])
    setUserName('')
    setUserComment('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section className="panel" style={{ marginTop: '32px', padding: '32px 24px' }}>
      <div className="section-heading">
        <div>
          <span className="section-kicker">COMMUNITY IMPRESSIONS</span>
          <h2>Website Reviews & Feedback</h2>
          <p className="panel-subtitle">Aapko DebtTeller kaisa laga? Apna anubhav aur feedback share karein.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '20px' }}>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--panel-strong)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h3 style={{ fontSize: '16px', margin: 0 }}>Apna Review Dein</h3>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Aapka Naam</label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Rahul Verma"
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                padding: '8px 12px',
                borderRadius: '6px',
                color: 'var(--text)',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Rating</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setUserRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: star <= userRating ? '#f59e0b' : 'var(--muted)',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Aapka Impression / Feedback</label>
            <textarea
              required
              rows={3}
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Website ke design, data ya features ke baare mein likhein..."
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                padding: '8px 12px',
                borderRadius: '6px',
                color: 'var(--text)',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            style={{ padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', justifyContent: 'center' }}
          >
            Submit Feedback
          </button>

          {submitted && (
            <span style={{ color: '#10b981', fontSize: '13px', textAlign: 'center' }}>
              ✓ Shukriya! Aapka review add ho gaya hai.
            </span>
          )}
        </form>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--panel-strong)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong>{rev.name}</strong>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{rev.date}</span>
              </div>
              <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '6px' }}>
                {'★'.repeat(rev.rating)}
                {'☆'.repeat(5 - rev.rating)}
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)', lineHeight: '1.4' }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}