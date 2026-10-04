import React from 'react';
import { X, ShieldCheck, Plane, Swords, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../i18n';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const { t, getRules } = useLanguage();
  if (!isOpen) return null;

  const sections = getRules();

  const getSectionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 1:
        return <Plane className="w-4 h-4 text-cyan-400" />;
      case 2:
        return <ShieldAlert className="w-4 h-4 text-emerald-400" />;
      case 3:
        return <Swords className="w-4 h-4 text-purple-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100 font-mono">
              {t('rulesTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans select-text">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-amber-300 flex items-center gap-2 text-sm sm:text-base mb-2">
                {getSectionIcon(idx)}
                <span>{section.title}</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm whitespace-pre-line mb-2">
                {section.content}
              </p>
              {section.items && section.items.length > 0 && (
                <ul className="space-y-1.5 list-disc pl-4 text-slate-300 text-xs sm:text-sm">
                  {section.items.map((item, i) => (
                    <li key={i}>
                      <strong className="text-slate-100">{item.name}: </strong>
                      <span>{item.desc}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg"
          >
            {t('acknowledgeRulesBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
