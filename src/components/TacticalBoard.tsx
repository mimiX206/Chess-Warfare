import React from 'react';
import { Board, posToCoord } from '../engine/warfareRules';
import { Position, MoveTarget, VIPStatus, Faction } from '../types/chess';
import { PieceIcon } from './PieceIcon';
import { Sparkles, Crosshair } from 'lucide-react';

interface TacticalBoardProps {
  board: Board;
  selectedPos: Position | null;
  legalTargets: MoveTarget[];
  onSelectSquare: (pos: Position) => void;
  whiteVIP: VIPStatus;
  blackVIP: VIPStatus;
  isCheck?: boolean;
  currentTurn?: Faction;
  disabled?: boolean;
  isSandboxEdit?: boolean;
}

export const TacticalBoard: React.FC<TacticalBoardProps> = ({
  board,
  selectedPos,
  legalTargets,
  onSelectSquare,
  whiteVIP,
  blackVIP,
  isCheck = false,
  currentTurn = 'white',
  disabled = false,
  isSandboxEdit = false,
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <div className="relative inline-block select-none bg-slate-950 p-2 sm:p-3 rounded-xl border border-slate-800 shadow-2xl">
      {/* Top File Coordinates */}
      <div className="grid grid-cols-8 ml-6 mr-1 mb-1 text-center font-mono text-[11px] font-semibold text-slate-500">
        {files.map((f) => (
          <div key={`top-${f}`}>{f}</div>
        ))}
      </div>

      <div className="flex">
        {/* Left Rank Coordinates */}
        <div className="flex flex-col justify-around mr-1.5 font-mono text-[11px] font-semibold text-slate-500 w-4 text-center">
          {[8, 7, 6, 5, 4, 3, 2, 1].map((r) => (
            <div key={`rank-${r}`} className="h-10 sm:h-14 md:h-16 flex items-center justify-center">
              {r}
            </div>
          ))}
        </div>

        {/* 8x8 Tactical Grid */}
        <div className="grid grid-cols-8 grid-rows-8 border-2 border-slate-700/80 rounded-lg overflow-hidden bg-slate-900 shadow-inner">
          {board.map((rowArr, r) =>
            rowArr.map((piece, c) => {
              const pos: Position = { row: r, col: c };
              const coord = posToCoord(pos);
              const isDark = (r + c) % 2 === 1;

              const isSelected = selectedPos && selectedPos.row === r && selectedPos.col === c;
              const target = legalTargets.find((t) => t.pos.row === r && t.pos.col === c);

              const isMoveTarget = target && target.type === 'move';
              const isCaptureTarget = target && target.type === 'capture';
              const isLockTarget = target && target.type === 'lock';

              // Determine President Invincible status & check threat
              const isPresident = piece?.type === 'president';
              const isInvinciblePresident =
                isPresident &&
                ((piece?.faction === 'white' && whiteVIP.isPresidentInvincible) ||
                  (piece?.faction === 'black' && blackVIP.isPresidentInvincible));
              const isPresidentChecked =
                isPresident &&
                !isInvinciblePresident &&
                isCheck &&
                piece?.faction === currentTurn;

              // Tile base colors: modern dark military radar tiles
              let tileBg = isDark
                ? 'bg-slate-800/80 hover:bg-slate-750'
                : 'bg-slate-700/60 hover:bg-slate-650';

              if (isSandboxEdit) {
                tileBg = isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 hover:ring-2 hover:ring-amber-400/80 hover:z-10 cursor-pointer'
                  : 'bg-slate-700/60 hover:bg-slate-600 hover:ring-2 hover:ring-amber-400/80 hover:z-10 cursor-pointer';
              } else if (isPresidentChecked) {
                tileBg = 'bg-rose-950/90 ring-2 ring-inset ring-rose-500 animate-pulse';
              } else if (isSelected) {
                tileBg = 'bg-amber-500/30 ring-2 ring-inset ring-amber-400';
              } else if (isCaptureTarget) {
                tileBg = 'bg-rose-950/80 ring-2 ring-inset ring-rose-500/80';
              } else if (isLockTarget) {
                tileBg = 'bg-blue-950/80 ring-2 ring-inset ring-cyan-400';
              } else if (isMoveTarget) {
                tileBg = isDark ? 'bg-slate-800/90' : 'bg-slate-700/70';
              }

              return (
                <button
                  key={coord}
                  onClick={() => !disabled && onSelectSquare(pos)}
                  disabled={disabled}
                  aria-label={`${coord} ${piece ? piece.type : 'empty'}`}
                  className={`relative w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${tileBg}`}
                >
                  {/* Subtle coordinate watermark in bottom-right corner of tile */}
                  <span className="absolute bottom-0.5 right-1 font-mono text-[9px] text-slate-500/40 pointer-events-none">
                    {coord}
                  </span>

                  {/* PIECE RENDERING */}
                  {piece && (
                    <PieceIcon
                      piece={piece}
                      isInvinciblePresident={isInvinciblePresident}
                      isChecked={isPresidentChecked}
                    />
                  )}

                  {/* VISUAL & INTERACTION STANDARD:
                      1. Empty legal move: Center Dot symbol [ • ] */}
                  {isMoveTarget && !piece && (
                    <div className="relative flex items-center justify-center pointer-events-none">
                      <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">
                        [ • ]
                      </span>
                    </div>
                  )}

                  {/* 2. Capture Target: High-brightness highlight underneath & [*X*] / [✨X✨] */}
                  {isCaptureTarget && (
                    <div className="absolute inset-0 flex flex-col items-center justify-between p-0.5 pointer-events-none z-20">
                      <div className="w-full flex justify-between items-center px-1 text-rose-400">
                        <Sparkles className="w-3 h-3 animate-spin" />
                        <Crosshair className="w-3 h-3 text-rose-500 animate-pulse" />
                      </div>
                      <div className="bg-rose-900/90 text-rose-100 font-mono text-[10px] sm:text-xs font-black px-1 rounded border border-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-bounce">
                        [*X*]
                      </div>
                    </div>
                  )}

                  {/* 3. Police Lock Target: [🔒X🔒] */}
                  {isLockTarget && (
                    <div className="absolute inset-0 flex flex-col items-center justify-between p-0.5 pointer-events-none z-20">
                      <div className="w-full flex justify-end px-1 text-cyan-400">
                        <Crosshair className="w-3 h-3 text-cyan-400 animate-pulse" />
                      </div>
                      <div className="bg-cyan-900/90 text-cyan-100 font-mono text-[10px] sm:text-xs font-black px-1 rounded border border-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-pulse">
                        [🔒X🔒]
                      </div>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom File Coordinates */}
      <div className="grid grid-cols-8 ml-6 mr-1 mt-1 text-center font-mono text-[11px] font-semibold text-slate-500">
        {files.map((f) => (
          <div key={`bottom-${f}`}>{f}</div>
        ))}
      </div>
    </div>
  );
};
