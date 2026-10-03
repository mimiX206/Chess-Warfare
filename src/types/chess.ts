export type Faction = 'white' | 'black';

export type PieceType =
  // Standard Warfare Units
  | 'president'     // ประธานาธิบดี (แทน King) - 1 ช่องรอบตัว
  | 'first_lady'    // สุภาพสตรีหมายเลขหนึ่ง (แทน Queen) - เดินอิสระแนวตั้ง/นอน/ทแยง
  | 'bodyguard'     // บอดี้การ์ด (แทน Bishop) - แนวทแยง
  | 'jet'           // เครื่องบิน (แทน Knight) - L-Shape มีคูลดาวน์ เดิน 1 เว้น 2 ตาของตนเอง
  | 'tank'          // รถถัง (แทน Rook) - แนวตั้ง/แนวนอน
  | 'citizen'       // พลเมือง (แทน Pawn) - เดินหน้า 1 (หรือ 2 ในตาแรก), กินทแยง
  // Promoted Special Units (4 ชนิดเท่านั้น)
  | 'brave_soldier' // ทหารผู้กล้า - เดินเหมือน Queen แต่ระยะไม่เกิน 5 ช่อง
  | 'trainee_pilot' // นักบินฝึกหัด - เดิน/กินเหมือน Knight ไม่มีคูลดาวน์
  | 'police'        // ตำรวจ - เดินเหมือน Bodyguard ไม่กินหมาก แต่ล็อกเป้าหมาย 1 ตา
  | 'armored_car';  // รถหุ้มเกราะ - เดินเหมือน Tank แต่ระยะไม่เกิน 4 ช่อง

export interface Piece {
  id: string;
  type: PieceType;
  faction: Faction;
  hasMoved?: boolean;
  cooldown: number;     // สำหรับ Jet: รออีกกี่เทิร์นบนกระดาน นับรวมที่ศัตรูเดิน (0 = พร้อม)
  lockedTurns: number;  // สำหรับหมากที่โดนตำรวจล็อก: 1 = ขยับไม่ได้ในตานี้
  lockImmunityTurns?: number; // มีภูมิคุ้มกัน: ไม่สามารถถูกตำรวจล็อกซ้ำในตาถัดไปได้
}

export interface Position {
  row: number; // 0 to 7 (0 is rank 8, 7 is rank 1)
  col: number; // 0 to 7 (0 is 'a', 7 is 'h')
}

export type MoveType = 'normal' | 'capture' | 'lock' | 'promotion' | 'double_pawn';

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  type: MoveType;
  promotionTo?: PieceType;
  notation: string;
  description: string;
}

export interface MoveTarget {
  pos: Position;
  type: 'move' | 'capture' | 'lock';
  targetPiece?: Piece;
}

export interface VIPStatus {
  firstLadyAlive: boolean;
  bodyguardsRemaining: number;
  isPresidentInvincible: boolean;
  presidentPos: Position | null;
}

export interface JetStatus {
  id: string;
  pos: Position;
  cooldown: number;
  isReady: boolean;
  owner: Faction;
}

export interface GameStatus {
  turn: Faction;
  turnNumber: number;
  whiteVIP: VIPStatus;
  blackVIP: VIPStatus;
  whiteJets: JetStatus[];
  blackJets: JetStatus[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isInsufficientMaterial: boolean;
  winner: Faction | 'draw' | null;
  endReason?: 'checkmate' | 'stalemate' | 'insufficient_material';
  endTitle?: string;
  endDescription?: string;
}
