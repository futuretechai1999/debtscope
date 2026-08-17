"use client";

import { useEffect, useState } from 'react'
import DebtScopeLogo from './DebtScopeLogo'
import Link from 'next/link'

export default function Navbar() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('debtscope_theme');
    if (savedTheme === 'light') {
      setIsLight(true);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !isLight;
    setIsLight(nextMode);
    const themeName = nextMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('debtscope_theme', themeName);
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--panel-strong)',
        transition: 'background 0.25s ease',
      }}
    >
      <DebtScopeLogo />

      <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
        <nav style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: 600 }}>
          <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
            Overview
          </Link>
          <Link href="/map" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
            Global Map
          </Link>
          <Link href="/compare" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
            Compare
          </Link>
          <Link href="/rankings" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
            Rankings
          </Link>
        </nav>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          style={{
            background: 'var(--bg-soft)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '15px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
            transition: '0.2s ease',
          }}
        >
          {isLight ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}