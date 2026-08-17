'use client'

import { useLanguage } from './LanguageProvider'
import type { CSSProperties } from 'react'

type LanguageToggleProps = {
  className?: string
  style?: CSSProperties
}

export default function LanguageToggle({ className, style }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      className={className}
      style={style}
      type="button"
      aria-label="Switch between English and Hindi"
      onClick={toggleLanguage}
    >
      <span
        style={{
          fontWeight: language === 'en' ? 700 : 400,
          color: language === 'en' ? '#FFFFFF' : '#9FB3C8',
        }}
      >
        EN
      </span>
      <span className={className ? 'language-divider' : undefined}> / </span>
      <span
        style={{
          fontWeight: language === 'hi' ? 700 : 400,
          color: language === 'hi' ? '#FFFFFF' : '#9FB3C8',
        }}
      >
        हिन्दी
      </span>
    </button>
  )
}
