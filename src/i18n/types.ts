import { PieceType, Faction } from '../types/chess';
import { AIDifficulty } from '../engine/ai';

export type Language = 'th' | 'en' | 'ja' | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
];

export interface PieceLocalization {
  name: string;
  title: string;
  role: string;
  symbol: string;
}

export interface DifficultyLocalization {
  name: string;
  desc: string;
}

export interface RulesSection {
  title: string;
  content: string;
  items?: { name: string; desc: string }[];
}
