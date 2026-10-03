import React from 'react';
import { Volume2, VolumeX, RotateCcw, Bot, Users, BookOpen, SlidersHorizontal, Zap, Coins, FlaskConical } from 'lucide-react';
import { AIDifficulty, DIFFICULTY_LABELS } from '../engine/ai';

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
  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Clean Wordmark & AI Difficulty Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></div>
          <span className="text-base sm:text-lg font-bold tracking-widest text-slate-100 font-mono">
            WARFARE CHESS
          </span>
        </div>

        {/* Difficulty Selector (when in vs AI mode) */}
        {gameMode === 'ai' && (
          <div className="hidden sm:flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono ml-1">
            {(['easy', 'normal', 'expert'] as AIDifficulty[]).map((level) => {
              const isActive = difficulty === level;
              const meta = DIFFICULTY_LABELS[level];
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
                  {meta.nameTH}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Zone 2: Primary Controls & Advanced Mode Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Advanced Mode Toggle Button (ซ่อนบันทึกการเดินและคอนโซลไว้ในปุ่มนี้) */}
        <button
          onClick={onToggleAdvanced}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
            isAdvancedOpen
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
          }`}
          title="เปิด/ปิด Advanced Mode (บันทึกการเดิน, Text-Based Grid, คำสั่ง CLI)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>Advanced Mode</span>
          {movesCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 bg-slate-800 text-[10px] rounded-full text-slate-300 font-mono">
              {movesCount}
            </span>
          )}
        </button>

        {/* Rules button */}
        <button
          onClick={onOpenRules}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-800 transition-colors"
          title="คู่มือกติกา Warfare"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>กติกา</span>
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
            title="สู้กับบอททหาร AI"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">vs AI</span>
          </button>

          <button
            onClick={() => (onSelectGameMode ? onSelectGameMode('pvp') : onToggleGameMode())}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              gameMode === 'pvp'
                ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="ผู้เล่น 2 คน (PVP)"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">2P</span>
          </button>

          <button
            onClick={() => (onSelectGameMode ? onSelectGameMode('sandbox') : onToggleGameMode())}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              gameMode === 'sandbox'
                ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-600/70 shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
            title="โหมดทดสอบกระดานเปล่า (Sandbox / Test Mode)"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Sandbox</span>
          </button>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
          title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Coin Toss Protocol Button */}
        {onOpenCoinToss && (
          <button
            onClick={onOpenCoinToss}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/50 hover:bg-amber-900/70 border border-amber-700/60 rounded-lg transition-colors shadow-sm"
            title="ทอยเหรียญกำหนดฝ่ายเริ่มเดิน (เสี่ยงทายใหม่)"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">ทอยเหรียญ</span>
          </button>
        )}

        {/* Reset button */}
        <button
          onClick={onReset}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 rounded-lg transition-colors flex items-center gap-1"
          title="เริ่มเกมใหม่ (Reset)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">เริ่มใหม่</span>
        </button>
      </div>
    </header>
  );
};
