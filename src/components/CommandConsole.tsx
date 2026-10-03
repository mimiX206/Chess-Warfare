import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, HelpCircle } from 'lucide-react';

interface CommandConsoleProps {
  onExecuteCommand: (command: string) => string;
  onOpenRules: () => void;
}

export const CommandConsole: React.FC<CommandConsoleProps> = ({
  onExecuteCommand,
  onOpenRules,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ text: string; type: 'input' | 'output' | 'error' | 'system' }>>([
    {
      text: 'Warfare Tactical Chess Engine v1.0 พร้อมรับคำสั่งปฏิบัติการ (พิมพ์ "help" เพื่อดูคำสั่ง)',
      type: 'system',
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newHistory = [...history, { text: `> ${cmd}`, type: 'input' as const }];

    if (cmd.toLowerCase() === 'clear') {
      setHistory([{ text: 'คอนโซลถูกล้างเรียบร้อย', type: 'system' }]);
      setInput('');
      return;
    }

    if (cmd.toLowerCase() === 'help') {
      newHistory.push({
        text: `คำสั่งที่รองรับ:
- เดินหมาก: [พิกัดต้นทาง][พิกัดปลายทาง] เช่น "e2e4", "move e2 e4", "b1c3"
- เลือกหมาก: "select e2", "view e2"
- ล็อกเป้าหมาย (สำหรับตำรวจ): "lock e5"
- ดูสถานะ: "status"
- ล้างหน้าจอ: "clear"
- เริ่มเกมใหม่: "reset"
- กติกา: "rules"`,
        type: 'output',
      });
      setHistory(newHistory);
      setInput('');
      return;
    }

    if (cmd.toLowerCase() === 'rules') {
      onOpenRules();
      newHistory.push({ text: 'เปิดคู่มือกติกา Warfare เรียบร้อย', type: 'system' });
      setHistory(newHistory);
      setInput('');
      return;
    }

    const result = onExecuteCommand(cmd);
    const isErr = result.includes('❌') || result.includes('ไม่สามารถ') || result.includes('ผิดพลาด') || result.includes('ติดคูลดาวน์');

    newHistory.push({
      text: result,
      type: isErr ? 'error' : 'output',
    });

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Terminal className="w-3.5 h-3.5" />
          <span>COMMAND LINE INTERACTION (CLI)</span>
        </div>
        <button
          onClick={onOpenRules}
          className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px]"
        >
          <HelpCircle className="w-3 h-3" />
          <span>คู่มือคำสั่ง</span>
        </button>
      </div>

      {/* Terminal Output */}
      <div className="p-3 overflow-y-auto max-h-40 min-h-24 font-mono text-xs space-y-1.5 bg-slate-950/90 select-text">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`leading-relaxed whitespace-pre-wrap ${
              item.type === 'input'
                ? 'text-cyan-300 font-semibold'
                : item.type === 'error'
                ? 'text-rose-400'
                : item.type === 'system'
                ? 'text-slate-400 italic'
                : 'text-emerald-300'
            }`}
          >
            {item.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex border-t border-slate-800 bg-slate-900/60 p-1.5 gap-1.5">
        <span className="font-mono text-xs text-amber-400 flex items-center pl-2">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='พิมพ์คำสั่ง เช่น "e2e4", "select e2", "status", "help"'
          className="flex-1 bg-transparent px-2 py-1 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-mono font-medium transition-colors flex items-center gap-1"
        >
          <Send className="w-3 h-3" />
          <span className="hidden sm:inline">ส่งคำสั่ง</span>
        </button>
      </form>
    </div>
  );
};
