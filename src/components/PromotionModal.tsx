import React from 'react';
import { PieceType } from '../types/chess';
import { Swords, Plane, ShieldAlert, Shield } from 'lucide-react';
import { useLanguage } from '../i18n';

interface PromotionModalProps {
  isOpen: boolean;
  onSelectPromotion: (type: PieceType) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  onSelectPromotion,
}) => {
  const { t, getPiece } = useLanguage();
  if (!isOpen) return null;

  const choices: Array<{
    type: PieceType;
    icon: React.ReactNode;
    border: string;
    hoverBg: string;
  }> = [
    {
      type: 'brave_soldier',
      icon: <Swords className="w-8 h-8 text-amber-400" />,
      border: 'border-amber-500/50',
      hoverBg: 'hover:bg-amber-950/40 hover:border-amber-400',
    },
    {
      type: 'trainee_pilot',
      icon: <Plane className="w-8 h-8 text-cyan-400" />,
      border: 'border-cyan-500/50',
      hoverBg: 'hover:bg-cyan-950/40 hover:border-cyan-400',
    },
    {
      type: 'police',
      icon: <ShieldAlert className="w-8 h-8 text-blue-400" />,
      border: 'border-blue-500/50',
      hoverBg: 'hover:bg-blue-950/40 hover:border-blue-400',
    },
    {
      type: 'armored_car',
      icon: <Shield className="w-8 h-8 text-orange-400" />,
      border: 'border-orange-500/50',
      hoverBg: 'hover:bg-orange-950/40 hover:border-orange-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-5">
          <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
            CITIZEN PROMOTION PROTOCOL
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-1">
            {t('promotionTitle')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('promotionSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {choices.map((c) => {
            const pieceInfo = getPiece(c.type);
            return (
              <button
                key={c.type}
                onClick={() => onSelectPromotion(c.type)}
                className={`flex flex-col items-start p-3.5 rounded-xl border bg-slate-800/60 ${c.border} ${c.hoverBg} text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">{pieceInfo.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{pieceInfo.title}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-300 font-medium">{pieceInfo.role}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
