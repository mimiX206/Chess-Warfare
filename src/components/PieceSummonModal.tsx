import React, { useState } from 'react';
import { Faction, Piece, PieceType, Position } from '../types/chess';
import { posToCoord, getPieceNameTH } from '../engine/warfareRules';
import { PieceIcon } from './PieceIcon';
import { X, Trash2, Wand2, Shield, Swords } from 'lucide-react';

interface PieceSummonModalProps {
  isOpen: boolean;
  pos: Position | null;
  currentPiece: Piece | null;
  onSummon: (pos: Position, type: PieceType, faction: Faction) => void;
  onRemove: (pos: Position) => void;
  onClose: () => void;
}

const AVAILABLE_PIECES: { type: PieceType; name: string; role: string }[] = [
  { type: 'president', name: 'ประธานาธิบดี (President)', role: 'ผู้นำสูงสุด (King)' },
  { type: 'first_lady', name: 'สุภาพสตรีฯ (First Lady)', role: 'คุ้มกัน / เดินอิสระ (Queen)' },
  { type: 'bodyguard', name: 'บอดี้การ์ด (Bodyguard)', role: 'คุ้มกัน / ทแยง (Bishop)' },
  { type: 'jet', name: 'เครื่องบินขับไล่ (Jet)', role: 'L-Shape / คูลดาวน์ 2T (Knight)' },
  { type: 'tank', name: 'รถถัง (Tank)', role: 'แนวตั้ง/แนวนอน (Rook)' },
  { type: 'citizen', name: 'พลเมือง (Citizen)', role: 'เดินหน้า 1 / เลื่อนขั้น (Pawn)' },
  { type: 'brave_soldier', name: 'ทหารผู้กล้า (Brave Soldier)', role: 'เลื่อนขั้น: Queen ระยะ <= 5' },
  { type: 'trainee_pilot', name: 'นักบินฝึกหัด (Trainee Pilot)', role: 'เลื่อนขั้น: Knight ไร้คูลดาวน์' },
  { type: 'police', name: 'ตำรวจ (Police)', role: 'เลื่อนขั้น: พุ่งประชิดล็อก 1 ตา (ไม่โดนซ้ำ)' },
  { type: 'armored_car', name: 'รถหุ้มเกราะ (Armored Car)', role: 'เลื่อนขั้น: Rook ระยะ <= 4' },
];

export const PieceSummonModal: React.FC<PieceSummonModalProps> = ({
  isOpen,
  pos,
  currentPiece,
  onSummon,
  onRemove,
  onClose,
}) => {
  const [selectedFaction, setSelectedFaction] = useState<Faction>(
    currentPiece ? currentPiece.faction : 'white'
  );

  if (!isOpen || !pos) return null;

  const coord = posToCoord(pos);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-sm sm:text-base text-slate-100 flex items-center gap-1.5">
                <span>เสกตัวหมาก (Sandbox Summon)</span>
                <span className="text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded text-xs">
                  พิกัด {coord}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                เลือกฝ่ายและยูนิตที่ต้องการวางลงบนช่องนี้
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Faction Selector */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setSelectedFaction('white')}
            className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-mono text-xs font-bold transition-all ${
              selectedFaction === 'white'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>ฝ่ายน้ำเงิน (Allies)</span>
          </button>
          <button
            onClick={() => setSelectedFaction('black')}
            className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-mono text-xs font-bold transition-all ${
              selectedFaction === 'black'
                ? 'bg-rose-950/80 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>ฝ่ายแดง (Opponents)</span>
          </button>
        </div>

        {/* Piece Selection Grid */}
        <div className="overflow-y-auto flex-1 grid grid-cols-2 gap-2 pr-1 pb-1">
          {AVAILABLE_PIECES.map((item) => {
            const previewPiece: Piece = {
              id: `preview_${item.type}`,
              type: item.type,
              faction: selectedFaction,
              hasMoved: false,
              cooldown: 0,
              lockedTurns: 0,
            };

            const isCurrent =
              currentPiece &&
              currentPiece.type === item.type &&
              currentPiece.faction === selectedFaction;

            return (
              <button
                key={item.type}
                onClick={() => {
                  onSummon(pos, item.type, selectedFaction);
                  onClose();
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400'
                    : 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500'
                }`}
              >
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                  <PieceIcon piece={previewPiece} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs font-bold text-slate-200 truncate">
                    {getPieceNameTH(item.type).name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.role}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 mt-2 flex items-center justify-between gap-2">
          {currentPiece ? (
            <button
              onClick={() => {
                onRemove(pos);
                onClose();
              }}
              className="py-2 px-3 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl border border-rose-900 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ลบหมากช่องนี้</span>
            </button>
          ) : (
            <span className="text-[11px] font-mono text-slate-500">
              คลิกยูนิตด้านบนเพื่อวาง
            </span>
          )}

          <button
            onClick={onClose}
            className="py-2 px-4 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors ml-auto"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};
