import {
  Board,
  posToCoord,
} from './warfareRules';
import {
  Faction,
  Piece,
  Position,
  MoveTarget,
  GameStatus,
} from '../types/chess';

export function getPieceShortCode(piece: Piece): string {
  const prefix = piece.faction === 'white' ? 'W' : 'B';
  switch (piece.type) {
    case 'president':
      return `${prefix}P`; // President
    case 'first_lady':
      return `${prefix}F`; // First Lady
    case 'bodyguard':
      return `${prefix}B`; // Bodyguard
    case 'jet':
      return `${prefix}J`; // Jet
    case 'tank':
      return `${prefix}T`; // Tank
    case 'citizen':
      return `${prefix}C`; // Citizen
    case 'brave_soldier':
      return `${prefix}S`; // Brave Soldier
    case 'trainee_pilot':
      return `${prefix}Pt`; // Trainee Pilot
    case 'police':
      return `${prefix}Pl`; // Police
    case 'armored_car':
      return `${prefix}A`; // Armored Car
  }
}

export function getPieceUnicode(piece: Piece): string {
  const isW = piece.faction === 'white';
  switch (piece.type) {
    case 'president':
      return isW ? '♔' : '♚';
    case 'first_lady':
      return isW ? '♕' : '♛';
    case 'bodyguard':
      return isW ? '♗' : '♝';
    case 'jet':
      return isW ? '♘' : '♞';
    case 'tank':
      return isW ? '♖' : '♜';
    case 'citizen':
      return isW ? '♙' : '♟';
    case 'brave_soldier':
      return isW ? '⚔️' : '🗡️';
    case 'trainee_pilot':
      return isW ? '🛩️' : '✈️';
    case 'police':
      return isW ? '👮' : '🚔';
    case 'armored_car':
      return isW ? '🛡️' : '🚜';
  }
}

/**
 * Generate formatted Text-Based Grid 8x8 conforming strictly to visual & interaction standards
 */
