import React, { useRef, useEffect } from 'react';
import { Move } from '../types/chess';
import { ScrollText, Swords, Shield, ShieldAlert, Plane } from 'lucide-react';
import { useLanguage } from '../i18n';

interface CombatLogProps {
  moves: Move[];
}

export const CombatLog: React.FC<CombatLogProps> = ({ moves }) => {
  const { t, getFactionName } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves]);

  return (
    <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-1.5 text-amber-400">
          <ScrollText className="w-3.5 h-3.5" />
          <span>{t('tabCombatLog')}</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          {moves.length} {t('movesCount')}
        </span>
      </div>

      {/* Log entries */}
      <div className="p-3 overflow-y-auto max-h-56 min-h-32 font-mono text-xs space-y-1.5 bg-slate-950/90 select-text">
        {moves.length === 0 ? (
          <div className="text-slate-500 text-center py-4 italic">
            {t('noneCaptured')}
          </div>
        ) : (
          moves.map((m, idx) => {
            const isWhite = m.piece.faction === 'white';
            return (
              <div
                key={idx}
                className="flex items-start gap-2 py-1 px-1.5 rounded hover:bg-slate-900/60 transition-colors border-b border-slate-900/40"
              >
                <span className="text-slate-500 text-[10px] w-6 shrink-0 mt-0.5">
                  #{idx + 1}
                </span>

                <div className="shrink-0 mt-0.5">
                  {m.type === 'capture' ? (
                    <Swords className="w-3.5 h-3.5 text-rose-400" />
                  ) : m.type === 'lock' ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  ) : m.type === 'promotion' ? (
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                  ) : m.piece.type === 'jet' ? (
                    <Plane className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span
                      className={`inline-block w-2 h-2 rounded-full mt-1 ${
                        isWhite ? 'bg-cyan-400' : 'bg-rose-500'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold ${
                        isWhite ? 'text-cyan-300' : 'text-rose-300'
                      }`}
                    >
                      {m.notation}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {getFactionName(m.piece.faction).split(' ')[0]}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {m.description}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};
