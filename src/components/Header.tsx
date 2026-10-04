import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
  Users,
  BookOpen,
  SlidersHorizontal,
  Zap,
  Coins,
  FlaskConical,
  Globe,
  Check,
  ChevronDown,
} from 'lucide-react';
import { AIDifficulty } from '../engine/ai';
import { useLanguage } from '../i18n';
import { Language } from '../i18n/types';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  onOpenCoinToss?: () => void;
  gameMode: 'ai' | 'pvp' | 'sandbox';
  onSelectGameMode?: (mode: 'ai' | 'pvp' | 'sandbox') => void;
  onToggleGameMode: () => void;
  difficulty: AIDifficulty;
  onChangeDifficulty: (d: AIDifficulty) => void;
  onOpenRules: () => void;
  isAdvancedOpen: boolean;
  onToggleAdvanced: () => void;
  movesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onReset,
  onOpenCoinToss,
  gameMode,
  onSelectGameMode,
  onToggleGameMode,
  difficulty,
  onChangeDifficulty,
  onOpenRules,
  isAdvancedOpen,
  onToggleAdvanced,
  movesCount,
}) => {
  const { lang, setLang, languages, t, getDifficulty } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  return (
    <header className="flex items-center justify-between px-2.5 sm:px-6 py-2.5 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Wordmark & AI Difficulty Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></div>
          <span className="text-sm sm:text-lg font-bold tracking-wider text-slate-100 font-mono">
            {t('appName')}
          </span>
        </div>

        {/* Difficulty Selector (when in vs AI mode) */}
        {gameMode === 'ai' && (
          <div className="hidden sm:flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono ml-1">
            {(['easy', 'normal', 'expert'] as AIDifficulty[]).map((level) => {
              const isActive = difficulty === level;
              const meta = getDifficulty(level);
              return (
                <button
                  key={level}
                  onClick={() => onChangeDifficulty(level)}
                  title={meta.desc}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    isActive
                      ? level === 'expert'
                        ? 'bg-rose-950 text-rose-300 font-bold border border-rose-600 shadow-sm'
                        : level === 'normal'
                        ? 'bg-amber-950 text-amber-300 font-bold border border-amber-600 shadow-sm'
                        : 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {level === 'expert' && <Zap className="w-2.5 h-2.5 inline mr-1 text-rose-400" />}
                  {meta.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Zone 2: Primary Controls, Language Selector & Modes */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language Selector Dropdown */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen((prev) => !prev)}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-800 transition-colors"
            title={t('language')}
          >
            <span className="text-sm">{currentLangObj.flag}</span>
            <span className="font-mono text-xs hidden md:inline">{currentLangObj.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-40 py-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800 flex items-center gap-1">
                <Globe className="w-3 h-3 text-amber-400" />
                <span>{t('language')}</span>
              </div>
              {languages.map((l) => {
                const isSelected = l.code === lang;
                return (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.nativeName}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Advanced Mode Toggle Button */}
        <button
          onClick={onToggleAdvanced}
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
            isAdvancedOpen
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
          }`}
          title="Advanced Mode"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">Advanced</span>
          {movesCount > 0 && (
            <span className="px-1.5 py-0.2 bg-slate-800 text-[10px] rounded-full text-slate-300 font-mono">
              {movesCount}
            </span>
          )}
        </button>

        {/* Rules button */}
        <button
          onClick={onOpenRules}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-800 transition-colors"
          title={t('rulesTitle')}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('rulesBtn')}</span>
        </button>

        {/* Mode Selector Segmented / Toggle */}
        <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => (onSelectGameMode ? onSelectGameMode('ai') : onToggleGameMode())}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              gameMode === 'ai'
                ? 'bg-slate-800 text-emerald-300 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={t('vsAI')}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{t('vsAI')}</span>
          </button>

          <button
            onClick={() => (onSelectGameMode ? onSelectGameMode('pvp') : onToggleGameMode())}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              gameMode === 'pvp'
                ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={t('twoPlayer')}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">{t('twoPlayer')}</span>
          </button>

          <button
            onClick={() => (onSelectGameMode ? onSelectGameMode('sandbox') : onToggleGameMode())}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              gameMode === 'sandbox'
                ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-600/70 shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
            title={t('sandbox')}
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{t('sandbox')}</span>
          </button>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
          title={isMuted ? t('soundOn') : t('soundOff')}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Coin Toss Protocol Button */}
        {onOpenCoinToss && (
          <button
            onClick={onOpenCoinToss}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/50 hover:bg-amber-900/70 border border-amber-700/60 rounded-lg transition-colors shadow-sm"
            title={t('coinTossTitle')}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('coinTossBtn')}</span>
          </button>
        )}

        {/* Reset button */}
        <button
          onClick={onReset}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 rounded-lg transition-colors flex items-center gap-1"
          title={t('resetBtn')}
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">{t('resetBtn')}</span>
        </button>
      </div>
    </header>
  );
};
