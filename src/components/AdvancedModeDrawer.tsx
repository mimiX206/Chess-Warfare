import React, { useState } from 'react';
import { X, ScrollText, Terminal, Command } from 'lucide-react';
import { CombatLog } from './CombatLog';
import { TextGridPanel } from './TextGridPanel';
import { CommandConsole } from './CommandConsole';
import { Move } from '../types/chess';

interface AdvancedModeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  moves: Move[];
  textContent: string;
  onExecuteCommand: (cmd: string) => string;
  onOpenRules: () => void;
}

export const AdvancedModeDrawer: React.FC<AdvancedModeDrawerProps> = ({
  isOpen,
  onClose,
  moves,
  textContent,
  onExecuteCommand,
  onOpenRules,
}) => {
  const [activeTab, setActiveTab] = useState<'log' | 'terminal' | 'cli'>('log');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 font-mono tracking-wider">
              ADVANCED MODE: บันทึกและคอนโซลยุทธการ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="ปิด Advanced Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-800 bg-slate-900/80">
          <button
            onClick={() => setActiveTab('log')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'log'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>บันทึกการเดิน ({moves.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'terminal'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Text-Based Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === 'cli'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Command className="w-3.5 h-3.5" />
            <span>คำสั่ง CLI</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'log' && (
            <div className="h-full">
              <CombatLog moves={moves} />
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="h-full">
              <TextGridPanel textContent={textContent} />
            </div>
          )}

          {activeTab === 'cli' && (
            <div className="h-full flex flex-col gap-3">
              <CommandConsole
                onExecuteCommand={onExecuteCommand}
                onOpenRules={onOpenRules}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
