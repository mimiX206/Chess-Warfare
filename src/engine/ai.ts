import {
  Board,
  getLegalMovesForPiece,
  applyMove,
  endTurnMaintenance,
  evaluateGameStatus,
  getVIPStatus,
} from './warfareRules';
import {
  Faction,
  Position,
  PieceType,
  MoveTarget,
} from '../types/chess';

export type AIDifficulty = 'easy' | 'normal' | 'expert';

export const DIFFICULTY_LABELS: Record<AIDifficulty, { nameTH: string; desc: string; depth: number }> = {
  easy: {
    nameTH: 'ระดับง่าย',
    desc: 'วิเคราะห์ 1 ตาข้างหน้า',
    depth: 1,
  },
  normal: {
    nameTH: 'ระดับปกติ',
    desc: 'วิเคราะห์ 2 ตาข้างหน้า',
    depth: 2,
  },
  expert: {
    nameTH: 'ระดับเซียน',
    desc: 'วิเคราะห์ 5 ตาข้างหน้า',
    depth: 5,
  },
};

const PIECE_VALUES: Record<PieceType, number> = {
  president: 20000,
  first_lady: 950,
  bodyguard: 360,
  tank: 510,
  jet: 330,
  citizen: 100,
  brave_soldier: 850,
  trainee_pilot: 350,
  police: 320,
  armored_car: 460,
};

export interface AIMoveChoice {
  from: Position;
  to: Position;
  target: MoveTarget;
  promotionType?: PieceType;
  score: number;
}

interface MoveCandidate {
  from: Position;
  to: Position;
  target: MoveTarget;
  pieceType: PieceType;
  promotionType?: PieceType;
  priority: number;
}

/**
 * Static Board Evaluation for a faction
 */
function evaluateBoardForFaction(board: Board, faction: Faction): number {
  const opponent: Faction = faction === 'white' ? 'black' : 'white';
  const myVIP = getVIPStatus(board, faction);
  const oppVIP = getVIPStatus(board, opponent);

  let score = 0;

  // Material evaluation
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 100;
        if (piece.faction === faction) {
          score += val;
          // Center control bonus
          if (r >= 2 && r <= 5 && c >= 2 && c <= 5) score += 15;
          // Reward advancing pawns
          if (piece.type === 'citizen') {
            const advance = faction === 'white' ? 6 - r : r - 1;
            score += advance * 15;
          }
          // Penalty if stuck locked
          if (piece.lockedTurns > 0) score -= 40;
        } else {
          score -= val;
          if (r >= 2 && r <= 5 && c >= 2 && c <= 5) score -= 15;
          if (piece.type === 'citizen') {
            const advance = opponent === 'white' ? 6 - r : r - 1;
            score -= advance * 15;
          }
          if (piece.lockedTurns > 0) score += 40;
        }
      }
    }
  }

  // Tactical VIP Protection scoring:
  if (myVIP.isPresidentInvincible) {
    score += 400;
    if (myVIP.firstLadyAlive) score += 120;
    score += myVIP.bodyguardsRemaining * 70;
  } else {
    // President vulnerable: severe danger!
    score -= 600;
  }

  // Opponent VIP status:
  if (!oppVIP.isPresidentInvincible) {
    score += 700; // Opponent king exposed!
  } else {
    // Reward assassinating enemy VIPs
    if (!oppVIP.firstLadyAlive) score += 250;
    score += (2 - oppVIP.bodyguardsRemaining) * 90;
  }

  return score;
}

/**
 * Generate all legal move candidates for a given faction with tactical ordering
 */
function getAllCandidateMoves(board: Board, faction: Faction): MoveCandidate[] {
  const candidates: MoveCandidate[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.faction === faction) {
        const targets = getLegalMovesForPiece(board, { row: r, col: c }, faction);
        for (const t of targets) {
          const isPromo =
            piece.type === 'citizen' &&
            ((faction === 'white' && t.pos.row === 0) ||
              (faction === 'black' && t.pos.row === 7));

          const promoType: PieceType | undefined = isPromo ? 'brave_soldier' : undefined;

          // Priority heuristic for move ordering
          let priority = 0;
          if (t.type === 'capture' && t.targetPiece) {
            const victimVal = PIECE_VALUES[t.targetPiece.type] || 100;
            const attackerVal = PIECE_VALUES[piece.type] || 100;
            priority += victimVal * 10 - attackerVal; // MVV-LVA
          }
          if (t.type === 'lock' && t.targetPiece) {
            priority += (PIECE_VALUES[t.targetPiece.type] || 100) * 5;
          }
          if (isPromo) {
            priority += 800;
          }

          candidates.push({
            from: { row: r, col: c },
            to: t.pos,
            target: t,
            pieceType: piece.type,
            promotionType: promoType,
            priority,
          });
        }
      }
    }
  }

  // Sort candidates by priority descending (move ordering accelerates alpha-beta pruning)
  candidates.sort((a, b) => b.priority - a.priority);
  return candidates;
}

/**
 * Minimax with Alpha-Beta Pruning
 * Evaluates up to `depth` plies ahead
 */
