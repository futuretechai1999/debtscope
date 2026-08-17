'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Language = 'en' | 'hi'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const storageKey = 'debtscope-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(storageKey)

    if (storedLanguage === 'en' || storedLanguage === 'hi') {
      setLanguage(storedLanguage)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, language)
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en'
  }, [language])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage: () =>
          setLanguage((current) => (current === 'en' ? 'hi' : 'en')),
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
