import React from 'react';
import { GameStatus, Piece } from '../types/chess';
import { Shield, Plane, AlertTriangle, Crosshair } from 'lucide-react';
import { posToCoord, getPieceNameTH } from '../engine/warfareRules';

interface MinimalStatusProps {
  gameStatus: GameStatus;
  capturedWhite: Piece[];
  capturedBlack: Piece[];
}

export const MinimalStatus: React.FC<MinimalStatusProps> = ({
  gameStatus,
  capturedWhite,
  capturedBlack,
}) => {
  const { turn, turnNumber, whiteVIP, blackVIP, whiteJets, blackJets, isCheck, isCheckmate, winner } = gameStatus;

  return (
    <div className="w-full flex flex-col gap-2 max-w-2xl mx-auto">
      {/* Top streamlined bar: Turn & Threat banner */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 rounded-xl border border-slate-800 shadow-sm">
        {/* Turn Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              turn === 'white'
                ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
            }`}
          />
          <span className="text-xs font-mono text-slate-400">ตา #{turnNumber}</span>
          <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-100">
            {turn === 'white' ? 'ฝ่ายน้ำเงิน (Allies)' : 'ฝ่ายแดง (Opponents)'}
          </span>
        </div>

        {/* Check / Status pill */}
        <div>
          {isCheckmate ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-600 rounded-lg text-xs font-bold font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>CHECKMATE ({winner === 'white' ? 'น้ำเงินชนะ' : 'แดงชนะ'})</span>
            </span>
          ) : gameStatus.isStalemate ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-600 rounded-lg text-xs font-bold font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>ประธานาธิบดีปะปนกับฝูงชน (เสมอ)</span>
            </span>
          ) : gameStatus.isInsufficientMaterial ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-800 text-amber-300 border border-amber-500/60 rounded-lg text-xs font-bold font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>กองกำลังไม่พอ (เสมอ)</span>
            </span>
          ) : isCheck ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-500 rounded-lg text-xs font-bold font-mono animate-pulse">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>ถูกรุก (CHECK)</span>
            </span>
          ) : (
            <span className="text-[11px] font-mono text-slate-400">
              สถานะ: กำลังรบ
            </span>
          )}
        </div>
      </div>

      {/* VIP & Jet Status Minimal Strip */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        {/* White (Allied) Summary */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/60 rounded-lg border border-cyan-900/40 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="font-semibold text-cyan-200">น้ำเงิน</span>
            {whiteVIP.isPresidentInvincible ? (
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5" title="Bodyguard หรือ First Lady ยังมีชีวิต">
                <Shield className="w-3 h-3 text-emerald-400 fill-current" />
                อมตะ
              </span>
            ) : (
              <span className="text-[10px] text-rose-400 flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" />
                เกราะแตก
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            {whiteJets.map((j, i) => (
              <span
                key={j.id}
                className={`flex items-center gap-0.5 ${
                  j.cooldown === 0 ? 'text-emerald-400' : 'text-slate-500'
                }`}
                title={`Jet #${i + 1} (${posToCoord(j.pos)}): ${j.cooldown === 0 ? 'พร้อม' : `รอ ${j.cooldown} เทิร์นบนกระดาน (นับรวมที่ศัตรูเดิน)`}`}
              >
                <Plane className="w-2.5 h-2.5" />
                {j.cooldown === 0 ? 'OK' : `${j.cooldown}T`}
              </span>
            ))}
          </div>
        </div>

        {/* Black (Opponent) Summary */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/60 rounded-lg border border-rose-900/40 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span className="font-semibold text-rose-200">แดง</span>
            {blackVIP.isPresidentInvincible ? (
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5" title="Bodyguard หรือ First Lady ยังมีชีวิต">
                <Shield className="w-3 h-3 text-emerald-400 fill-current" />
                อมตะ
              </span>
            ) : (
              <span className="text-[10px] text-rose-400 flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" />
                เกราะแตก
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            {blackJets.map((j, i) => (
              <span
                key={j.id}
                className={`flex items-center gap-0.5 ${
                  j.cooldown === 0 ? 'text-emerald-400' : 'text-slate-500'
                }`}
                title={`Jet #${i + 1} (${posToCoord(j.pos)}): ${j.cooldown === 0 ? 'พร้อม' : `รอ ${j.cooldown} เทิร์นบนกระดาน (นับรวมที่ศัตรูเดิน)`}`}
              >
                <Plane className="w-2.5 h-2.5" />
                {j.cooldown === 0 ? 'OK' : `${j.cooldown}T`}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Captured cemetery row (clean & quiet) */}
      {(capturedBlack.length > 0 || capturedWhite.length > 0) && (
        <div className="flex justify-between items-center text-[11px] font-mono px-2 text-slate-400">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">ยึดได้:</span>
            {capturedBlack.map((p, i) => (
              <span key={i} className="text-cyan-300 text-xs" title={getPieceNameTH(p.type).name}>
                {getPieceNameTH(p.type).symbol}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">สูญเสีย:</span>
            {capturedWhite.map((p, i) => (
              <span key={i} className="text-rose-400 text-xs" title={getPieceNameTH(p.type).name}>
                {getPieceNameTH(p.type).symbol}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
