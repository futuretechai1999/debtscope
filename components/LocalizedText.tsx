'use client'

import { useLanguage } from './LanguageProvider'

type LocalizedTextProps = {
  en: string
  hi: string
}

export default function LocalizedText({ en, hi }: LocalizedTextProps) {
  const { language } = useLanguage()
  return <>{language === 'hi' ? hi : en}</>
}
