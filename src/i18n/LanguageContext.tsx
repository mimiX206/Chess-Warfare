import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, PieceLocalization, DifficultyLocalization, RulesSection, SUPPORTED_LANGUAGES, LanguageOption } from './types';
import { UI_TRANSLATIONS, PIECE_TRANSLATIONS, DIFFICULTY_TRANSLATIONS, FACTION_NAMES, RULES_TRANSLATIONS } from './translations';
import { PieceType, Faction } from '../types/chess';
import { AIDifficulty } from '../engine/ai';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  languages: LanguageOption[];
  t: (key: string, params?: Record<string, string | number>) => string;
  getPiece: (type: PieceType) => PieceLocalization;
  getDifficulty: (d: AIDifficulty) => DifficultyLocalization;
  getFactionName: (f: Faction) => string;
  getRules: () => RulesSection[];
}

const STORAGE_KEY = 'warfare_chess_lang';

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && ['th', 'en', 'ja', 'zh'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'th';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS['en']?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const getPiece = (type: PieceType): PieceLocalization => {
    return (
      PIECE_TRANSLATIONS[lang]?.[type] ||
      PIECE_TRANSLATIONS['en']?.[type] || {
        name: type,
        title: type,
        role: type,
        symbol: '?',
      }
    );
  };

  const getDifficulty = (d: AIDifficulty): DifficultyLocalization => {
    return (
      DIFFICULTY_TRANSLATIONS[lang]?.[d] ||
      DIFFICULTY_TRANSLATIONS['en']?.[d] || {
        name: d,
        desc: d,
      }
    );
  };

  const getFactionName = (f: Faction): string => {
    return FACTION_NAMES[lang]?.[f] || FACTION_NAMES['en']?.[f] || f;
  };

  const getRules = (): RulesSection[] => {
    return RULES_TRANSLATIONS[lang] || RULES_TRANSLATIONS['en'];
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        languages: SUPPORTED_LANGUAGES,
        t,
        getPiece,
        getDifficulty,
        getFactionName,
        getRules,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
