import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface TextGridPanelProps {
  textContent: string;
}

export const TextGridPanel: React.FC<TextGridPanelProps> = ({ textContent }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl h-full">
      {/* Console Top Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-xs font-semibold text-slate-200">
            TEXT-BASED GRID CONSOLE (8x8)
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
          title="คัดลอกข้อความกระดาน"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>คัดลอกแล้ว</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Text Grid</span>
            </>
          )}
        </button>
      </div>

      {/* Monospace Output */}
      <div className="p-3 sm:p-4 overflow-auto max-h-[520px] font-mono text-xs text-amber-200/90 bg-slate-950/90 leading-relaxed whitespace-pre select-text selection:bg-amber-500/30">
        {textContent}
      </div>
    </div>
  );
};
