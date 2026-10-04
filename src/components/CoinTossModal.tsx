import React, { useState, useEffect } from 'react';
import { Faction } from '../types/chess';
import { sounds } from '../utils/audio';
import { Coins, Swords, Shield, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { useLanguage } from '../i18n';

export type CoinFace = 'heads' | 'tails';

interface CoinTossModalProps {
  isOpen: boolean;
  gameMode?: 'ai' | 'pvp' | 'sandbox';
  onComplete: (firstTurn: Faction) => void;
}

export const CoinTossModal: React.FC<CoinTossModalProps> = ({
  isOpen,
  gameMode = 'pvp',
  onComplete,
}) => {
  const { t, getFactionName } = useLanguage();
  const [whiteChoice, setWhiteChoice] = useState<CoinFace>('heads');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [result, setResult] = useState<CoinFace | null>(null);
  const [winner, setWinner] = useState<Faction | null>(null);

  // ALWAYS RESET state when modal is opened fresh (for new games / resets)
  useEffect(() => {
    if (isOpen) {
      setResult(null);
      setWinner(null);
      setIsFlipping(false);
      setWhiteChoice('heads');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFlip = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult(null);
    setWinner(null);
    sounds.playCoinFlip();

    // Strict 50/50 Probability
    const coinOutcome: CoinFace = Math.random() < 0.5 ? 'heads' : 'tails';

    setTimeout(() => {
      setResult(coinOutcome);
      const winningFaction: Faction = coinOutcome === whiteChoice ? 'white' : 'black';
      setWinner(winningFaction);
      setIsFlipping(false);
      sounds.playCoinWin();
    }, 1300);
  };

  const handleResetFlip = () => {
    setResult(null);
    setWinner(null);
    setIsFlipping(false);
  };

  const handleStartBattle = () => {
    if (winner) {
      onComplete(winner);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl max-w-lg w-full p-6 text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase">
            {gameMode === 'pvp' ? '2-PLAYER INITIATIVE' : 'AI BATTLE INITIATIVE'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono">
          {t('coinTossTitle')}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          {t('coinTossSubtitle')}
        </p>

        {/* Coin Stage Display */}
        <div className="my-5 flex flex-col items-center justify-center min-h-[140px]">
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-xl transition-all duration-300 ${
              isFlipping
                ? 'animate-spin border-amber-400 bg-amber-500/30'
                : result === 'heads'
                ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.4)]'
                : result === 'tails'
                ? 'border-rose-400 bg-rose-950/70 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                : 'border-amber-500/70 bg-slate-950 text-amber-300'
            }`}
          >
            {isFlipping ? (
              <Coins className="w-12 h-12 text-amber-300 animate-pulse" />
            ) : result === 'heads' ? (
              <>
                <Shield className="w-10 h-10 text-cyan-300" />
                <span className="font-mono font-black text-sm tracking-wider mt-1">
                  {t('heads')}
                </span>
              </>
            ) : result === 'tails' ? (
              <>
                <Swords className="w-10 h-10 text-rose-300" />
                <span className="font-mono font-black text-sm tracking-wider mt-1">
                  {t('tails')}
                </span>
              </>
            ) : (
              <>
                <Coins className="w-10 h-10 text-amber-400" />
                <span className="font-mono text-xs text-amber-300/80 mt-1">
                  {t('coinTossBtn')}
                </span>
              </>
            )}
          </div>

          {/* Result Announcement */}
          {result && winner && !isFlipping && (
            <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center gap-2">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold border ${
                  winner === 'white'
                    ? 'bg-cyan-950 text-cyan-200 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'bg-rose-950 text-rose-200 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {winner === 'white' ? t('coinTossWinBlue') : t('coinTossWinRed')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Selection Cards (Only active before flip or after reset) */}
        {!result && (
          <div className="grid grid-cols-2 gap-3 mb-5 text-left">
            {/* White Choice Option 1: Heads */}
            <button
              disabled={isFlipping}
              onClick={() => setWhiteChoice('heads')}
              className={`p-3 rounded-xl border transition-all flex flex-col items-start ${
                whiteChoice === 'heads'
                  ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/50 shadow-md'
                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  {t('heads')}
                </span>
                {whiteChoice === 'heads' && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                )}
              </div>
              <div className="text-[11px] font-mono text-cyan-300 mt-1">
                {getFactionName('white').split(' ')[0]}: {t('heads')}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                ({getFactionName('black').split(' ')[0]}: {t('tails')})
              </div>
            </button>

            {/* White Choice Option 2: Tails */}
            <button
              disabled={isFlipping}
              onClick={() => setWhiteChoice('tails')}
              className={`p-3 rounded-xl border transition-all flex flex-col items-start ${
                whiteChoice === 'tails'
                  ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/50 shadow-md'
                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-rose-400" />
                  {t('tails')}
                </span>
                {whiteChoice === 'tails' && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                )}
              </div>
              <div className="text-[11px] font-mono text-cyan-300 mt-1">
                {getFactionName('white').split(' ')[0]}: {t('tails')}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                ({getFactionName('black').split(' ')[0]}: {t('heads')})
              </div>
            </button>
          </div>
        )}

        {/* Action Button */}
        <div>
          {!result ? (
            <button
              onClick={handleFlip}
              disabled={isFlipping}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFlipping ? t('coinTossFlipping') : t('coinTossFlipBtn')}</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={handleResetFlip}
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                title={t('retryTestBtn')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('resetBtn')}</span>
              </button>
              <button
                onClick={handleStartBattle}
                className="flex-1 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" />
                <span>{t('enterBattleBtn')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
