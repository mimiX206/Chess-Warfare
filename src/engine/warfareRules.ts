import {
  Faction,
  Piece,
  PieceType,
  Position,
  Move,
  MoveType,
  MoveTarget,
  VIPStatus,
  JetStatus,
  GameStatus,
} from '../types/chess';
import { PIECE_TRANSLATIONS } from '../i18n/translations';
import { Language } from '../i18n/types';

export type Board = (Piece | null)[][];

export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

/**
 * Coordinate helpers:
 * col 0..7 -> 'a'..'h'
 * row 0..7 -> '8'..'1'
 */
export function posToCoord(pos: Position): string {
  const file = String.fromCharCode('a'.charCodeAt(0) + pos.col);
  const rank = (8 - pos.row).toString();
  return `${file}${rank}`;
}

export function coordToPos(coord: string): Position | null {
  if (!coord || coord.length < 2) return null;
  const file = coord.charAt(0).toLowerCase();
  const rank = coord.charAt(1);
  const col = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = 8 - parseInt(rank, 10);
  if (col < 0 || col > 7 || row < 0 || row > 7 || isNaN(row)) return null;
  return { row, col };
}

export function isSamePos(p1: Position | null, p2: Position | null): boolean {
  if (!p1 || !p2) return false;
  return p1.row === p2.row && p1.col === p2.col;
}

export function getPieceName(
  type: PieceType,
  lang: Language = 'th'
): { name: string; title: string; symbol: string } {
  const trans = PIECE_TRANSLATIONS[lang]?.[type] || PIECE_TRANSLATIONS['th'][type];
  return {
    name: trans.name,
    title: trans.title,
    symbol: trans.symbol,
  };
}

export function getPieceNameTH(type: PieceType): { name: string; title: string; symbol: string } {
  return getPieceName(type, 'th');
}

/**
 * Initialize 8x8 Warfare Chessboard
 */
export function createEmptyBoard(): Board {
  return Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
}

