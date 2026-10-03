import React from 'react';
import { GameStatus, Piece } from '../types/chess';
import { posToCoord, getPieceNameTH } from '../engine/warfareRules';
import { Shield, Plane, AlertTriangle, UserCheck, UserX } from 'lucide-react';

interface StatusPanelProps {
  gameStatus: GameStatus;
  capturedWhite: Piece[];
  capturedBlack: Piece[];
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
  gameStatus,
  capturedWhite,
  capturedBlack,
}) => {
  const { turn, turnNumber, whiteVIP, blackVIP, whiteJets, blackJets, isCheck, isCheckmate, winner } = gameStatus;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Turn & Alarm Banner */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
          isCheckmate
            ? 'bg-rose-950/80 border-rose-600 text-rose-100 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
            : isCheck
            ? 'bg-amber-950/80 border-amber-600 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
            : turn === 'white'
            ? 'bg-slate-900/90 border-cyan-500/50 text-slate-100'
            : 'bg-slate-900/90 border-rose-500/50 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              turn === 'white' ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
            }`}
          />
          <div>
            <div className="text-xs text-slate-400 font-mono">ตาเดินที่ #{turnNumber}</div>
            <div className="text-sm sm:text-base font-bold font-mono tracking-wide">
              {turn === 'white' ? 'ฝ่ายน้ำเงิน (Allied White)' : 'ฝ่ายแดง (Opponent Black)'}
            </div>
          </div>
        </div>

        {isCheckmate ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-900 text-rose-100 rounded-lg text-xs font-bold font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-300" />
            <span>CHECKMATE! {winner === 'white' ? 'ฝ่ายน้ำเงินชนะ' : 'ฝ่ายแดงชนะ'}</span>
          </div>
        ) : isCheck ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-900 text-amber-100 rounded-lg text-xs font-bold font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>CHECK (ถูกรุก)!</span>
          </div>
        ) : (
          <div className="text-xs font-mono text-slate-400">สถานะ: ปฏิบัติการรบ</div>
        )}
      </div>

      {/* Grid of VIP Protection and Jet Cooldowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* WHITE FORCES (ฝ่ายน้ำเงิน) */}
        <div className="bg-slate-900/80 border border-cyan-900/60 rounded-xl p-3 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-1.5">
            <span className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              ฝ่ายน้ำเงิน (Allied White)
            </span>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {whiteVIP.isPresidentInvincible ? (
                <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                  <Shield className="w-3 h-3" />
                  เกราะอมตะ: เปิด
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-700/50">
                  <AlertTriangle className="w-3 h-3" />
                  เกราะแตก: รุกฆาตได้
                </span>
              )}
            </div>
          </div>

          {/* VIP Units Status */}
          <div className="text-xs space-y-1 font-mono text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">สุภาพสตรีหมายเลขหนึ่ง (First Lady):</span>
              <span className="flex items-center gap-1">
                {whiteVIP.firstLadyAlive ? (
                  <span className="text-emerald-300 flex items-center gap-0.5">
                    <UserCheck className="w-3 h-3" /> มีชีวิต
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <UserX className="w-3 h-3" /> ถูกกำจัด
                  </span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">บอดี้การ์ด (Bodyguards):</span>
              <span className="text-cyan-200 font-semibold">{whiteVIP.bodyguardsRemaining} นาย</span>
            </div>
          </div>

          {/* White Jets Cooldown */}
          <div className="border-t border-slate-800 pt-2">
            <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <Plane className="w-3 h-3 text-cyan-400" />
              <span>คูลดาวน์เครื่องบินขับไล่ (Jet):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {whiteJets.length === 0 ? (
                <span className="text-xs text-slate-500 font-mono">ไม่มี Jet บนกระดาน</span>
              ) : (
                whiteJets.map((j, idx) => (
                  <div
                    key={j.id}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                      j.cooldown === 0
                        ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                        : 'bg-rose-950/60 border-rose-700/80 text-rose-300'
                    }`}
                  >
                    <span>Jet #{idx + 1} ({posToCoord(j.pos)}):</span>
                    <span className="font-bold">
                      {j.cooldown === 0 ? 'พร้อมบิน ✈️' : `รอ ${j.cooldown} เทิร์น`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Captured Opponents */}
          {capturedBlack.length > 0 && (
            <div className="border-t border-slate-800 pt-1.5 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500">ยึดได้:</span>
              {capturedBlack.map((p, i) => (
                <span key={i} className="text-slate-300" title={getPieceNameTH(p.type).name}>
                  {getPieceNameTH(p.type).symbol}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* BLACK FORCES (ฝ่ายแดง) */}
        <div className="bg-slate-900/80 border border-rose-900/60 rounded-xl p-3 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between border-b border-rose-900/40 pb-1.5">
            <span className="text-xs font-bold font-mono text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              ฝ่ายแดง (Opponent Black)
            </span>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {blackVIP.isPresidentInvincible ? (
                <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                  <Shield className="w-3 h-3" />
                  เกราะอมตะ: เปิด
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-700/50">
                  <AlertTriangle className="w-3 h-3" />
                  เกราะแตก: รุกฆาตได้
                </span>
              )}
            </div>
          </div>

          {/* VIP Units Status */}
          <div className="text-xs space-y-1 font-mono text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">สุภาพสตรีหมายเลขหนึ่ง (First Lady):</span>
              <span className="flex items-center gap-1">
                {blackVIP.firstLadyAlive ? (
                  <span className="text-emerald-300 flex items-center gap-0.5">
                    <UserCheck className="w-3 h-3" /> มีชีวิต
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <UserX className="w-3 h-3" /> ถูกกำจัด
                  </span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">บอดี้การ์ด (Bodyguards):</span>
              <span className="text-rose-300 font-semibold">{blackVIP.bodyguardsRemaining} นาย</span>
            </div>
          </div>

          {/* Black Jets Cooldown */}
          <div className="border-t border-slate-800 pt-2">
            <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <Plane className="w-3 h-3 text-rose-400" />
              <span>คูลดาวน์เครื่องบินขับไล่ (Jet):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {blackJets.length === 0 ? (
                <span className="text-xs text-slate-500 font-mono">ไม่มี Jet บนกระดาน</span>
              ) : (
                blackJets.map((j, idx) => (
                  <div
                    key={j.id}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                      j.cooldown === 0
                        ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                        : 'bg-rose-950/60 border-rose-700/80 text-rose-300'
                    }`}
                  >
                    <span>Jet #{idx + 1} ({posToCoord(j.pos)}):</span>
                    <span className="font-bold">
                      {j.cooldown === 0 ? 'พร้อมบิน ✈️' : `รอ ${j.cooldown} เทิร์น`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Captured Allies */}
          {capturedWhite.length > 0 && (
            <div className="border-t border-slate-800 pt-1.5 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500">ยึดได้:</span>
              {capturedWhite.map((p, i) => (
                <span key={i} className="text-slate-300" title={getPieceNameTH(p.type).name}>
                  {getPieceNameTH(p.type).symbol}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
