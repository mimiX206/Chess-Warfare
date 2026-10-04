import React from 'react';
import { Faction } from '../types/chess';
import { Board } from '../engine/warfareRules';
import { Play, Edit3, Trash2, RotateCcw, AlertTriangle, Shield, Swords, Wand2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n';

interface SandboxControlsProps {
  sandboxState: 'edit' | 'play';
  onToggleSandboxState: () => void;
  board: Board;
  currentTurn: Faction;
  onChangeTurn: (f: Faction) => void;
  onClearBoard: () => void;
  onLoadStandardBoard: () => void;
  onResetTestPlay: () => void;
  validationError: string | null;
}

export const SandboxControls: React.FC<SandboxControlsProps> = ({
  sandboxState,
  onToggleSandboxState,
  board,
  currentTurn,
  onChangeTurn,
  onClearBoard,
  onLoadStandardBoard,
  onResetTestPlay,
  validationError,
}) => {
  const { t, getFactionName } = useLanguage();

  // Count presidents
  let whitePresidents = 0;
  let blackPresidents = 0;
  let totalPieces = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        totalPieces++;
        if (p.type === 'president') {
          if (p.faction === 'white') whitePresidents++;
          else blackPresidents++;
        }
      }
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col gap-2.5 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold font-mono text-amber-300 flex items-center gap-2">
              <span>{t('sandboxTitle')}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border bg-slate-800 text-slate-300 font-mono">
                {sandboxState === 'edit' ? t('sandboxEditMode') : t('sandboxPlayMode')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {sandboxState === 'edit' ? t('sandboxEditHint') : t('sandboxPlayHint')}
            </p>
          </div>
        </div>

        {/* Edit / Play Main Switch Button */}
        {sandboxState === 'edit' ? (
          <button
            onClick={onToggleSandboxState}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-lg transition-all"
            title={t('sandboxStartPlay')}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t('sandboxStartPlay')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onResetTestPlay}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              title={t('retryTestBtn')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleSandboxState}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t('sandboxBackToEdit')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Validation or Hint message */}
      {validationError && sandboxState === 'edit' && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-700 text-rose-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Setup Controls (only visible in edit state) */}
      {sandboxState === 'edit' && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
          {/* President Status Chips */}
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded border text-[11px] flex items-center gap-1 ${
                whitePresidents === 1
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                  : 'bg-rose-950/60 border-rose-500 text-rose-300'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>{getFactionName('white').split(' ')[0]}: {whitePresidents}/1 King</span>
            </span>

            <span
              className={`px-2 py-0.5 rounded border text-[11px] flex items-center gap-1 ${
                blackPresidents === 1
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-rose-950/60 border-rose-500 text-rose-300'
              }`}
            >
              <Swords className="w-3 h-3" />
              <span>{getFactionName('black').split(' ')[0]}: {blackPresidents}/1 King</span>
            </span>

            <span className="text-[11px] text-slate-400">
              {t('sandboxTotalPieces')}: {totalPieces} {t('sandboxPiecesUnit')}
            </span>
          </div>

          {/* Quick Setup Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Start Turn Toggle */}
            <button
              onClick={() => onChangeTurn(currentTurn === 'white' ? 'black' : 'white')}
              className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
              title={t('sandboxFirstTurn')}
            >
              <span>{t('sandboxFirstTurn')}:</span>
              <span className={`font-bold ${currentTurn === 'white' ? 'text-cyan-400' : 'text-rose-400'}`}>
                {getFactionName(currentTurn).split(' ')[0]}
              </span>
            </button>

            {/* Clear Board */}
            <button
              onClick={onClearBoard}
              className="px-2.5 py-1 rounded-lg border border-rose-900/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[11px] flex items-center gap-1"
              title={t('sandboxClearBoard')}
            >
              <Trash2 className="w-3 h-3" />
              <span>{t('sandboxClearBoard')}</span>
            </button>

            {/* Standard Preset */}
            <button
              onClick={onLoadStandardBoard}
              className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
              title={t('sandboxStandardPreset')}
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t('sandboxStandardPreset')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