export function createCustomPiece(type: PieceType, faction: Faction): Piece {
  return {
    id: `${faction[0]}_${type}_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    type,
    faction,
    hasMoved: false,
    cooldown: 0,
    lockedTurns: 0,
    lockImmunityTurns: 0,
  };
}

export function createInitialBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  let idCounter = 1;

  // Black pieces (Row 0: rank 8, Row 1: rank 7)
  const blackBackRow: PieceType[] = [
    'tank',
    'jet',
    'bodyguard',
    'first_lady',
    'president',
    'bodyguard',
    'jet',
    'tank',
  ];

  blackBackRow.forEach((type, col) => {
    board[0][col] = {
      id: `b_${type}_${col}_${idCounter++}`,
      type,
      faction: 'black',
      hasMoved: false,
      cooldown: 0,
      lockedTurns: 0,
      lockImmunityTurns: 0,
    };
  });

  for (let col = 0; col < 8; col++) {
    board[1][col] = {
      id: `b_citizen_${col}_${idCounter++}`,
      type: 'citizen',
      faction: 'black',
      hasMoved: false,
      cooldown: 0,
      lockedTurns: 0,
      lockImmunityTurns: 0,
    };
  }

  // White pieces (Row 7: rank 1, Row 6: rank 2)
  const whiteBackRow: PieceType[] = [
    'tank',
    'jet',
    'bodyguard',
    'first_lady',
    'president',
    'bodyguard',
    'jet',
    'tank',
  ];

  whiteBackRow.forEach((type, col) => {
    board[7][col] = {
      id: `w_${type}_${col}_${idCounter++}`,
      type,
      faction: 'white',
      hasMoved: false,
      cooldown: 0,
      lockedTurns: 0,
      lockImmunityTurns: 0,
    };
  });

  for (let col = 0; col < 8; col++) {
    board[6][col] = {
      id: `w_citizen_${col}_${idCounter++}`,
      type: 'citizen',
      faction: 'white',
      hasMoved: false,
      cooldown: 0,
      lockedTurns: 0,
      lockImmunityTurns: 0,
    };
  }

  return board;
}

/**
 * Calculate VIP Protection status for a faction
 * Rules:
 * President is INVINCIBLE as long as ANY Bodyguard OR First Lady of that faction is alive on board!
 * When ALL Bodyguards AND First Lady are eliminated, President becomes VULNERABLE!
 */
export function getVIPStatus(board: Board, faction: Faction): VIPStatus {
  let bodyguards = 0;
  let firstLadyAlive = false;
  let presidentPos: Position | null = null;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.faction === faction) {
        if (piece.type === 'bodyguard') {
          bodyguards++;
        } else if (piece.type === 'first_lady') {
          firstLadyAlive = true;
        } else if (piece.type === 'president') {
          presidentPos = { row: r, col: c };
        }
      }
    }
  }

  const isPresidentInvincible = bodyguards > 0 || firstLadyAlive;

  return {
    firstLadyAlive,
    bodyguardsRemaining: bodyguards,
    isPresidentInvincible,
    presidentPos,
  };
}

/**
 * Get Jet Cooldown statuses for a faction
 */
export function getJetsStatus(board: Board, faction: Faction): JetStatus[] {
  const jets: JetStatus[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.faction === faction && piece.type === 'jet') {
        jets.push({
          id: piece.id,
          pos: { row: r, col: c },
          cooldown: piece.cooldown,
          isReady: piece.cooldown === 0,
          owner: faction,
        });
      }
    }
  }
  return jets;
}

/**
 * Check if position is inside 8x8 board
 */
export function isInBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

/**
 * Compute raw attack / move targets for a piece without considering king check
 */
export function getRawPieceTargets(
  board: Board,
  pos: Position,
  enemyVIP: VIPStatus
): MoveTarget[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  // If piece is locked by police, it cannot move or act!
  if (piece.lockedTurns > 0) {
    return [];
  }

  // If Jet is in cooldown, it cannot move!
  if (piece.type === 'jet' && piece.cooldown > 0) {
    return [];
  }

  const targets: MoveTarget[] = [];
  const { row, col } = pos;
  const isWhite = piece.faction === 'white';

  const addTargetIfValid = (r: number, c: number): boolean => {
    if (!isInBounds(r, c)) return false;
    const destPiece = board[r][c];
    if (!destPiece) {
      targets.push({ pos: { row: r, col: c }, type: 'move' });
      return true; // continue ray
    }
    if (destPiece.faction !== piece.faction) {
      // Enemy piece! Can we capture?
      // Rule: Opponent CANNOT capture the President if President is Invincible!
      if (destPiece.type === 'president' && enemyVIP.isPresidentInvincible) {
        // Cannot capture invincible President!
        return false; // ray is blocked, but cannot capture
      }
      targets.push({ pos: { row: r, col: c }, type: 'capture', targetPiece: destPiece });
      return false; // blocked by enemy piece
    }
    // Blocked by friendly piece
    return false;
  };

  const addRayTargets = (directions: [number, number][], maxSteps: number = 8) => {
    for (const [dr, dc] of directions) {
      for (let step = 1; step <= maxSteps; step++) {
        const nr = row + dr * step;
        const nc = col + dc * step;
        const keepGoing = addTargetIfValid(nr, nc);
        if (!keepGoing) break;
      }
    }
  };

  switch (piece.type) {
    case 'president': {
      // Moves 1 square in all 8 directions
      const dirs: [number, number][] = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ];
      dirs.forEach(([dr, dc]) => addTargetIfValid(row + dr, col + dc));
      break;
    }

    case 'first_lady': {
      // Queen movement: all 8 directions
      const dirs: [number, number][] = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ];
      addRayTargets(dirs, 8);
      break;
    }

    case 'bodyguard': {
      // Bishop movement: 4 diagonals
      const dirs: [number, number][] = [
        [-1, -1], [-1, 1],
        [1, -1],  [1, 1],
      ];
      addRayTargets(dirs, 8);
      break;
    }

    case 'tank': {
      // Rook movement: 4 orthogonals
      const dirs: [number, number][] = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
      ];
      addRayTargets(dirs, 8);
      break;
    }

    case 'jet': {
      // Knight L-Shape movement (jumps) with cooldown check
      const jumps: [number, number][] = [
        [-2, -1], [-2, 1],
        [-1, -2], [-1, 2],
        [1, -2],  [1, 2],
        [2, -1],  [2, 1],
      ];
      jumps.forEach(([dr, dc]) => addTargetIfValid(row + dr, col + dc));
      break;
    }

    case 'citizen': {
      // Pawn movement
      const forward = isWhite ? -1 : 1;
      const startRow = isWhite ? 6 : 1;

      // 1 square forward
      const f1Row = row + forward;
      if (isInBounds(f1Row, col) && !board[f1Row][col]) {
        targets.push({ pos: { row: f1Row, col }, type: 'move' });

        // 2 squares forward from starting rank
        const f2Row = row + forward * 2;
        if (row === startRow && isInBounds(f2Row, col) && !board[f2Row][col]) {
          targets.push({ pos: { row: f2Row, col }, type: 'move' });
        }
      }

      // Diagonal captures
      const diagCols = [col - 1, col + 1];
      for (const dc of diagCols) {
        if (isInBounds(f1Row, dc)) {
          const destPiece = board[f1Row][dc];
          if (destPiece && destPiece.faction !== piece.faction) {
            if (!(destPiece.type === 'president' && enemyVIP.isPresidentInvincible)) {
              targets.push({
                pos: { row: f1Row, col: dc },
                type: 'capture',
                targetPiece: destPiece,
              });
            }
          }
        }
      }
      break;
    }

    // Promoted units
    case 'brave_soldier': {
      // Queen moves limited to max 5 squares
      const dirs: [number, number][] = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ];
      addRayTargets(dirs, 5);
      break;
    }

    case 'trainee_pilot': {
      // Knight movement, NO cooldown
      const jumps: [number, number][] = [
        [-2, -1], [-2, 1],
        [-1, -2], [-1, 2],
        [1, -2],  [1, 2],
        [2, -1],  [2, 1],
      ];
      jumps.forEach(([dr, dc]) => addTargetIfValid(row + dr, col + dc));
      break;
    }

    case 'police': {
      // Bishop movement (diagonal), but CANNOT capture!
      // Instead, can move to empty diagonal squares OR target an enemy piece to LOCK them for 1 turn!
      const dirs: [number, number][] = [
        [-1, -1], [-1, 1],
        [1, -1],  [1, 1],
      ];
      for (const [dr, dc] of dirs) {
        for (let step = 1; step <= 8; step++) {
          const nr = row + dr * step;
          const nc = col + dc * step;
          if (!isInBounds(nr, nc)) break;
          const destPiece = board[nr][nc];
          if (!destPiece) {
            // Empty square: can move freely
            targets.push({ pos: { row: nr, col: nc }, type: 'move' });
          } else {
            if (destPiece.faction !== piece.faction) {
              // Enemy piece: Police CANNOT capture, but can LOCK them!
              // Rule: "และหมากนั้นจะไม่ถูกล็อกซ้ำในตาถัดไปได้"
              const isLockedOrImmune =
                destPiece.lockedTurns > 0 ||
                (destPiece.lockImmunityTurns !== undefined && destPiece.lockImmunityTurns > 0);

              if (!isLockedOrImmune) {
                targets.push({
                  pos: { row: nr, col: nc },
                  type: 'lock',
                  targetPiece: destPiece,
                });
              }
            }
            break; // Ray blocked
          }
        }
      }
      break;
    }

    case 'armored_car': {
      // Rook moves limited to max 4 squares
      const dirs: [number, number][] = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
      ];
      addRayTargets(dirs, 4);
      break;
    }
  }

  return targets;
}

/**
 * Check if a square is attacked by opponent
 */
export function isSquareAttackedBy(
  board: Board,
  square: Position,
  byFaction: Faction
): boolean {
  // Dummy VIP status: check theoretical threats
  const targetVIP: VIPStatus = {
    firstLadyAlive: false,
    bodyguardsRemaining: 0,
    isPresidentInvincible: false,
    presidentPos: square,
  };

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.faction === byFaction && piece.lockedTurns === 0) {
        // Police cannot capture or check
        if (piece.type === 'police') continue;
        // Jet in cooldown cannot attack
        if (piece.type === 'jet' && piece.cooldown > 0) continue;

        const targets = getRawPieceTargets(board, { row: r, col: c }, targetVIP);
        if (targets.some((t) => t.pos.row === square.row && t.pos.col === square.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Determine if current player's President is in check.
 * Crucial rule: If President is INVINCIBLE, they CANNOT be checked or forced to flee!
 */
export function isPresidentInCheck(board: Board, faction: Faction): boolean {
  const vip = getVIPStatus(board, faction);
  // Rule: President is NOT forced to escape check and cannot be captured when invincible!
  if (vip.isPresidentInvincible || !vip.presidentPos) {
    return false;
  }

  const enemyFaction: Faction = faction === 'white' ? 'black' : 'white';
  return isSquareAttackedBy(board, vip.presidentPos, enemyFaction);
}

/**
 * Check if a move leaves the friendly President in check or violates safety rules.
 * Rule Update:
 * "president แม้จะอยู่ในสถานะอมตะ ก็จะไม่สามารถเดินเข้าไปในช่องที่อำนาจการโจมตีของหมากอีกฝ่ายได้อยู่ดี"
 * Even if President is INVINCIBLE, the President CANNOT move into a square that is under attack by the opponent!
 */
export function doesMoveLeavePresidentInCheck(
  board: Board,
  from: Position,
  target: MoveTarget,
  faction: Faction
): boolean {
  const piece = board[from.row][from.col];
  if (!piece) return true;

  const enemyFaction: Faction = faction === 'white' ? 'black' : 'white';

  // Specific rule: President (even when in invincible status) CANNOT move into a square attacked by enemy!
  if (piece.type === 'president') {
    const clonedBoard = cloneBoard(board);
    clonedBoard[target.pos.row][target.pos.col] = piece;
    clonedBoard[from.row][from.col] = null;
    return isSquareAttackedBy(clonedBoard, target.pos, enemyFaction);
  }

  const vip = getVIPStatus(board, faction);
  // If President is invincible, other friendly pieces are not restricted by check!
  if (vip.isPresidentInvincible) {
    return false;
  }

  // If President is vulnerable, simulate move on cloned board
  const clonedBoard = cloneBoard(board);
  if (target.type === 'lock') {
    // Police dashes adjacent to target along the approach diagonal
    const dr = Math.sign(target.pos.row - from.row);
    const dc = Math.sign(target.pos.col - from.col);
    const adjRow = target.pos.row - dr;
    const adjCol = target.pos.col - dc;
    clonedBoard[from.row][from.col] = null;
    clonedBoard[adjRow][adjCol] = piece;
    return isPresidentInCheck(clonedBoard, faction);
  }

  clonedBoard[target.pos.row][target.pos.col] = piece;
  clonedBoard[from.row][from.col] = null;

  return isPresidentInCheck(clonedBoard, faction);
}

/**
 * Get all legal moves for a selected piece
 */
export function getLegalMovesForPiece(
  board: Board,
  pos: Position,
  turn: Faction
): MoveTarget[] {
  const piece = board[pos.row][pos.col];
  if (!piece || piece.faction !== turn) return [];

  // Locked pieces cannot move
  if (piece.lockedTurns > 0) return [];

  // Jet with cooldown cannot move
  if (piece.type === 'jet' && piece.cooldown > 0) return [];

  const enemyFaction: Faction = turn === 'white' ? 'black' : 'white';
  const enemyVIP = getVIPStatus(board, enemyFaction);
  const rawTargets = getRawPieceTargets(board, pos, enemyVIP);

  // Filter out moves that leave vulnerable President in check
  return rawTargets.filter((target) => {
    return !doesMoveLeavePresidentInCheck(board, pos, target, turn);
  });
}

/**
 * Clone board
 */
export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((piece) => (piece ? { ...piece } : null))
  );
}

/**
 * Check if pawn reaches promotion rank
 */
export function isPawnPromotion(piece: Piece, to: Position): boolean {
  if (piece.type !== 'citizen') return false;
  return (piece.faction === 'white' && to.row === 0) || (piece.faction === 'black' && to.row === 7);
}

/**
 * Apply move to board
 */
export function applyMove(
  board: Board,
  from: Position,
  to: Position,
  promotionType?: PieceType,
  lang: Language = 'th'
): { newBoard: Board; moveDetails: Move; requiresPromotion: boolean } {
  const newBoard = cloneBoard(board);
  const piece = { ...newBoard[from.row][from.col]! };
  const destPiece = newBoard[to.row][to.col] ? { ...newBoard[to.row][to.col]! } : undefined;

  let moveType: MoveType = destPiece ? 'capture' : 'normal';

  // Check if this is a Police Lock action
  const isPoliceLock = piece.type === 'police' && destPiece && destPiece.faction !== piece.faction;

  if (isPoliceLock) {
    // Police Lock:
    // 1. Target piece is locked for 1 turn!
    destPiece.lockedTurns = 1;
    newBoard[to.row][to.col] = destPiece; // Target piece stays on board, now locked

    // 2. Police immediately rushes adjacent to target along the approach diagonal:
    const dr = Math.sign(to.row - from.row);
    const dc = Math.sign(to.col - from.col);
    const adjacentPos: Position = {
      row: to.row - dr,
      col: to.col - dc,
    };

    // Remove police from original square
    newBoard[from.row][from.col] = null;
    // Place police at adjacent square
    piece.hasMoved = true;
    newBoard[adjacentPos.row][adjacentPos.col] = piece;

    const isAlreadyAdjacent = from.row === adjacentPos.row && from.col === adjacentPos.col;
    const notation = isAlreadyAdjacent
      ? `Pol 🔒 ${posToCoord(to)}`
      : `Pol ${posToCoord(adjacentPos)} 🔒 ${posToCoord(to)}`;

    const targetName = getPieceName(destPiece.type, lang).name;
    let description = '';
    if (lang === 'en') {
      description = isAlreadyAdjacent
        ? `Special Police locked ${targetName} at ${posToCoord(to)} for 1 turn`
        : `Special Police dashed to ${posToCoord(adjacentPos)} and locked ${targetName} at ${posToCoord(to)} for 1 turn`;
    } else if (lang === 'ja') {
      description = isAlreadyAdjacent
        ? `警察が ${posToCoord(to)} の ${targetName} を1ターン拘束`
        : `警察が ${posToCoord(adjacentPos)} に急行接近し、${posToCoord(to)} の ${targetName} を1ターン拘束`;
    } else if (lang === 'zh') {
      description = isAlreadyAdjacent
        ? `特警贴身锁定 ${posToCoord(to)} 处的 ${targetName} 1回合`
        : `特警突进至 ${posToCoord(adjacentPos)} 并锁定 ${posToCoord(to)} 处的 ${targetName} 1回合`;
    } else {
      description = isAlreadyAdjacent
        ? `ตำรวจประชิดล็อก ${targetName} ที่ ${posToCoord(to)} ให้หยุดนิ่ง 1 ตา`
        : `ตำรวจพุ่งประชิดที่ ${posToCoord(adjacentPos)} และล็อก ${targetName} ที่ ${posToCoord(to)} ให้หยุดนิ่ง 1 ตา`;
    }

    const moveDetails: Move = {
      from,
      to: adjacentPos,
      piece,
      captured: destPiece,
      type: 'lock',
      notation,
      description,
    };

    return { newBoard, moveDetails, requiresPromotion: false };
  }

  // Check promotion
  const needsPromotion = isPawnPromotion(piece, to);
  if (needsPromotion && !promotionType) {
    let promoDesc = '';
    if (lang === 'en') {
      promoDesc = 'Citizen reached enemy baseline, awaiting promotion';
    } else if (lang === 'ja') {
      promoDesc = '市民が敵陣最奥に突入、昇格を選択中';
    } else if (lang === 'zh') {
      promoDesc = '平民抵达敌阵底线，等待兵种晋升';
    } else {
      promoDesc = 'พลเมืองเข้าถึงฐานฝั่งตรงข้าม รอดำเนินการโปรโมท';
    }

    return {
      newBoard,
      moveDetails: {
        from,
        to,
        piece,
        captured: destPiece,
        type: 'promotion',
        notation: `${posToCoord(from)}-${posToCoord(to)}`,
        description: promoDesc,
      },
      requiresPromotion: true,
    };
  }

  if (needsPromotion && promotionType) {
    piece.type = promotionType;
    moveType = 'promotion';
    piece.cooldown = 0; // Trainee pilot or other promoted unit
  }

  // Jet cooldown rule
  if (piece.type === 'jet') {
    piece.cooldown = 2; // Set cooldown to 2 turns
  }

  piece.hasMoved = true;
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  const notation = `${posToCoord(from)}${destPiece ? 'x' : '-'}${posToCoord(to)}${
    promotionType ? `=${promotionType.toUpperCase()}` : ''
  }`;

  const pieceName = getPieceName(piece.type, lang).name;
  const capturedName = destPiece ? getPieceName(destPiece.type, lang).name : '';
  const promoName = promotionType ? getPieceName(promotionType, lang).name : '';

  let description = '';
  if (lang === 'en') {
    description = `${pieceName} from ${posToCoord(from)} to ${posToCoord(to)}${
      destPiece ? ` (Captured ${capturedName})` : ''
    }${promotionType ? ` [Promoted to ${promoName}]` : ''}`;
  } else if (lang === 'ja') {
    description = `${pieceName} が ${posToCoord(from)} から ${posToCoord(to)} へ移動${
      destPiece ? `（${capturedName} を撃破）` : ''
    }${promotionType ? ` [${promoName} に昇格]` : ''}`;
  } else if (lang === 'zh') {
    description = `${pieceName} 从 ${posToCoord(from)} 移动至 ${posToCoord(to)}${
      destPiece ? `（击杀 ${capturedName}）` : ''
    }${promotionType ? ` [晋升为 ${promoName}]` : ''}`;
  } else {
    description = `${pieceName} จาก ${posToCoord(from)} ไป ${posToCoord(to)}${
      destPiece ? ` (กำจัด ${capturedName})` : ''
    }${promotionType ? ` [โปรโมทเป็น ${promoName}]` : ''}`;
  }

  const moveDetails: Move = {
    from,
    to,
    piece,
    captured: destPiece,
    type: moveType,
    promotionTo: promotionType,
    notation,
    description,
  };

  return { newBoard, moveDetails, requiresPromotion: false };
}

/**
 * End turn maintenance:
 * 1. Decrement cooldown for all Jets on the board that did NOT move this turn
 *    Rule: "แก้ไขระบบคูลดาวน์ของเครื่องบินเป็น 2 เทิร์นที่เกิดขึ้นบนกระดาน นับรวมที่ศัตรูเดิน"
 * 2. When the enemy's turn begins, their locked pieces' lockedTurns should decrement at the end of their turn!
 */
export function endTurnMaintenance(
  board: Board,
  endingTurnFaction: Faction,
  movedPieceId: string
): Board {
  const updated = cloneBoard(board);

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = updated[r][c];
      if (piece) {
        // Any Jet that did NOT move in this board turn ticks down its cooldown by 1 (counting enemy turns too)
        if (piece.type === 'jet') {
          if (piece.id !== movedPieceId && piece.cooldown > 0) {
            piece.cooldown -= 1;
          }
        }

        // Decrement locked turns for pieces belonging to the faction whose turn is ending.
        // When lockedTurns expires to 0, grant lockImmunityTurns = 1 so it cannot be locked again next turn!
        // Rule: "และหมากนั้นจะไม่ถูกล็อกซ้ำในตาถัดไปได้"
        if (piece.faction === endingTurnFaction) {
          if (piece.lockedTurns > 0) {
            piece.lockedTurns -= 1;
            piece.lockImmunityTurns = 1;
          }
        } else {
          // If this piece belongs to the OTHER faction, its lock immunity protected it during this turn.
          // Now that this turn is ending, its immunity expires!
          if (piece.lockImmunityTurns !== undefined && piece.lockImmunityTurns > 0) {
            piece.lockImmunityTurns -= 1;
          }
        }
      }
    }
  }

  return updated;
}

/**
 * Check if the remaining pieces on the board are insufficient to force a checkmate.
 * Rule: "หลังจากที่ตัวเกมถูกตัดสินว่า มีหมากไม่เหลือพอที่จะรุกฆาตได้ เกมจะจบลงด้วยคำว่า กองกำลังไม่พอ"
 */
export function isInsufficientMaterial(board: Board): boolean {
  const whitePieces: Piece[] = [];
  const blackPieces: Piece[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        if (p.faction === 'white') whitePieces.push(p);
        else blackPieces.push(p);
      }
    }
  }

  // Any citizen (pawn) can promote into a major piece
  const hasPawns = [...whitePieces, ...blackPieces].some((p) => p.type === 'citizen');
  if (hasPawns) return false;

  // Major checkmating pieces: first_lady, tank, brave_soldier, armored_car
  const majorTypes: PieceType[] = ['first_lady', 'tank', 'brave_soldier', 'armored_car'];
  const hasMajor = [...whitePieces, ...blackPieces].some((p) => majorTypes.includes(p.type));
  if (hasMajor) return false;

  // Police cannot capture or check, so they cannot deliver checkmate
  const whiteOffensive = whitePieces.filter((p) => p.type !== 'president' && p.type !== 'police');
  const blackOffensive = blackPieces.filter((p) => p.type !== 'president' && p.type !== 'police');

  // Both sides have only President (or President + Police)
  if (whiteOffensive.length === 0 && blackOffensive.length === 0) {
    return true;
  }

  // One side has only President, the other side has at most 1 minor piece (Bodyguard or Jet or Trainee Pilot)
  if (whiteOffensive.length === 0 && blackOffensive.length === 1) {
    return true;
  }
  if (blackOffensive.length === 0 && whiteOffensive.length === 1) {
    return true;
  }

  // Both sides have only 1 minor piece each
  if (whiteOffensive.length === 1 && blackOffensive.length === 1) {
    return true;
  }

  // Two Knights/Jets cannot force checkmate against a lone king
  if (
    whiteOffensive.length === 0 &&
    blackOffensive.length <= 2 &&
    blackOffensive.every((p) => p.type === 'jet' || p.type === 'trainee_pilot')
  ) {
    return true;
  }
  if (
    blackOffensive.length === 0 &&
    whiteOffensive.length <= 2 &&
    whiteOffensive.every((p) => p.type === 'jet' || p.type === 'trainee_pilot')
  ) {
    return true;
  }

  return false;
}

/**
 * Check game status: check, checkmate, stalemate, insufficient material, winner
 */
export function evaluateGameStatus(
  board: Board,
  currentTurn: Faction,
  turnNumber: number
): GameStatus {
  const whiteVIP = getVIPStatus(board, 'white');
  const blackVIP = getVIPStatus(board, 'black');
  const whiteJets = getJetsStatus(board, 'white');
  const blackJets = getJetsStatus(board, 'black');

  const currentVIP = currentTurn === 'white' ? whiteVIP : blackVIP;
  const isCheck = isPresidentInCheck(board, currentTurn);

  // Find all legal moves for currentTurn
  let hasAnyLegalMove = false;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.faction === currentTurn) {
        const legal = getLegalMovesForPiece(board, { row: r, col: c }, currentTurn);
        if (legal.length > 0) {
          hasAnyLegalMove = true;
          break;
        }
      }
    }
    if (hasAnyLegalMove) break;
  }

  let isCheckmate = false;
  let isStalemate = false;
  let isInsufficient = false;
  let winner: Faction | 'draw' | null = null;
  let endReason: 'checkmate' | 'stalemate' | 'insufficient_material' | undefined;
  let endTitle: string | undefined;
  let endDescription: string | undefined;

  // 1. Check if both Presidents are missing (empty board or setup phase)
  if (!whiteVIP.presidentPos && !blackVIP.presidentPos) {
    return {
      turn: currentTurn,
      turnNumber,
      whiteVIP,
      blackVIP,
      whiteJets,
      blackJets,
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      isInsufficientMaterial: false,
      winner: null,
    };
  }

  // 2. Check if vulnerable President was eliminated directly (failsafe)
  if (!currentVIP.presidentPos) {
    isCheckmate = true;
    winner = currentTurn === 'white' ? 'black' : 'white';
    endReason = 'checkmate';
    endTitle = winner === 'white' ? 'ฝ่ายน้ำเงิน ชนะศึก!' : 'ฝ่ายแดง ชนะศึก!';
    endDescription = 'ประธานาธิบดีของฝ่ายพ่ายแพ้สูญเสียเกราะคุ้มกันและถูกรุกฆาตจนมุม';
  } else if (!hasAnyLegalMove) {
    // 2. No legal moves left
    if (isCheck && !currentVIP.isPresidentInvincible) {
      // Checkmate
      isCheckmate = true;
      winner = currentTurn === 'white' ? 'black' : 'white';
      endReason = 'checkmate';
      endTitle = winner === 'white' ? 'ฝ่ายน้ำเงิน ชนะศึก!' : 'ฝ่ายแดง ชนะศึก!';
      endDescription = 'ประธานาธิบดีของฝ่ายพ่ายแพ้สูญเสียเกราะคุ้มกันและถูกรุกฆาตจนมุม';
    } else {
      // Stalemate (อับ)
      // "อับ คือการที่ฝั่งตรงข้ามถูกรุกคิงจนเดินไปไหนไม่ได้แล้ว แต่ก็ไม่ถูกอยู่ในระยะโจมตีและเป็นตาของฝั่งนั้นที่โดนปิดทางไม่เหลือให้หมากอะไรเดิน เกมจะจบลงด้วยคำว่า ประฐานาธิปดีปะปนกับฝูงชน (ผลคือเสมอ)"
      isStalemate = true;
      winner = 'draw';
      endReason = 'stalemate';
      endTitle = 'ประธานาธิบดีปะปนกับฝูงชน (ผลคือเสมอ)';
      endDescription = 'ฝั่งตรงข้ามถูกปิดทางจนเดินไปไหนไม่ได้แล้ว แต่ไม่ได้อยู่ในระยะโจมตีและไม่เหลือตาเดินให้หมากใดๆ ขยับได้';
    }
  } else {
    // 3. Has legal moves, check insufficient material
    // "หลังจากที่ตัวเกมถูกตัดสินว่า มีหมากไม่เหลือพอที่จะรุกฆาตได้ เกมจะจบลงด้วยคำว่า กองกำลังไม่พอ"
    isInsufficient = isInsufficientMaterial(board);
    if (isInsufficient) {
      winner = 'draw';
      endReason = 'insufficient_material';
      endTitle = 'กองกำลังไม่พอ';
      endDescription = 'ทั้งสองฝ่ายไม่เหลือหมากที่มีกำลังรบเพียงพอที่จะรุกฆาตได้ (ผลคือเสมอ)';
    }
  }

  return {
    turn: currentTurn,
    turnNumber,
    whiteVIP,
    blackVIP,
    whiteJets,
    blackJets,
    isCheck,
    isCheckmate,
    isStalemate,
    isInsufficientMaterial: isInsufficient,
    winner,
    endReason,
    endTitle,
    endDescription,
  };
}
