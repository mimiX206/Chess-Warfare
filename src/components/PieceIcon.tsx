import React from 'react';
import { Piece } from '../types/chess';
import { Shield, Lock } from 'lucide-react';

interface PieceIconProps {
  piece: Piece;
  isInvinciblePresident?: boolean;
  isChecked?: boolean;
}

export const PieceIcon: React.FC<PieceIconProps> = ({ piece, isInvinciblePresident, isChecked }) => {
  const isWhite = piece.faction === 'white';

  // Faction palettes
  const fillPrimary = isWhite ? '#E0F2FE' : '#FCA5A5';     // White: light sky, Black: light red
  const fillSecondary = isWhite ? '#0284C7' : '#DC2626';   // White: sky-600, Black: red-600
  const fillAccent = isWhite ? '#38BDF8' : '#F87171';      // White: sky-400, Black: red-400
  const strokeColor = isWhite ? '#0C4A6E' : '#450A0A';     // Deep outline for contrast
  const shadowGlow = isWhite ? 'rgba(56, 189, 248, 0.45)' : 'rgba(239, 68, 68, 0.45)';

  const renderSVG = () => {
    switch (piece.type) {
      // 1. President (ประธานาธิบดี - Supreme Commander Emblem)
      case 'president':
        return (
          <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md">
            {/* Outer Laurel / Commander Wreath */}
            <path
              d="M8 32 C6 24 10 14 16 10 C18 14 18 20 16 26 Z"
              fill={fillAccent}
              opacity="0.75"
            />
            <path
              d="M40 32 C42 24 38 14 32 10 C30 14 30 20 32 26 Z"
              fill={fillAccent}
              opacity="0.75"
            />
            {/* Commander Star / Crown */}
            <path
              d="M24 6 L28 16 L39 16 L30 22 L34 32 L24 26 L14 32 L18 22 L9 16 L20 16 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Center Core Insignia */}
            <circle cx="24" cy="21" r="4.5" fill={fillSecondary} stroke={strokeColor} strokeWidth="1.5" />
            {/* Base Pedestal */}
            <path
              d="M12 36 L36 36 L34 42 L14 42 Z"
              fill={fillSecondary}
              stroke={strokeColor}
              strokeWidth="1.5"
            />
            <rect x="10" y="42" width="28" height="3" rx="1.5" fill={fillPrimary} />
          </svg>
        );

      // 2. First Lady (สุภาพสตรีหมายเลขหนึ่ง - Diplomatic Star & Crown)
      case 'first_lady':
        return (
          <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md">
            {/* Multi-point Tiara Crown */}
            <path
              d="M10 34 L8 18 L16 25 L24 10 L32 25 L40 18 L38 34 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Jewels on Crown Tips */}
            <circle cx="8" cy="18" r="2.5" fill={fillSecondary} />
            <circle cx="24" cy="10" r="3.2" fill={fillSecondary} />
            <circle cx="40" cy="18" r="2.5" fill={fillSecondary} />
            {/* Diplomatic Sash / Central Gem */}
            <path d="M24 20 L27 26 L24 32 L21 26 Z" fill={fillSecondary} />
            {/* Base Band */}
            <rect x="10" y="34" width="28" height="5" rx="1.5" fill={fillSecondary} stroke={strokeColor} strokeWidth="1.5" />
            <rect x="8" y="39" width="32" height="3.5" rx="1.5" fill={fillPrimary} />
          </svg>
        );

      // 3. Bodyguard (บอดี้การ์ด - Tactical VIP Protection Shield & Crosshair)
      case 'bodyguard':
        return (
          <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md">
            {/* Defense Shield Shape */}
            <path
              d="M24 6 C34 9 38 12 38 22 C38 34 29 41 24 44 C19 41 10 34 10 22 C10 12 14 9 24 6 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Inner Shield Layer */}
            <path
              d="M24 11 C31 13 34 15 34 23 C34 32 27 37 24 40 C21 37 14 32 14 23 C14 15 17 13 24 11 Z"
              fill={fillSecondary}
              opacity="0.8"
            />
            {/* Tactical Crosshair Emblem */}
            <circle cx="24" cy="24" r="7" fill="none" stroke={fillPrimary} strokeWidth="2" />
            <line x1="24" y1="13" x2="24" y2="19" stroke={fillPrimary} strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="29" x2="24" y2="35" stroke={fillPrimary} strokeWidth="2" strokeLinecap="round" />
            <line x1="13" y1="24" x2="19" y2="24" stroke={fillPrimary} strokeWidth="2" strokeLinecap="round" />
            <line x1="29" y1="24" x2="35" y2="24" stroke={fillPrimary} strokeWidth="2" strokeLinecap="round" />
            <circle cx="24" cy="24" r="2" fill={fillPrimary} />
          </svg>
        );

      // 4. Jet (เครื่องบินขับไล่ - Supersonic Stealth Fighter)
      case 'jet':
        return (
          <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md">
            {/* Main Fuselage & Delta Wings */}
            <path
              d="M24 4 L28 18 L44 32 L34 35 L28 32 L28 42 L24 44 L20 42 L20 32 L14 35 L4 32 L20 18 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Cockpit Canopy */}
            <path
              d="M22 14 Q24 11 26 14 L26 23 Q24 25 22 23 Z"
              fill={fillSecondary}
              stroke={strokeColor}
              strokeWidth="1"
            />
            {/* Twin Afterburner Engines */}
            <rect x="21" y="42" width="2.5" height="3" fill="#F59E0B" />
            <rect x="24.5" y="42" width="2.5" height="3" fill="#F59E0B" />
          </svg>
        );

      // 5. Tank (รถถังประจัญบาน - Heavy Armored MBT)
      case 'tank':
        return (
          <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md">
            {/* Main Cannon Barrel */}
            <line x1="24" y1="6" x2="24" y2="22" stroke={fillPrimary} strokeWidth="4.5" strokeLinecap="round" />
            <rect x="21.5" y="6" width="5" height="3.5" rx="1" fill={fillSecondary} stroke={strokeColor} strokeWidth="1" />
            {/* Turret */}
            <path
              d="M17 22 L31 22 L34 30 L14 30 Z"
              fill={fillSecondary}
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="26" r="3" fill={fillPrimary} />
            {/* Hull Body */}
            <rect x="10" y="30" width="28" height="6" rx="2" fill={fillPrimary} stroke={strokeColor} strokeWidth="1.5" />
            {/* Continuous Treads / Tracks */}
            <rect x="6" y="36" width="36" height="8" rx="4" fill={strokeColor} stroke={strokeColor} strokeWidth="1" />
            {/* Road Wheels */}
            <circle cx="11" cy="40" r="2.5" fill={fillPrimary} />
            <circle cx="17.5" cy="40" r="2.5" fill={fillPrimary} />
            <circle cx="24" cy="40" r="2.5" fill={fillPrimary} />
            <circle cx="30.5" cy="40" r="2.5" fill={fillPrimary} />
            <circle cx="37" cy="40" r="2.5" fill={fillPrimary} />
          </svg>
        );

      // 6. Citizen (พลเมือง - Tactical Combat Helmet / Militia)
      case 'citizen':
        return (
          <svg viewBox="0 0 48 48" className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 drop-shadow-md">
            {/* Combat Helmet Dome */}
            <path
              d="M13 25 C13 14 35 14 35 25 L38 27 L38 29 L10 29 L10 27 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Helmet Rim and Chin Strap Mount */}
            <path d="M10 28 L38 28 L37 32 L11 32 Z" fill={fillSecondary} />
            {/* Soldier Face / Visor Profile */}
            <path d="M15 32 L33 32 L31 38 L17 38 Z" fill={strokeColor} />
            <rect x="17" y="34" width="14" height="2.5" rx="1" fill={fillAccent} />
            {/* Torso Base */}
            <path
              d="M12 44 C12 39 36 39 36 44 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="1.5"
            />
          </svg>
        );

      // 7. Promoted: Brave Soldier (ทหารผู้กล้า - Elite Commando Dual Swords)
      case 'brave_soldier':
        return (
          <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md">
            {/* Left Crossed Blade */}
            <path d="M10 10 L38 38 M10 10 L16 10 L38 32 M38 38 L35 41 L32 38" stroke={fillPrimary} strokeWidth="3" strokeLinecap="round" />
            {/* Right Crossed Blade */}
            <path d="M38 10 L10 38 M38 10 L32 10 L10 32 M10 38 L13 41 L16 38" stroke={fillPrimary} strokeWidth="3" strokeLinecap="round" />
            {/* Center Golden Shield Star */}
            <circle cx="24" cy="24" r="8" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />
            <path d="M24 18 L26 22 L30 24 L26 26 L24 30 L22 26 L18 24 L22 22 Z" fill="#FDE047" />
          </svg>
        );

      // 8. Promoted: Trainee Pilot (นักบินฝึกหัด - Golden Aviator Wings)
      case 'trainee_pilot':
        return (
          <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md">
            {/* Left Wing */}
            <path
              d="M24 24 C16 16 4 18 4 28 C12 28 18 27 24 24 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="1.5"
            />
            {/* Right Wing */}
            <path
              d="M24 24 C32 16 44 18 44 28 C36 28 30 27 24 24 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="1.5"
            />
            {/* Aviator Center Medallion / Propeller */}
            <circle cx="24" cy="24" r="6" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />
            <line x1="24" y1="14" x2="24" y2="34" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="24" cy="24" r="2.5" fill="#FDE047" />
          </svg>
        );

      // 9. Promoted: Police (ตำรวจ - Enforcement Star & Restraint Ring)
      case 'police':
        return (
          <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md">
            {/* Police 7-Point Star Badge */}
            <path
              d="M24 7 L27 15 L35 13 L34 21 L41 24 L34 27 L35 35 L27 33 L24 41 L21 33 L13 35 L14 27 L7 24 L14 21 L13 13 L21 15 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Central Restraint Circle */}
            <circle cx="24" cy="24" r="7.5" fill={fillSecondary} stroke={strokeColor} strokeWidth="1.5" />
            {/* Handcuffs / Stun Ring glyph */}
            <circle cx="21" cy="24" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="27" cy="24" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        );

      // 10. Promoted: Armored Car (รถหุ้มเกราะ - 4x4 APC Scout)
      case 'armored_car':
        return (
          <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md">
            {/* Top Scout Turret */}
            <rect x="20" y="10" width="8" height="6" rx="1.5" fill={fillSecondary} stroke={strokeColor} strokeWidth="1" />
            <line x1="28" y1="13" x2="35" y2="11" stroke={fillPrimary} strokeWidth="2.5" strokeLinecap="round" />
            {/* Armored Hull (Angular Slope) */}
            <path
              d="M10 24 L16 16 L32 16 L38 24 L38 34 L10 34 Z"
              fill={fillPrimary}
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Armored Windows */}
            <polygon points="18,19 23,19 23,23 17,23" fill={fillSecondary} />
            <polygon points="25,19 30,19 31,23 25,23" fill={fillSecondary} />
            {/* Heavy All-Terrain Wheels */}
            <circle cx="15" cy="36" r="4.5" fill={strokeColor} stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="15" cy="36" r="2" fill={fillPrimary} />
            <circle cx="33" cy="36" r="4.5" fill={strokeColor} stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="33" cy="36" r="2" fill={fillPrimary} />
          </svg>
        );
    }
  };

  const isPresidentThreatened = piece.type === 'president' && isChecked;

  return (
    <div
      className={`relative flex items-center justify-center transition-transform duration-150 ${
        isPresidentThreatened ? 'animate-president-shake scale-110' : 'hover:scale-110'
      }`}
      style={{
        filter: isPresidentThreatened
          ? 'drop-shadow(0 0 14px rgba(239, 68, 68, 0.95))'
          : `drop-shadow(0 0 6px ${shadowGlow})`,
      }}
    >
      {renderSVG()}

      {/* Invincible President Badge */}
      {isInvinciblePresident && (
        <span
          className="absolute -top-1 -right-1 text-[9px] bg-amber-500 text-slate-950 font-bold px-1 py-0.2 rounded-full flex items-center gap-0.5 shadow-md border border-amber-300"
          title="เกราะคุ้มกันอมตะ (ห้ามกิน/ไม่ต้องหนีรุก)"
        >
          <Shield className="w-2.5 h-2.5 fill-current" />
        </span>
      )}

      {/* Jet Cooldown Badge */}
      {piece.type === 'jet' && (
        piece.cooldown > 0 ? (
          <span
            className="absolute -bottom-1 -right-1 text-[9px] bg-rose-600 text-white font-mono font-bold px-1 py-0.2 rounded shadow-sm border border-rose-400"
            title={`คูลดาวน์: รออีก ${piece.cooldown} เทิร์นบนกระดาน (นับรวมที่ศัตรูเดิน)`}
          >
            {piece.cooldown}T
          </span>
        ) : (
          <span
            className="absolute -bottom-1 -right-1 text-[8px] bg-emerald-600 text-emerald-100 font-mono font-bold px-0.8 py-0.2 rounded shadow-sm"
            title="พร้อมบิน"
          >
            ✓
          </span>
        )
      )}

      {/* Police Stun Lock overlay */}
      {piece.lockedTurns > 0 && (
        <div
          className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px] rounded-lg flex items-center justify-center border-2 border-amber-400 animate-pulse z-20"
          title="ถูกตำรวจล็อก! ไม่สามารถเดินได้ 1 ตา"
        >
          <Lock className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
        </div>
      )}

      {/* Lock Immunity Badge */}
      {piece.lockImmunityTurns !== undefined && piece.lockImmunityTurns > 0 && (
        <span
          className="absolute -top-1 -right-1 text-[8px] bg-cyan-950 text-cyan-300 font-mono font-bold px-1 rounded shadow-sm border border-cyan-500/70 z-10 flex items-center gap-0.5"
          title="มีภูมิคุ้มกัน: ไม่สามารถถูกตำรวจล็อกซ้ำในตานี้ได้"
        >
          <span>🛡️</span>
          <span className="hidden sm:inline">IMMUNE</span>
        </span>
      )}
    </div>
  );
};