function alphaBeta(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiFaction: Faction,
  turnNumber: number,
  maxBranching: number = 24
): number {
  const currentFaction = isMaximizing ? aiFaction : (aiFaction === 'white' ? 'black' : 'white');
  const status = evaluateGameStatus(board, currentFaction, turnNumber);

  // Terminal conditions: checkmate or draw
  if (status.isCheckmate) {
    if (status.winner === aiFaction) {
      return 100000 + depth * 1000; // Faster mate preferred
    } else {
      return -100000 - depth * 1000;
    }
  }
  if (status.isStalemate) {
    return 0;
  }

  // Leaf node reached
  if (depth <= 0) {
    return evaluateBoardForFaction(board, aiFaction);
  }

  const moves = getAllCandidateMoves(board, currentFaction);
  if (moves.length === 0) {
    return evaluateBoardForFaction(board, aiFaction);
  }

  // Limit branching factor at deeper levels (plies 3-5) to preserve responsiveness
  const activeMoves = depth <= 2 ? moves : moves.slice(0, maxBranching);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of activeMoves) {
      const piece = board[move.from.row][move.from.col];
      if (!piece) continue;

      const { newBoard } = applyMove(board, move.from, move.to, move.promotionType);
      const postBoard = endTurnMaintenance(newBoard, aiFaction, piece.id);

      const evaluation = alphaBeta(
        postBoard,
        depth - 1,
        alpha,
        beta,
        false,
        aiFaction,
        turnNumber + 1,
        Math.max(6, Math.floor(maxBranching * 0.75))
      );

      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Alpha-Beta cutoff
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const oppFaction = aiFaction === 'white' ? 'black' : 'white';

    for (const move of activeMoves) {
      const piece = board[move.from.row][move.from.col];
      if (!piece) continue;

      const { newBoard } = applyMove(board, move.from, move.to, move.promotionType);
      const postBoard = endTurnMaintenance(newBoard, oppFaction, piece.id);

      const evaluation = alphaBeta(
        postBoard,
        depth - 1,
        alpha,
        beta,
        true,
        aiFaction,
        turnNumber + 1,
        Math.max(6, Math.floor(maxBranching * 0.75))
      );

      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Alpha-Beta cutoff
      }
    }
    return minEval;
  }
}

/**
 * Main AI Engine Entrypoint
 * Handles the 3 required difficulty levels:
 * 1. Easy: วิเคราะห์ความเป็นไปได้ใน 1 ตาข้างหน้า (Depth = 1)
 * 2. Normal: วิเคราะห์ความเป็นไปได้ใน 2 ตาข้างหน้า (Depth = 2)
 * 3. Expert: วิเคราะห์ความเป็นไปได้ใน 5 ตาถัดไป (Depth = 5)
 */
export function getBestAIMove(
  board: Board,
  faction: Faction,
  turnNumber: number,
  difficulty: AIDifficulty = 'normal'
): AIMoveChoice | null {
  const allMoves = getAllCandidateMoves(board, faction);
  if (allMoves.length === 0) return null;

  // Search depth based on difficulty
  const targetDepth = difficulty === 'easy' ? 1 : difficulty === 'normal' ? 2 : 5;

  let bestMove: AIMoveChoice | null = null;
  let bestScore = -Infinity;

  // Shuffle moves slightly to avoid repetitive openings
  const rootMoves = difficulty === 'easy'
    ? [...allMoves].sort(() => Math.random() - 0.5)
    : allMoves;

  // Branching budget for root
  const rootCandidates = difficulty === 'expert' ? rootMoves.slice(0, 20) : rootMoves;

  for (const move of rootCandidates) {
    const piece = board[move.from.row][move.from.col];
    if (!piece) continue;

    // Simulate move
    const { newBoard } = applyMove(board, move.from, move.to, move.promotionType);
    const postBoard = endTurnMaintenance(newBoard, faction, piece.id);

    const opponent: Faction = faction === 'white' ? 'black' : 'white';
    const status = evaluateGameStatus(postBoard, opponent, turnNumber + 1);

    let moveScore = 0;

    if (status.isCheckmate && status.winner === faction) {
      // Immediate winning checkmate!
      moveScore = 999999;
    } else if (targetDepth === 1) {
      // Easy level: evaluate 1 ply ahead
      moveScore = evaluateBoardForFaction(postBoard, faction);

      if (move.target.type === 'capture' && move.target.targetPiece) {
        moveScore += PIECE_VALUES[move.target.targetPiece.type] * 1.2;
      }
      if (move.target.type === 'lock' && move.target.targetPiece) {
        moveScore += PIECE_VALUES[move.target.targetPiece.type] * 0.7;
      }

      // Add a slight variance in easy mode for human-like casual play
      moveScore += (Math.random() - 0.5) * 40;
    } else {
      // Normal (2 plies) or Expert (5 plies)
      // Call Alpha-Beta on the remaining plies (depth - 1)
      moveScore = alphaBeta(
        postBoard,
        targetDepth - 1,
        -Infinity,
        Infinity,
        false, // Opponent's turn to minimize
        faction,
        turnNumber + 1,
        difficulty === 'expert' ? 10 : 16
      );

      // Positional tie-breakers
      if (move.target.type === 'capture' && move.target.targetPiece) {
        moveScore += 15;
      }
    }

    if (moveScore > bestScore || !bestMove) {
      bestScore = moveScore;
      bestMove = {
        from: move.from,
        to: move.to,
        target: move.target,
        promotionType: move.promotionType,
        score: moveScore,
      };
    }
  }

  return bestMove;
}