export function generateTextBasedGrid(
  board: Board,
  selectedPos: Position | null,
  legalTargets: MoveTarget[],
  gameStatus: GameStatus
): string {
  const lines: string[] = [];

  lines.push('================================================================');
  lines.push('           WARFARE CHESS ENGINE — TEXT-BASED GRID (8x8)         ');
  lines.push('================================================================');

  const currentTurnTH = gameStatus.turn === 'white' ? 'ฝ่ายน้ำเงิน (Allied White)' : 'ฝ่ายแดง (Opponent Black)';
  lines.push(`ตาเดินที่: ${gameStatus.turnNumber} | กำลังเดิน: ${currentTurnTH}`);

  if (gameStatus.isCheckmate) {
    lines.push(`🚨 ผลการรบ: CHECKMATE! ผู้ชนะคือ ${gameStatus.winner === 'white' ? 'ฝ่ายน้ำเงิน' : 'ฝ่ายแดง'}`);
  } else if (gameStatus.isStalemate) {
    lines.push(`🤝 ผลการรบ: ประธานาธิบดีปะปนกับฝูงชน (ผลคือเสมอ)`);
  } else if (gameStatus.isInsufficientMaterial) {
    lines.push(`🤝 ผลการรบ: กองกำลังไม่พอ (ผลคือเสมอ)`);
  } else if (gameStatus.isCheck) {
    lines.push(`⚠️ แจ้งเตือน: ประธานาธิบดีกำลังถูกรุก (CHECK) ต้องแก้ไขสถานการณ์!`);
  } else {
    lines.push(`สถานะระบบ: สภาวะปกติ พร้อมรับคำสั่งเดิน`);
  }

  lines.push('----------------------------------------------------------------');
  lines.push('      a      b      c      d      e      f      g      h    ');
  lines.push('   +------+------+------+------+------+------+------+------+');

  for (let r = 0; r < 8; r++) {
    const rankNum = 8 - r;
    let rowStr = ` ${rankNum} |`;

    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      const isSelected = selectedPos && selectedPos.row === r && selectedPos.col === c;
      const target = legalTargets.find((t) => t.pos.row === r && t.pos.col === c);

      let cellContent = '  .   '; // Default empty square

      if (isSelected && piece) {
        const code = getPieceShortCode(piece);
        cellContent = `>${code}<`.padStart(5, ' ').padEnd(6, ' ');
      } else if (target) {
        if (target.type === 'move') {
          // Standard requirement: [ • ]
          cellContent = ' [ • ]';
        } else if (target.type === 'lock') {
          // Police lock target: [🔒X🔒]
          const code = piece ? getPieceShortCode(piece) : 'X';
          cellContent = `[🔒${code}]`;
        } else if (target.type === 'capture') {
          // Standard requirement: [*X*] or [✨X✨]
          const code = piece ? getPieceShortCode(piece) : 'X';
          cellContent = `[*${code}*]`;
        }
      } else if (piece) {
        const code = getPieceShortCode(piece);
        if (piece.lockedTurns > 0) {
          cellContent = ` 🔒${code} `;
        } else {
          cellContent = `  ${code}  `.substring(0, 6);
        }
      }

      rowStr += cellContent + '|';
    }

    rowStr += ` ${rankNum}`;
    lines.push(rowStr);
    lines.push('   +------+------+------+------+------+------+------+------+');
  }

  lines.push('      a      b      c      d      e      f      g      h    ');
  lines.push('----------------------------------------------------------------');

  // JET COOLDOWN STATUS
  lines.push('✈️  สถานะคูลดาวน์เครื่องบินขับไล่ (JET COOLDOWN STATUS):');
  lines.push('----------------------------------------------------------------');

  const formatJetList = (jets: typeof gameStatus.whiteJets, factionName: string) => {
    if (jets.length === 0) {
      return `   • ${factionName}: ยูนิต Jet ทั้งหมดถูกทำลาย`;
    }
    return jets
      .map((jet, idx) => {
        const coord = posToCoord(jet.pos);
        if (jet.cooldown === 0) {
          return `   • ${factionName} Jet #${idx + 1} (${coord}): [ พร้อมบิน (READY) ]`;
        } else {
          return `   • ${factionName} Jet #${idx + 1} (${coord}): [ รอคูลดาวน์อีก ${jet.cooldown} เทิร์นบนกระดาน (นับรวมที่ศัตรูเดิน) ]`;
        }
      })
      .join('\n');
  };

  lines.push(formatJetList(gameStatus.whiteJets, 'ฝ่ายน้ำเงิน (White)'));
  lines.push(formatJetList(gameStatus.blackJets, 'ฝ่ายแดง (Black)'));

  lines.push('----------------------------------------------------------------');
  // VIP PROTECTION UNITS REMAINING
  lines.push('🛡️  รายชื่อยูนิตคุ้มกันที่เหลืออยู่ (VIP PROTECTION & INVINCIBILITY):');
  lines.push('----------------------------------------------------------------');

  const formatVIP = (vip: typeof gameStatus.whiteVIP, factionName: string) => {
    const flStatus = vip.firstLadyAlive ? 'มีชีวิต (ALIVE)' : 'ถูกกำจัด (KIA)';
    const bgStatus = `${vip.bodyguardsRemaining} นาย`;
    const shieldStatus = vip.isPresidentInvincible
      ? '🛡️ อมตะ (INVINCIBLE) [ห้ามถูกกิน / ไม่ต้องหนีรุก]'
      : '⚠️ เปราะบาง (VULNERABLE) [ถูกรุกฆาตได้!]';
    const posStr = vip.presidentPos ? posToCoord(vip.presidentPos) : 'ถูกจับกุม';

    return `   [${factionName}]
     - ตำแหน่งประธานาธิบดี: ${posStr}
     - สุภาพสตรีหมายเลขหนึ่ง (First Lady): ${flStatus}
     - บอดี้การ์ด (Bodyguards) ที่เหลือ: ${bgStatus}
     - สถานะเกราะคุ้มกัน: ${shieldStatus}`;
  };

  lines.push(formatVIP(gameStatus.whiteVIP, 'ฝ่ายน้ำเงิน (White / Allied Forces)'));
  lines.push('');
  lines.push(formatVIP(gameStatus.blackVIP, 'ฝ่ายแดง (Black / Opponent Forces)'));

  lines.push('================================================================');
  lines.push('สัญลักษณ์: [ • ] = เดินได้ | [*X*] = กินได้ | [🔒X] = ตำรวจล็อกเป้าหมาย');
  lines.push('คำสั่งด่วน: คลิกที่กระดาน หรือพิมพ์ e2e4, select e2, lock c5 ในคอนโซล');
  lines.push('================================================================');

  return lines.join('\n');
}
