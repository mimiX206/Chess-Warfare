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
import { Language } from '../i18n/types';

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
 * Generate formatted Text-Based Grid 8x8 in selected language
 */
export function generateTextBasedGrid(
  board: Board,
  selectedPos: Position | null,
  legalTargets: MoveTarget[],
  gameStatus: GameStatus,
  lang: Language = 'th'
): string {
  const lines: string[] = [];

  const headers: Record<Language, string> = {
    th: '           WARFARE CHESS ENGINE — TEXT-BASED GRID (8x8)         ',
    en: '           WARFARE CHESS ENGINE — TEXT-BASED GRID (8x8)         ',
    ja: '           WARFARE CHESS ENGINE — テキスト盤面 (8x8)            ',
    zh: '           WARFARE CHESS ENGINE — 纯文本战术棋盘 (8x8)          ',
  };

  lines.push('================================================================');
  lines.push(headers[lang] || headers.th);
  lines.push('================================================================');

  const turnNames: Record<Language, { white: string; black: string; turnPrefix: string; turnPrefix2: string }> = {
    th: {
      white: 'ฝ่ายน้ำเงิน (Allied White)',
      black: 'ฝ่ายแดง (Opponent Black)',
      turnPrefix: 'ตาเดินที่:',
      turnPrefix2: 'กำลังเดิน:',
    },
    en: {
      white: 'Blue Forces (Allied White)',
      black: 'Red Forces (Opponent Black)',
      turnPrefix: 'Turn #',
      turnPrefix2: 'Active:',
    },
    ja: {
      white: '青軍（味方連合）',
      black: '赤軍（敵性勢力）',
      turnPrefix: 'ターン #',
      turnPrefix2: '手番:',
    },
    zh: {
      white: '蓝方盟军',
      black: '红方敌军',
      turnPrefix: '回合 #',
      turnPrefix2: '行动方:',
    },
  };

  const currentTurnStr = gameStatus.turn === 'white' ? turnNames[lang].white : turnNames[lang].black;
  lines.push(`${turnNames[lang].turnPrefix} ${gameStatus.turnNumber} | ${turnNames[lang].turnPrefix2} ${currentTurnStr}`);

  if (gameStatus.isCheckmate) {
    const winStr =
      lang === 'en'
        ? `🚨 BATTLE REPORT: CHECKMATE! Victor: ${gameStatus.winner === 'white' ? 'Blue Forces' : 'Red Forces'}`
        : lang === 'ja'
        ? `🚨 戦況報告：CHECKMATE（詰み）！勝者：${gameStatus.winner === 'white' ? '青軍' : '赤軍'}`
        : lang === 'zh'
        ? `🚨 战报：CHECKMATE 将死！获胜方：${gameStatus.winner === 'white' ? '蓝方盟军' : '红方敌军'}`
        : `🚨 ผลการรบ: CHECKMATE! ผู้ชนะคือ ${gameStatus.winner === 'white' ? 'ฝ่ายน้ำเงิน' : 'ฝ่ายแดง'}`;
    lines.push(winStr);
  } else if (gameStatus.isStalemate) {
    const stStr =
      lang === 'en'
        ? `🤝 BATTLE REPORT: President blended into the crowd (Draw / Stalemate)`
        : lang === 'ja'
        ? `🤝 戦況報告：大統領が群衆に紛れ込んだ（引き分け / ステイルメイト）`
        : lang === 'zh'
        ? `🤝 战报：总统已混入平民人群中（逼和 / 和棋）`
        : `🤝 ผลการรบ: ประธานาธิบดีปะปนกับฝูงชน (ผลคือเสมอ)`;
    lines.push(stStr);
  } else if (gameStatus.isInsufficientMaterial) {
    const infStr =
      lang === 'en'
        ? `🤝 BATTLE REPORT: Insufficient forces for checkmate (Draw)`
        : lang === 'ja'
        ? `🤝 戦況報告：戦力不足による引き分け`
        : lang === 'zh'
        ? `🤝 战报：双方战力不足以将死对方（和棋）`
        : `🤝 ผลการรบ: กองกำลังไม่พอ (ผลคือเสมอ)`;
    lines.push(infStr);
  } else if (gameStatus.isCheck) {
    const chkStr =
      lang === 'en'
        ? `⚠️ WARNING: President is under CHECK! Evasion or interception required!`
        : lang === 'ja'
        ? `⚠️ 警告：大統領に王手（CHECK）がかかっています！防衛または退避が必要！`
        : lang === 'zh'
        ? `⚠️ 警告：总统遭遇将军（CHECK）！必须立即解将！`
        : `⚠️ แจ้งเตือน: ประธานาธิบดีกำลังถูกรุก (CHECK) ต้องแก้ไขสถานการณ์!`;
    lines.push(chkStr);
  } else {
    const normStr =
      lang === 'en'
        ? `SYSTEM STATUS: Operational. Awaiting movement commands.`
        : lang === 'ja'
        ? `システム状況：正常。作戦指揮コマンド待機中。`
        : lang === 'zh'
        ? `系统状态：战术网络就绪。等待指令下达。`
        : `สถานะระบบ: สภาวะปกติ พร้อมรับคำสั่งเดิน`;
    lines.push(normStr);
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
  const jetHeader =
    lang === 'en'
      ? '✈️  FIGHTER JET COOLDOWN TRACKER:'
      : lang === 'ja'
      ? '✈️  戦闘機出撃クールダウン管理:'
      : lang === 'zh'
      ? '✈️  战斗机战备冷却状态:'
      : '✈️  สถานะคูลดาวน์เครื่องบินขับไล่ (JET COOLDOWN STATUS):';
  lines.push(jetHeader);
  lines.push('----------------------------------------------------------------');

  const formatJetList = (jets: typeof gameStatus.whiteJets, factionName: string) => {
    if (jets.length === 0) {
      return lang === 'en'
        ? `   • ${factionName}: All Jets destroyed`
        : lang === 'ja'
        ? `   • ${factionName}: すべての戦闘機が撃破されました`
        : lang === 'zh'
        ? `   • ${factionName}: 所有战机已损失`
        : `   • ${factionName}: ยูนิต Jet ทั้งหมดถูกทำลาย`;
    }
    return jets
      .map((jet, idx) => {
        const coord = posToCoord(jet.pos);
        if (jet.cooldown === 0) {
          return lang === 'en'
            ? `   • ${factionName} Jet #${idx + 1} (${coord}): [ READY FOR SCRAMBLE ]`
            : lang === 'ja'
            ? `   • ${factionName} 戦闘機 #${idx + 1} (${coord}): [ 出撃可能（READY） ]`
            : lang === 'zh'
            ? `   • ${factionName} 战机 #${idx + 1} (${coord}): [ 随时出击（READY） ]`
            : `   • ${factionName} Jet #${idx + 1} (${coord}): [ พร้อมบิน (READY) ]`;
        } else {
          return lang === 'en'
            ? `   • ${factionName} Jet #${idx + 1} (${coord}): [ Cooldown: ${jet.cooldown} board turns remaining ]`
            : lang === 'ja'
            ? `   • ${factionName} 戦闘機 #${idx + 1} (${coord}): [ クールダウン残り ${jet.cooldown} ターン ]`
            : lang === 'zh'
            ? `   • ${factionName} 战机 #${idx + 1} (${coord}): [ 战备冷却中：尚余 ${jet.cooldown} 回合 ]`
            : `   • ${factionName} Jet #${idx + 1} (${coord}): [ รอคูลดาวน์อีก ${jet.cooldown} เทิร์นบนกระดาน (นับรวมที่ศัตรูเดิน) ]`;
        }
      })
      .join('\n');
  };

  const blueName = lang === 'en' ? 'Blue Forces' : lang === 'ja' ? '青軍' : lang === 'zh' ? '蓝方盟军' : 'ฝ่ายน้ำเงิน (White)';
  const redName = lang === 'en' ? 'Red Forces' : lang === 'ja' ? '赤軍' : lang === 'zh' ? '红方敌军' : 'ฝ่ายแดง (Black)';

  lines.push(formatJetList(gameStatus.whiteJets, blueName));
  lines.push(formatJetList(gameStatus.blackJets, redName));

  lines.push('----------------------------------------------------------------');
  // VIP PROTECTION UNITS REMAINING
  const vipHeader =
    lang === 'en'
      ? '🛡️  VIP ESCORT STATUS & INVINCIBILITY:'
      : lang === 'ja'
      ? '🛡️  大統領護衛状況 ＆ 無敵シールド状態:'
      : lang === 'zh'
      ? '🛡️  总统安保护卫 ＆ 无敌护甲状态:'
      : '🛡️  รายชื่อยูนิตคุ้มกันที่เหลืออยู่ (VIP PROTECTION & INVINCIBILITY):';
  lines.push(vipHeader);
  lines.push('----------------------------------------------------------------');

  const formatVIP = (vip: typeof gameStatus.whiteVIP, factionLabel: string) => {
    const flStatus = vip.firstLadyAlive
      ? (lang === 'en' ? 'ACTIVE' : lang === 'ja' ? '健在' : lang === 'zh' ? '在场' : 'มีชีวิต (ALIVE)')
      : (lang === 'en' ? 'KIA' : lang === 'ja' ? '撃破' : lang === 'zh' ? '阵亡' : 'ถูกกำจัด (KIA)');
    
    const bgStatus =
      lang === 'en'
        ? `${vip.bodyguardsRemaining} active`
        : lang === 'ja'
        ? `${vip.bodyguardsRemaining} 体残存`
        : lang === 'zh'
        ? `${vip.bodyguardsRemaining} 名在场`
        : `${vip.bodyguardsRemaining} นาย`;

    const shieldStatus = vip.isPresidentInvincible
      ? (lang === 'en' ? '🛡️ INVINCIBLE [Cannot be captured / Check ignored]' : lang === 'ja' ? '🛡️ 無敵（INVINCIBLE）[捕獲不可・王手無効]' : lang === 'zh' ? '🛡️ 总统无敌 [不可击杀/免疫将军]' : '🛡️ อมตะ (INVINCIBLE) [ห้ามถูกกิน / ไม่ต้องหนีรุก]')
      : (lang === 'en' ? '⚠️ VULNERABLE [Can be checkmated!]' : lang === 'ja' ? '⚠️ 無防備（VULNERABLE）[詰み可能！]' : lang === 'zh' ? '⚠️ 脆弱状态 [可被将死！]' : '⚠️ เปราะบาง (VULNERABLE) [ถูกรุกฆาตได้!]');

    const posStr = vip.presidentPos
      ? posToCoord(vip.presidentPos)
      : (lang === 'en' ? 'Captured' : lang === 'ja' ? '捕獲' : lang === 'zh' ? '已被俘' : 'ถูกจับกุม');

    const presLabel = lang === 'en' ? 'President Pos' : lang === 'ja' ? '大統領位置' : lang === 'zh' ? '总统位置' : 'ตำแหน่งประธานาธิบดี';
    const flLabel = lang === 'en' ? 'First Lady' : lang === 'ja' ? 'ファーストレディ' : lang === 'zh' ? '第一夫人' : 'สุภาพสตรีหมายเลขหนึ่ง';
    const bgLabel = lang === 'en' ? 'Bodyguards' : lang === 'ja' ? 'ボディーガード' : lang === 'zh' ? '保镖' : 'บอดี้การ์ดที่เหลือ';
    const shLabel = lang === 'en' ? 'Shield Status' : lang === 'ja' ? 'シールド状態' : lang === 'zh' ? '护甲状态' : 'สถานะเกราะคุ้มกัน';

    return `   [${factionLabel}]
     - ${presLabel}: ${posStr}
     - ${flLabel}: ${flStatus}
     - ${bgLabel}: ${bgStatus}
     - ${shLabel}: ${shieldStatus}`;
  };

  lines.push(formatVIP(gameStatus.whiteVIP, blueName));
  lines.push('');
  lines.push(formatVIP(gameStatus.blackVIP, redName));

  lines.push('================================================================');
  const footerLeg =
    lang === 'en'
      ? 'Legend: [ • ] = Move | [*X*] = Capture | [🔒X] = Police Lock'
      : lang === 'ja'
      ? '凡例: [ • ] = 移動可 | [*X*] = 捕獲可 | [🔒X] = 警察ロック'
      : lang === 'zh'
      ? '图例: [ • ] = 可移动 | [*X*] = 可击杀 | [🔒X] = 特警锁定'
      : 'สัญลักษณ์: [ • ] = เดินได้ | [*X*] = กินได้ | [🔒X] = ตำรวจล็อกเป้าหมาย';
  lines.push(footerLeg);
  lines.push('================================================================');

  return lines.join('\n');
}
