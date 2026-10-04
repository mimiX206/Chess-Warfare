import { Language, PieceLocalization, DifficultyLocalization, RulesSection } from './types';
import { PieceType, Faction } from '../types/chess';
import { AIDifficulty } from '../engine/ai';

export const PIECE_TRANSLATIONS: Record<Language, Record<PieceType, PieceLocalization>> = {
  th: {
    president: { name: 'ประธานาธิบดี', title: 'President', role: 'ผู้นำสูงสุด (King) - เดิน 1 ช่องรอบตัว มีเกราะอมตะเมื่อมีผู้คุ้มกัน', symbol: '♚' },
    first_lady: { name: 'สุภาพสตรีหมายเลขหนึ่ง', title: 'First Lady', role: 'คุ้มกันประธานาธิบดี / เดินอิสระทุกทิศทาง (Queen)', symbol: '♛' },
    bodyguard: { name: 'บอดี้การ์ด', title: 'Bodyguard', role: 'คุ้มกันประธานาธิบดี / เดินแนวทแยง (Bishop)', symbol: '♝' },
    jet: { name: 'เครื่องบินขับไล่', title: 'Jet', role: 'เดินแบบ L-Shape (Knight) / มีคูลดาวน์ 2 เทิร์นบนกระดาน', symbol: '♞' },
    tank: { name: 'รถถังประจัญบาน', title: 'Tank', role: 'เดินแนวตั้งและแนวนอนไม่จำกัดระยะ (Rook)', symbol: '♜' },
    citizen: { name: 'พลเมือง', title: 'Citizen', role: 'เดินหน้า 1 ช่อง (ตาแรกเดินได้ 2) / เลื่อนขั้นเมื่อถึงแถวสุดท้าย (Pawn)', symbol: '♟' },
    brave_soldier: { name: 'ทหารผู้กล้า', title: 'Brave Soldier', role: 'ยูนิตโปรโมท: เดินเหมือน Queen ระยะไม่เกิน 5 ช่อง', symbol: '⚔️' },
    trainee_pilot: { name: 'นักบินฝึกหัด', title: 'Trainee Pilot', role: 'ยูนิตโปรโมท: เดิน/กินเหมือน Knight ไร้คูลดาวน์', symbol: '🛩️' },
    police: { name: 'ตำรวจสันติบาล', title: 'Police', role: 'ยูนิตโปรโมท: พุ่งประชิดล็อกหมากข้าศึก 1 ตา (ไม่กินหมาก / ล็อกซ้ำไม่ได้)', symbol: '👮' },
    armored_car: { name: 'รถหุ้มเกราะ', title: 'Armored Car', role: 'ยูนิตโปรโมท: เดินเหมือน Tank ระยะไม่เกิน 4 ช่อง', symbol: '🛡️' },
  },
  en: {
    president: { name: 'President', title: 'President', role: 'Supreme Commander (King) - 1 step any direction; Invincible while guarded', symbol: '♚' },
    first_lady: { name: 'First Lady', title: 'First Lady', role: 'Guards President / Unlimited orthogonal & diagonal movement (Queen)', symbol: '♛' },
    bodyguard: { name: 'Bodyguard', title: 'Bodyguard', role: 'Guards President / Diagonal movement (Bishop)', symbol: '♝' },
    jet: { name: 'Fighter Jet', title: 'Jet', role: 'L-Shape jump (Knight) / 2 board-turn cooldown after deployment', symbol: '♞' },
    tank: { name: 'Battle Tank', title: 'Tank', role: 'Unlimited orthogonal rank and file movement (Rook)', symbol: '♜' },
    citizen: { name: 'Citizen', title: 'Citizen', role: 'Moves 1 forward (2 on 1st move); Promotes at enemy baseline (Pawn)', symbol: '♟' },
    brave_soldier: { name: 'Brave Soldier', title: 'Brave Soldier', role: 'Promoted Unit: Queen mobility up to 5 squares', symbol: '⚔️' },
    trainee_pilot: { name: 'Trainee Pilot', title: 'Trainee Pilot', role: 'Promoted Unit: Knight mobility with zero cooldown', symbol: '🛩️' },
    police: { name: 'Special Police', title: 'Police', role: 'Promoted Unit: Dashes adjacent & locks target for 1 turn (No capture / Anti-chain lock)', symbol: '👮' },
    armored_car: { name: 'Armored Car', title: 'Armored Car', role: 'Promoted Unit: Rook mobility up to 4 squares', symbol: '🛡️' },
  },
  ja: {
    president: { name: '大統領', title: 'President', role: '最高指揮官（キング）- 周囲1マス。護衛がいる限り無敵状態', symbol: '♚' },
    first_lady: { name: 'ファーストレディ', title: 'First Lady', role: '大統領を護衛 / 全方向無制限移動（クイーン）', symbol: '♛' },
    bodyguard: { name: 'ボディーガード', title: 'Bodyguard', role: '大統領を護衛 / 斜め移動（ビショップ）', symbol: '♝' },
    jet: { name: '戦闘機', title: 'Jet', role: 'L字ジャンプ（ナイト）/ 出撃後盤上2ターンのクールダウン', symbol: '♞' },
    tank: { name: '主力戦車', title: 'Tank', role: '縦横直線移動（ルーク）', symbol: '♜' },
    citizen: { name: '市民', title: 'Citizen', role: '前進1マス（初手2マス）/ 敵陣最奥で昇格（ポーン）', symbol: '♟' },
    brave_soldier: { name: '勇敢な兵士', title: 'Brave Soldier', role: '昇格ユニット: クイーン同様の動き（最大5マスまで）', symbol: '⚔️' },
    trainee_pilot: { name: '訓練生パイロット', title: 'Trainee Pilot', role: '昇格ユニット: ナイトの動き（クールダウンなし）', symbol: '🛩️' },
    police: { name: '治安警察', title: 'Police', role: '昇格ユニット: 敵に突進接近し1ターン拘束（捕獲不可・連続拘束無効）', symbol: '👮' },
    armored_car: { name: '装甲車', title: 'Armored Car', role: '昇格ユニット: ルーク同様の動き（最大4マスまで）', symbol: '🛡️' },
  },
  zh: {
    president: { name: '总统', title: 'President', role: '最高统帅（王/King）- 周围1格；只要有护卫在场即处于无敌状态', symbol: '♚' },
    first_lady: { name: '第一夫人', title: 'First Lady', role: '保护总统 / 任意方向自由移动（后/Queen）', symbol: '♛' },
    bodyguard: { name: '保镖', title: 'Bodyguard', role: '保护总统 / 斜向移动（象/Bishop）', symbol: '♝' },
    jet: { name: '战斗机', title: 'Jet', role: 'L形移动（马/Knight）/ 移动后需冷却2个棋盘回合', symbol: '♞' },
    tank: { name: '主战坦克', title: 'Tank', role: '直线横竖移动（车/Rook）', symbol: '♜' },
    citizen: { name: '平民', title: 'Citizen', role: '向前1格（首步可走2格）/ 抵达底线晋升（兵/Pawn）', symbol: '♟' },
    brave_soldier: { name: '勇士', title: 'Brave Soldier', role: '晋升单位：具备皇后能力（移动距离上限5格）', symbol: '⚔️' },
    trainee_pilot: { name: '实习飞行员', title: 'Trainee Pilot', role: '晋升单位：具备马的能力（无冷却时间）', symbol: '🛩️' },
    police: { name: '特警', title: 'Police', role: '晋升单位：突进至目标贴身并锁定1回合（不吃子/不可连续锁定）', symbol: '👮' },
    armored_car: { name: '装甲车', title: 'Armored Car', role: '晋升单位：具备车的能力（移动距离上限4格）', symbol: '🛡️' },
  },
};

export const DIFFICULTY_TRANSLATIONS: Record<Language, Record<AIDifficulty, DifficultyLocalization>> = {
  th: {
    easy: { name: 'ระดับง่าย', desc: 'วิเคราะห์ 1 ตาข้างหน้า' },
    normal: { name: 'ระดับปกติ', desc: 'วิเคราะห์ 2 ตาข้างหน้า' },
    expert: { name: 'ระดับเซียน', desc: 'วิเคราะห์ 5 ตาข้างหน้า' },
  },
  en: {
    easy: { name: 'Easy', desc: '1-ply depth analysis' },
    normal: { name: 'Normal', desc: '2-ply depth tactical engine' },
    expert: { name: 'Expert', desc: '5-ply deep minimax tactical AI' },
  },
  ja: {
    easy: { name: '初級', desc: '先読み 1手' },
    normal: { name: '中級', desc: '先読み 2手' },
    expert: { name: '上級（精鋭）', desc: '先読み 5手（深層戦術AI）' },
  },
  zh: {
    easy: { name: '初级', desc: '推演 1 步' },
    normal: { name: '中级', desc: '推演 2 步' },
    expert: { name: '大师级', desc: '推演 5 步（深度战术AI）' },
  },
};

export const FACTION_NAMES: Record<Language, Record<Faction, string>> = {
  th: {
    white: 'ฝ่ายน้ำเงิน (Allies)',
    black: 'ฝ่ายแดง (Opponents)',
  },
  en: {
    white: 'Blue Forces (Allies)',
    black: 'Red Forces (Opponents)',
  },
  ja: {
    white: '青軍（味方連合）',
    black: '赤軍（敵性勢力）',
  },
  zh: {
    white: '蓝方盟军',
    black: '红方敌军',
  },
};

export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  th: {
    appName: 'CHESS WARFARE',
    appSubtitle: 'ระบบจำลองยุทธการหมากรุกสงคราม',
    rulesBtn: 'กติกา',
    rulesTitle: 'คู่มือกติกา Warfare',
    resetBtn: 'เริ่มใหม่',
    coinTossBtn: 'ทอยเหรียญ',
    vsAI: 'vs AI',
    twoPlayer: '2P',
    sandbox: 'Sandbox',
    soundOn: 'เปิดเสียง',
    soundOff: 'ปิดเสียง',
    language: 'ภาษา',
    difficulty: 'ความยาก',
    movesCount: 'ตาเดิน',
    
    // Status Panel
    turnLabel: 'ตาเดินของ',
    turnRound: 'รอบที่',
    checkAlert: '🚨 กำลังถูกรุก (CHECK)!',
    invincibleGuard: 'เกราะคุ้มกันอมตะ',
    vulnerableKing: 'ไร้เกราะคุ้มกัน',
    guardedBy: 'มีผู้คุ้มกัน',
    bodyguardsRemaining: 'บอดี้การ์ดคงเหลือ',
    firstLadyStatus: 'สุภาพสตรีฯ',
    alive: 'ยังมีชีวิต',
    eliminated: 'ถูกกำจัดแล้ว',
    capturedPieces: 'หมากที่ถูกกำจัด',
    noneCaptured: 'ยังไม่มีหมากถูกกำจัด',
    jetsReady: 'พร้อมบิน',
    jetsCooldown: 'ติดคูลดาวน์',
    
    // Board Legend
    legendMove: 'เดินได้',
    legendCapture: 'กินได้',
    legendLock: 'ตำรวจล็อก',
    combatLogPrompt: 'บันทึกยุทธการ >',
    
    // Sandbox Controls
    sandboxTitle: 'SANDBOX (TEST MODE)',
    sandboxEditMode: 'โหมดจัดวางหมาก',
    sandboxPlayMode: 'โหมดทดสอบรบ',
    sandboxEditHint: 'คลิกช่องใดก็ได้บนกระดานเพื่อเสกยูนิตของฝ่ายใดก็ได้ออกมา',
    sandboxPlayHint: 'ระบบใช้กติกาการรบ การคุ้มกัน และการรุกฆาตเต็มรูปแบบ',
    sandboxStartPlay: 'เริ่มทดสอบ (Play)',
    sandboxBackToEdit: 'กลับไปแก้ไข (Edit)',
    sandboxClearBoard: 'ล้างกระดาน',
    sandboxStandardPreset: 'วางมาตรฐาน',
    sandboxFirstTurn: 'ตาแรก',
    sandboxTotalPieces: 'รวม',
    sandboxPiecesUnit: 'หมาก',
    sandboxValidationError: 'ต้องการ President ฝ่ายน้ำเงิน 1 ตัว และฝ่ายแดง 1 ตัว เพื่อเริ่มการทดสอบ',
    
    // Summon Modal
    summonTitle: 'เสกตัวหมาก (Sandbox Summon)',
    summonSubtitle: 'เลือกฝ่ายและยูนิตที่ต้องการวางลงบนช่องนี้',
    summonCoord: 'พิกัด',
    summonDeleteBtn: 'ลบหมากช่องนี้',
    summonClickToPlace: 'คลิกยูนิตด้านบนเพื่อวาง',
    cancel: 'ยกเลิก',
    
    // Coin Toss Modal
    coinTossTitle: 'การทอยเหรียญกำหนดฝ่ายเริ่มเดิน (Coin Toss Initiative)',
    coinTossSubtitle: 'เลือกหน้าเหรียญเพื่อชิงสิทธิ์เดินก่อน (โอกาส 50/50)',
    heads: 'หัว (HEADS)',
    tails: 'ก้อย (TAILS)',
    coinTossFlipping: 'กำลังทอยเหรียญ...',
    coinTossFlipBtn: '🪙 ทำการทอยเหรียญ!',
    coinTossResultHeads: 'ผลเหรียญออก: หัว (HEADS)!',
    coinTossResultTails: 'ผลเหรียญออก: ก้อย (TAILS)!',
    coinTossWinBlue: 'ฝ่ายน้ำเงินทายถูก! ได้สิทธิ์เดินก่อน',
    coinTossWinRed: 'ฝ่ายแดงทายถูก! ได้สิทธิ์เดินก่อน',
    enterBattleBtn: 'เข้าสู่สนามรบ (Enter Battle)',
    
    // Promotion Modal
    promotionTitle: 'พลเมืองเข้าสู่แถวสุดท้าย! (Citizen Promotion)',
    promotionSubtitle: 'เลือกเลื่อนขั้นเป็น 1 ใน 4 ยูนิตพิเศษ:',
    
    // Game Over / Battle Report Modal
    reportCheckmate: 'BATTLE REPORT: CHECKMATE',
    reportStalemate: 'BATTLE REPORT: STALEMATE',
    reportInsufficient: 'BATTLE REPORT: INSUFFICIENT FORCES',
    winBlue: 'ฝ่ายน้ำเงิน ชนะศึก!',
    winRed: 'ฝ่ายแดง ชนะศึก!',
    stalemateTitle: 'ประธานาธิบดีปะปนกับฝูงชน (ผลคือเสมอ)',
    insufficientTitle: 'กองกำลังไม่พอ',
    checkmateDesc: 'ประธานาธิบดีของฝ่ายพ่ายแพ้สูญเสียเกราะคุ้มกันและถูกรุกฆาตจนมุม',
    stalemateDesc: 'ฝั่งตรงข้ามถูกปิดทางจนเดินไปไหนไม่ได้แล้ว แต่ไม่ได้อยู่ในระยะโจมตีและไม่เหลือตาเดินให้หมากใดๆ ขยับได้',
    insufficientDesc: 'ทั้งสองฝ่ายไม่เหลือหมากที่มีกำลังรบเพียงพอที่จะรุกฆาตได้ (ผลคือเสมอ)',
    playAgainBtn: 'เริ่มศึกใหม่ (Play Again)',
    editSetupBtn: '✏️ กลับไปแก้ไขกระดาน',
    retryTestBtn: '🔄 ทดสอบใหม่อีกครั้ง',
    
    // AI Thinking Notice
    aiThinkingNotice: 'บอททหาร [{difficulty} - {desc}] กำลังคำนวณยุทธวิธี...',
    
    // Tooltips / Badges
    immuneBadge: 'IMMUNE',
    immuneTooltip: 'มีภูมิคุ้มกัน: ไม่สามารถถูกตำรวจล็อกซ้ำในตานี้ได้',
    lockedTooltip: 'ถูกตำรวจล็อก! ไม่สามารถเดินได้ 1 ตา',
    jetReadyTooltip: 'พร้อมบิน',
    jetCooldownTooltip: 'คูลดาวน์: รออีก {turns} เทิร์นบนกระดาน (นับรวมที่ศัตรูเดิน)',
    
    // Rules Modal Button
    acknowledgeRulesBtn: 'รับทราบคำสั่งปฏิบัติการ',
    
    // Drawer
    drawerTitle: 'บันทึกยุทธการ & คอนโซลควบคุม',
    tabCombatLog: 'ประวัติการเดิน',
    tabTextGrid: 'Text Grid',
    tabConsole: 'คอนโซลคำสั่ง',
  },
  en: {
    appName: 'CHESS WARFARE',
    appSubtitle: 'Tactical Military Chess Simulation',
    rulesBtn: 'Rules',
    rulesTitle: 'Warfare Tactical Field Manual',
    resetBtn: 'Reset',
    coinTossBtn: 'Coin Toss',
    vsAI: 'vs AI',
    twoPlayer: '2P',
    sandbox: 'Sandbox',
    soundOn: 'Unmute',
    soundOff: 'Mute',
    language: 'Language',
    difficulty: 'Difficulty',
    movesCount: 'Moves',
    
    // Status Panel
    turnLabel: 'Active Turn',
    turnRound: 'Turn',
    checkAlert: '🚨 CHECK THREAT DETECTED!',
    invincibleGuard: 'Invincible Shield Active',
    vulnerableKing: 'Shield Down (Vulnerable)',
    guardedBy: 'Guarded by',
    bodyguardsRemaining: 'Bodyguards Remaining',
    firstLadyStatus: 'First Lady',
    alive: 'Active',
    eliminated: 'Eliminated',
    capturedPieces: 'Casualties / Captured',
    noneCaptured: 'No casualties reported yet',
    jetsReady: 'Combat Ready',
    jetsCooldown: 'On Cooldown',
    
    // Board Legend
    legendMove: 'Move',
    legendCapture: 'Capture',
    legendLock: 'Police Lock',
    combatLogPrompt: 'Combat Log >',
    
    // Sandbox Controls
    sandboxTitle: 'SANDBOX (TEST MODE)',
    sandboxEditMode: 'Edit / Setup Mode',
    sandboxPlayMode: 'Live Test Play Mode',
    sandboxEditHint: 'Click any tile on the board to summon units for either faction',
    sandboxPlayHint: 'Full tactical warfare rules, bodyguard invincibility, and checkmate are active',
    sandboxStartPlay: 'Start Test (Play)',
    sandboxBackToEdit: 'Edit Setup (Edit)',
    sandboxClearBoard: 'Clear Board',
    sandboxStandardPreset: 'Standard Preset',
    sandboxFirstTurn: '1st Turn',
    sandboxTotalPieces: 'Total',
    sandboxPiecesUnit: 'pieces',
    sandboxValidationError: 'Requires 1 Blue President and 1 Red President to initiate test',
    
    // Summon Modal
    summonTitle: 'Summon Unit (Sandbox Palette)',
    summonSubtitle: 'Select faction and unit type to spawn on this tile',
    summonCoord: 'Coord',
    summonDeleteBtn: 'Remove Piece',
    summonClickToPlace: 'Click any unit above to place',
    cancel: 'Cancel',
    
    // Coin Toss Modal
    coinTossTitle: 'Initiative Coin Toss',
    coinTossSubtitle: 'Pick a coin side to seize first-move initiative (50/50 odds)',
    heads: 'HEADS',
    tails: 'TAILS',
    coinTossFlipping: 'Flipping coin...',
    coinTossFlipBtn: '🪙 Flip Coin!',
    coinTossResultHeads: 'Coin Landed on: HEADS!',
    coinTossResultTails: 'Coin Landed on: TAILS!',
    coinTossWinBlue: 'Blue Forces guessed correctly! Blue moves first.',
    coinTossWinRed: 'Red Forces take the initiative! Red moves first.',
    enterBattleBtn: 'Enter the Battlefield',
    
    // Promotion Modal
    promotionTitle: 'Citizen Baseline Breakthrough! (Promotion)',
    promotionSubtitle: 'Select promotion into 1 of 4 specialized warfare units:',
    
    // Game Over / Battle Report Modal
    reportCheckmate: 'BATTLE REPORT: CHECKMATE',
    reportStalemate: 'BATTLE REPORT: STALEMATE',
    reportInsufficient: 'BATTLE REPORT: INSUFFICIENT FORCES',
    winBlue: 'Blue Forces Victorious!',
    winRed: 'Red Forces Victorious!',
    stalemateTitle: 'President Blended into the Crowd (Draw)',
    insufficientTitle: 'Insufficient Combat Forces (Draw)',
    checkmateDesc: 'The enemy President lost all security escorts and has been checkmated.',
    stalemateDesc: 'The enemy has no legal moves remaining and is not in check.',
    insufficientDesc: 'Neither side retains sufficient forces to enforce checkmate.',
    playAgainBtn: 'New Campaign (Play Again)',
    editSetupBtn: '✏️ Return to Edit Setup',
    retryTestBtn: '🔄 Restart Test Play',
    
    // AI Thinking Notice
    aiThinkingNotice: 'AI Bot [{difficulty} - {desc}] is calculating tactics...',
    
    // Tooltips / Badges
    immuneBadge: 'IMMUNE',
    immuneTooltip: 'Lock Immune: Cannot be targeted by police lock this turn',
    lockedTooltip: 'Locked by Police! Immobilized for 1 turn',
    jetReadyTooltip: 'Ready to Scramble',
    jetCooldownTooltip: 'Cooldown: {turns} board turns remaining (counts enemy moves)',
    
    // Rules Modal Button
    acknowledgeRulesBtn: 'Acknowledge Standing Orders',
    
    // Drawer
    drawerTitle: 'Combat Log & Tactical Console',
    tabCombatLog: 'Move History',
    tabTextGrid: 'Text Grid',
    tabConsole: 'Command Console',
  },
  ja: {
    appName: 'CHESS WARFARE',
    appSubtitle: '軍事戦術チェスシミュレーション',
    rulesBtn: 'ルール',
    rulesTitle: '作戦規則・戦術教範',
    resetBtn: 'リセット',
    coinTossBtn: 'コイントス',
    vsAI: 'vs AI',
    twoPlayer: '2P',
    sandbox: 'Sandbox',
    soundOn: '音声ON',
    soundOff: '音声OFF',
    language: '言語',
    difficulty: '難易度',
    movesCount: '手数',
    
    // Status Panel
    turnLabel: '現在の手番',
    turnRound: 'ターン',
    checkAlert: '🚨 王手警戒（CHECK）！',
    invincibleGuard: '護衛無敵シールド展開中',
    vulnerableKing: 'シールド消失（無防備）',
    guardedBy: '護衛状況',
    bodyguardsRemaining: '残存ボディーガード',
    firstLadyStatus: 'ファーストレディ',
    alive: '健在',
    eliminated: '壊滅',
    capturedPieces: '捕獲・撃破された駒',
    noneCaptured: '損害報告なし',
    jetsReady: '出撃可能',
    jetsCooldown: '待機中',
    
    // Board Legend
    legendMove: '移動可',
    legendCapture: '捕獲可',
    legendLock: '警察ロック',
    combatLogPrompt: '戦術記録 >',
    
    // Sandbox Controls
    sandboxTitle: 'SANDBOX（テスト・配置モード）',
    sandboxEditMode: '駒配置・編集モード',
    sandboxPlayMode: '実戦テストモード',
    sandboxEditHint: '任意のマスをクリックして両陣営の駒を自由に配置できます',
    sandboxPlayHint: '大統領の無敵保護、ジェット機の冷却、チェックメイト規程を完全適用',
    sandboxStartPlay: 'テスト開始（Play）',
    sandboxBackToEdit: '配置を再編集（Edit）',
    sandboxClearBoard: '盤面全消去',
    sandboxStandardPreset: '標準初期配置',
    sandboxFirstTurn: '先手',
    sandboxTotalPieces: '合計',
    sandboxPiecesUnit: '駒',
    sandboxValidationError: 'テスト開始には青大統領1体と赤大統領1体が必要です',
    
    // Summon Modal
    summonTitle: '駒の召喚（Sandbox Summon）',
    summonSubtitle: '配置する陣営とユニットを選択してください',
    summonCoord: '座標',
    summonDeleteBtn: 'このマスの駒を削除',
    summonClickToPlace: '上のユニットをクリックして配置',
    cancel: 'キャンセル',
    
    // Coin Toss Modal
    coinTossTitle: '先手決定コイントス（Initiative）',
    coinTossSubtitle: 'コインの表裏を選択して先手権を獲得（確率50/50）',
    heads: '表（HEADS）',
    tails: '裏（TAILS）',
    coinTossFlipping: 'コインを投げています...',
    coinTossFlipBtn: '🪙 コイントス実行！',
    coinTossResultHeads: '結果：表（HEADS）！',
    coinTossResultTails: '結果：裏（TAILS）！',
    coinTossWinBlue: '青軍が的中！青軍が先手で開始します。',
    coinTossWinRed: '赤軍が先手権を獲得！赤軍から開始します。',
    enterBattleBtn: '戦場へ出撃する',
    
    // Promotion Modal
    promotionTitle: '市民が敵陣最奥に突入！（プロモーション）',
    promotionSubtitle: '以下の4つの特殊ユニットから昇格先を選択してください：',
    
    // Game Over / Battle Report Modal
    reportCheckmate: 'BATTLE REPORT: CHECKMATE（詰み）',
    reportStalemate: 'BATTLE REPORT: STALEMATE（ステイルメイト）',
    reportInsufficient: 'BATTLE REPORT: 戦力不足による引き分け',
    winBlue: '青軍の完全勝利！',
    winRed: '赤軍の完全勝利！',
    stalemateTitle: '大統領が群衆に紛れ込んだ（引き分け）',
    insufficientTitle: '戦力不足（引き分け）',
    checkmateDesc: '敗北側の大統領はすべての護衛を失い、包囲・チェックメイトされました。',
    stalemateDesc: '相手の手番で合法手がなく、かつ王手（チェック）されていないため引き分けとなりました。',
    insufficientDesc: '両軍ともにチェックメイトを成立させる戦力が残っていません。',
    playAgainBtn: '再戦（Play Again）',
    editSetupBtn: '✏️ 盤面編集に戻る',
    retryTestBtn: '🔄 テストを最初からやり直す',
    
    // AI Thinking Notice
    aiThinkingNotice: 'AI軍事ボット [{difficulty} - {desc}] が戦術計算中...',
    
    // Tooltips / Badges
    immuneBadge: 'IMMUNE',
    immuneTooltip: 'ロック免疫：このターンは警察ロックの対象になりません',
    lockedTooltip: '警察により拘束中！1ターン移動不能',
    jetReadyTooltip: '出撃可能',
    jetCooldownTooltip: 'クールダウン：残り {turns} ターン（敵手番含む）',
    
    // Rules Modal Button
    acknowledgeRulesBtn: '了解・作戦規程を確認',
    
    // Drawer
    drawerTitle: '戦術記録 ＆ 指揮コンソール',
    tabCombatLog: '指し手履歴',
    tabTextGrid: 'テキスト盤面',
    tabConsole: 'コマンド入力',
  },
  zh: {
    appName: 'CHESS WARFARE',
    appSubtitle: '现代军事战术象棋模拟系统',
    rulesBtn: '战术规则',
    rulesTitle: '作战行动战术手册',
    resetBtn: '重置战局',
    coinTossBtn: '掷硬币',
    vsAI: '人机对战',
    twoPlayer: '双人对弈',
    sandbox: '沙盒测试',
    soundOn: '开启音效',
    soundOff: '静音',
    language: '语言选择',
    difficulty: 'AI难度',
    movesCount: '回合数',
    
    // Status Panel
    turnLabel: '当前行动方',
    turnRound: '第',
    checkAlert: '🚨 遭遇将军威胁（CHECK）！',
    invincibleGuard: '总统无敌护甲生效中',
    vulnerableKing: '护甲破除（脆弱状态）',
    guardedBy: '安保护卫力量',
    bodyguardsRemaining: '在场保镖数量',
    firstLadyStatus: '第一夫人',
    alive: '存活在场',
    eliminated: '已阵亡',
    capturedPieces: '阵亡/被俘敌军单位',
    noneCaptured: '暂无战损报告',
    jetsReady: '随时待命出击',
    jetsCooldown: '战备冷却中',
    
    // Board Legend
    legendMove: '可移动',
    legendCapture: '可击杀',
    legendLock: '特警锁定',
    combatLogPrompt: '作战日志 >',
    
    // Sandbox Controls
    sandboxTitle: 'SANDBOX（沙盒测试模式）',
    sandboxEditMode: '单位部署模式',
    sandboxPlayMode: '实战测试模式',
    sandboxEditHint: '点击棋盘任意方格即可召唤任意阵营的单位',
    sandboxPlayHint: '总统无敌护甲、战机冷却、特警锁定及将死规则全面生效',
    sandboxStartPlay: '开始实战测试 (Play)',
    sandboxBackToEdit: '返回编辑部署 (Edit)',
    sandboxClearBoard: '清空全盘',
    sandboxStandardPreset: '重置为标准开局',
    sandboxFirstTurn: '先手方',
    sandboxTotalPieces: '共计',
    sandboxPiecesUnit: '枚棋子',
    sandboxValidationError: '开始测试必须包含蓝方总统与红方总统各1名',
    
    // Summon Modal
    summonTitle: '召唤棋子 (Sandbox Summon)',
    summonSubtitle: '选择阵营与兵种放置于当前选定方格',
    summonCoord: '坐标',
    summonDeleteBtn: '清除此格棋子',
    summonClickToPlace: '点击上方兵种即可放置',
    cancel: '取消',
    
    // Coin Toss Modal
    coinTossTitle: '掷硬币争夺先手权 (Coin Toss)',
    coinTossSubtitle: '选择硬币正反面以争夺首回合行动先手（50/50几率）',
    heads: '正面 (HEADS)',
    tails: '反面 (TAILS)',
    coinTossFlipping: '正在掷硬币...',
    coinTossFlipBtn: '🪙 掷硬币！',
    coinTossResultHeads: '硬币结果：正面 (HEADS)！',
    coinTossResultTails: '硬币结果：反面 (TAILS)！',
    coinTossWinBlue: '蓝方猜中！蓝方获得先手出击权。',
    coinTossWinRed: '红方获得先手出击权！由红方先行。',
    enterBattleBtn: '进入战场展开作战',
    
    // Promotion Modal
    promotionTitle: '平民突入底线！（兵种晋升 Promotion）',
    promotionSubtitle: '请选择晋升为以下4种特种作战单位之一：',
    
    // Game Over / Battle Report Modal
    reportCheckmate: 'BATTLE REPORT: 将死 (CHECKMATE)',
    reportStalemate: 'BATTLE REPORT: 逼和/无子可动 (STALEMATE)',
    reportInsufficient: 'BATTLE REPORT: 兵力不足和棋',
    winBlue: '蓝方盟军 取得决胜！',
    winRed: '红方敌军 取得决胜！',
    stalemateTitle: '总统混入人群中（平局）',
    insufficientTitle: '兵力不足（平局）',
    checkmateDesc: '败方总统失去所有安保护卫，遭敌军重重包围并无路可退。',
    stalemateDesc: '轮到行动的一方无任何合法步可走，且总统未被将军，按交战规则判为平局。',
    insufficientDesc: '双方所剩战力均无法达成将死条件，战局以和棋告终。',
    playAgainBtn: '开启新战役 (Play Again)',
    editSetupBtn: '✏️ 返回调整部署',
    retryTestBtn: '🔄 重新测试本局',
    
    // AI Thinking Notice
    aiThinkingNotice: 'AI军事战术机 [{difficulty} - {desc}] 正在推演战术走法...',
    
    // Tooltips / Badges
    immuneBadge: 'IMMUNE',
    immuneTooltip: '锁定免疫：本回合无法再次被特警锁定',
    lockedTooltip: '遭特警锁定！1回合无法移动',
    jetReadyTooltip: '战机随时可升空出击',
    jetCooldownTooltip: '冷却中：尚需 {turns} 个棋盘回合（计入敌方走子）',
    
    // Rules Modal Button
    acknowledgeRulesBtn: '遵命・已掌握作战条令',
    
    // Drawer
    drawerTitle: '作战日志与指挥控制台',
    tabCombatLog: '行棋战报',
    tabTextGrid: '文本矩阵',
    tabConsole: '指令终端',
  },
};

export const RULES_TRANSLATIONS: Record<Language, RulesSection[]> = {
  th: [
    {
      title: '1. ยูนิตหมากรุกสงคราม (Warfare Pieces)',
      content: 'หมากรุกสงครามประกอบด้วยยูนิตมาตรฐาน 6 ชนิด:',
      items: [
        { name: 'President (ประธานาธิบดี - แทน King)', desc: 'ผู้นำสูงสุด เดินได้ 1 ช่องรอบตัว มี "เกราะคุ้มกันอมตะ" ตราบใดที่ First Lady หรือ Bodyguard ยังมีชีวิตอยู่บนกระดาน' },
        { name: 'First Lady (สุภาพสตรีหมายเลขหนึ่ง - แทน Queen)', desc: 'เดินได้อิสระทุกทิศทาง เป็นหนึ่งในยูนิตคุ้มกันประธานาธิบดี' },
        { name: 'Bodyguard (บอดี้การ์ด - แทน Bishop)', desc: 'เดินแนวทแยง เป็นยูนิตคุ้มกันประธานาธิบดี (มี 2 ตัว)' },
        { name: 'Jet (เครื่องบินขับไล่ - แทน Knight)', desc: 'เดินแบบ L-Shape ข้ามสิ่งกีดขวางได้ เมื่อเดินแล้วจะติด "คูลดาวน์ 2 เทิร์นบนกระดาน" (นับรวมตาที่ศัตรูเดิน)' },
        { name: 'Tank (รถถังประจัญบาน - แทน Rook)', desc: 'เดินแนวตั้งและแนวนอนไม่จำกัดระยะ' },
        { name: 'Citizen (พลเมือง - แทน Pawn)', desc: 'เดินหน้า 1 ช่อง (ตาแรกเดินได้ 2 ช่อง) กินทแยงมุม เมื่อถึงแถวสุดท้ายจะเลื่อนขั้นได้' },
      ],
    },
    {
      title: '2. การโปรโมทเมื่อ Citizen เข้าฐานข้าศึก (Pawn Promotion)',
      content: 'เมื่อ Citizen เดินไปถึงแถวสุดท้ายของข้าศึก สามารถเลือกเปลี่ยนเป็น 4 ยูนิตพิเศษเท่านั้น:',
      items: [
        { name: '1. Brave Soldier (ทหารผู้กล้า)', desc: 'เดินเหมือน Queen แต่จำกัดระยะทางไม่เกิน 5 ช่อง' },
        { name: '2. Trainee Pilot (นักบินฝึกหัด)', desc: 'เดินและกินเหมือน Knight เดินได้ทุกตา ไม่มีคูลดาวน์' },
        { name: '3. Police (ตำรวจ)', desc: 'เดินแนวทแยง ไม่กินหมาก เมื่อสั่งล็อกเป้าหมายจะพุ่งไปประชิดหมากนั้นทันทีและล็อกให้อยู่นิ่ง 1 ตา (หมากที่โดนล็อกจะไม่ถูกล็อกซ้ำในตาถัดไป)' },
        { name: '4. Armored Car (รถหุ้มเกราะ)', desc: 'เดินเหมือน Tank แต่จำกัดระยะทางไม่เกิน 4 ช่อง' },
      ],
    },
    {
      title: '3. กฎเกราะคุ้มกันอมตะของ President & การรุกฆาต',
      content: '• ตราบใดที่ฝ่ายตนเองยังมี First Lady หรือ Bodyguard แม้แต่ตัวเดียวอยู่บนกระดาน President จะอยู่ในสถานะ "อมตะ" (Invincible) ไม่สามารถถูกกินหรือถูกรุกจนมุมได้\n• เมื่อ First Lady และ Bodyguard ทั้งหมดถูกกำจัด President จะเข้าสู่สถานะ "ไร้เกราะคุ้มกัน" (Vulnerable) และสามารถถูกรุกฆาต (Checkmate) ได้ตามกฎหมากรุกสากล',
    },
    {
      title: '4. กฎการจบเกมพิเศษ (Special End Game Rules)',
      content: '• ประธานาธิบดีปะปนกับฝูงชน (Stalemate / อับ): เกิดขึ้นเมื่อฝ่ายตรงข้ามไม่เหลือตาเดินที่ถูกต้องให้ขยับได้ แต่ไม่ได้อยู่ในระยะถูกรุกฆาต ผลคือเสมอ\n• กองกำลังไม่พอ (Insufficient Material): เกิดขึ้นเมื่อทั้งสองฝ่ายไม่เหลือหมากที่มีกำลังรบเพียงพอที่จะรุกฆาตได้ ผลคือเสมอ',
    },
    {
      title: '5. การทอยเหรียญกำหนดฝ่ายเริ่มเดิน (Coin Toss Initiative)',
      content: 'ในการเริ่มเกมแต่ละศึก ฝั่งที่จะได้เดินก่อนจะตัดสินด้วยการทอยเหรียญ โดยฝ่ายน้ำเงินสามารถเลือกหน้าเหรียญได้ 1 หน้า (หัว หรือ ก้อย) และฝ่ายแดงจะได้รับอีกหน้าโดยอัตโนมัติ (โอกาส 50/50) ฝ่ายที่ทายถูกจะได้สิทธิ์เดินก่อนเสมอ',
    },
    {
      title: '6. โหมดทดสอบกระดานเปล่า (Sandbox / Test Mode)',
      content: 'สามารถสลับเข้าสู่โหมด Sandbox ได้จากแถบเมนูด้านบน เมื่อเริ่มต้น กระดานจะว่างเปล่า และผู้เล่นสามารถคลิกที่ช่องใดก็ได้เพื่อเสกยูนิตของฝ่ายใดก็ได้ออกมาได้อย่างอิสระ เมื่อจัดวางเสร็จแล้ว สามารถกดปุ่ม "เริ่มทดสอบ (Play)" เพื่อเริ่มการเดินหมากจริง โดยจะใช้กติกาการรบ การคุ้มกัน และการรุกฆาตเต็มรูปแบบเช่นเดิม',
    },
  ],
  en: [
    {
      title: '1. Modern Warfare Units',
      content: 'Chess Warfare replaces standard chess pieces with military command units:',
      items: [
        { name: 'President (Supreme Commander - replaces King)', desc: 'Moves 1 step in any direction. Blessed with "Invincible Protection" as long as the First Lady or any Bodyguard remains on the board.' },
        { name: 'First Lady (Elite Escort - replaces Queen)', desc: 'Moves unlimited distance in any direction. Acts as a key security escort for the President.' },
        { name: 'Bodyguard (VIP Protection Agent - replaces Bishop)', desc: 'Moves diagonally. 2 agents provide escort protection to keep the President invincible.' },
        { name: 'Fighter Jet (Air Superiority - replaces Knight)', desc: 'Moves in an L-shape jumping obstacles. Has a 2 board-turn cooldown after deployment.' },
        { name: 'Battle Tank (Heavy Artillery - replaces Rook)', desc: 'Moves orthogonally along ranks and files with unlimited range.' },
        { name: 'Citizen (Militia Infantry - replaces Pawn)', desc: 'Moves 1 forward (2 on first move), captures diagonally. Promotes upon reaching enemy baseline.' },
      ],
    },
    {
      title: '2. Citizen Promotion & 4 Specialized Units',
      content: 'Reaching the enemy back rank allows promoting the Citizen exclusively into 1 of 4 specialized units:',
      items: [
        { name: '1. Brave Soldier', desc: 'Queen mobility with a maximum range cap of 5 squares.' },
        { name: '2. Trainee Pilot', desc: 'Knight mobility with zero cooldown restriction.' },
        { name: '3. Special Police', desc: 'Moves diagonally without capturing. Dashes adjacent to lock the target piece for 1 turn (Target gains lock immunity next turn).' },
        { name: '4. Armored Car', desc: 'Rook mobility with a maximum range cap of 4 squares.' },
      ],
    },
    {
      title: '3. President Invincible Protection & Checkmate Rule',
      content: '• As long as either the First Lady or at least one Bodyguard is alive on the board, that faction\'s President is "INVINCIBLE" and immune to captures or check threats.\n• When all security escorts (First Lady and all Bodyguards) are eliminated, the President becomes "Vulnerable" and can be placed in check or checkmated.',
    },
    {
      title: '4. Special Battle Outcomes',
      content: '• President Blended into the Crowd (Stalemate): Occurs when a player has no legal moves left while their President is not in check. The match ends in a tactical Draw.\n• Insufficient Forces (Draw): Triggered when neither faction retains sufficient pieces on the board to force a checkmate.',
    },
    {
      title: '5. Initiative Coin Toss',
      content: 'Each match begins with a 50/50 Coin Toss. Blue Forces select Heads or Tails; Red Forces receive the alternative. The winner of the toss claims the first-move initiative.',
    },
    {
      title: '6. Sandbox Test Mode',
      content: 'Enter Sandbox mode from the top bar. The board begins completely empty. Click any square to summon any piece for either faction. Press "Play" to test tactical scenarios with complete warfare rules.',
    },
  ],
  ja: [
    {
      title: '1. 軍事戦術ユニット（Warfare Units）',
      content: 'チェスウォーフェアは従来の駒を現代軍事ユニットへと再編しています：',
      items: [
        { name: '大統領（最高指揮官・キング相当）', desc: '周囲1マス移動。ファーストレディまたはボディーガードが盤上にいる限り「無敵保護シールド」が有効。' },
        { name: 'ファーストレディ（要人護衛・クイーン相当）', desc: '全方向無制限移動。大統領の無敵状態を維持する重要護衛ユニット。' },
        { name: 'ボディーガード（警護官・ビショップ相当）', desc: '斜め移動。大統領を警護する2名の精鋭（無敵維持ユニット）。' },
        { name: '戦闘機（制空戦闘機・ナイト相当）', desc: 'L字ジャンプ移動。出撃後、盤上で計2ターン（敵手番含む）のクールダウンが発生。' },
        { name: '主力戦車（重火砲・ルーク相当）', desc: '縦横直線移動。長距離砲撃突撃ユニット。' },
        { name: '市民（民間民兵・ポーン相当）', desc: '前進1マス（初手2マス）。敵陣最奥列到達で特殊ユニットへ昇格。' },
      ],
    },
    {
      title: '2. 市民の昇格（4つの特殊ユニット）',
      content: '市民が敵陣最終列に到達した際、以下の4つの特殊ユニットにのみ昇格可能です：',
      items: [
        { name: '1. 勇敢な兵士（Brave Soldier）', desc: 'クイーンの動き（最大移動射程5マスまで）。' },
        { name: '2. 訓練生パイロット（Trainee Pilot）', desc: 'ナイトの動き（クールダウンなしで毎ターン出撃可能）。' },
        { name: '3. 治安警察（Special Police）', desc: '斜め移動。駒の捕獲は行わず、対象に急行接敵して1ターン行動不能に拘束（拘束解除後は次ターン拘束無効）。' },
        { name: '4. 装甲車（Armored Car）', desc: 'ルークの動き（最大移動射程4マスまで）。' },
      ],
    },
    {
      title: '3. 大統領の無敵保護とチェックメイト規程',
      content: '• 自陣営のファーストレディ、またはボディーガードが1体でも残っている限り、大統領は「無敵（Invincible）」となり、捕獲・チェックされません。\n• 護衛ユニットが全滅すると大統領は「無防備（Vulnerable）」となり、通常のチェス同様チェックメイトの対象となります。',
    },
    {
      title: '4. 特殊決着条項',
      content: '• 大統領が群衆に紛れ込んだ（ステイルメイト）：手番側に合法手が一切なく、大統領に王手がかかっていない場合、引き分けとなります。\n• 戦力不足（Insufficient Forces）：両軍ともに相手をチェックメイト可能な戦力が残っていない場合、引き分けとなります。',
    },
    {
      title: '5. 先手決定コイントス（Initiative）',
      content: '試合開始時に表裏（50/50）のコイントスを実施。青軍が表か裏を選択し、的中させた陣営が先手攻撃権を獲得します。',
    },
    {
      title: '6. サンドボックス・検証モード',
      content: '上部バーからSandboxモードを選択。空の盤面から始まり、マスをクリックして任意の駒を自由召喚。「Play」を押すと実戦ルールで戦術テストを開始できます。',
    },
  ],
  zh: [
    {
      title: '1. 现代军事作战单位 (Warfare Units)',
      content: '本系统将经典国际象棋兵种全面重构为现代化军事战术体系：',
      items: [
        { name: '总统（最高统帅 - 对应国王/King）', desc: '向周围移动1格。只要己方第一夫人或任意保镖存活，便享有“无敌护甲”，免疫将军与吃子。' },
        { name: '第一夫人（核心护卫 - 对应皇后/Queen）', desc: '全方向直线自由移动。维持总统无敌状态的核心保卫单位。' },
        { name: '保镖（贴身安保 - 对应主教/Bishop）', desc: '斜向移动。两名保镖共同构成总统的安保屏障。' },
        { name: '战斗机（空中力量 - 对应马/Knight）', desc: '日字形跳跃移动。出击后需经历2个棋盘回合的战备冷却（计入敌方走子）。' },
        { name: '主战坦克（重装火力 - 对应车/Rook）', desc: '横竖直线无限制移动。' },
        { name: '平民（民兵民勇 - 对应兵/Pawn）', desc: '向前移动1格（首步可走2格），斜向吃子。抵达敌方底线可晋升。' },
      ],
    },
    {
      title: '2. 平民底线晋升（4大特种作战兵种）',
      content: '平民抵达敌阵底线后，仅可晋升为以下4种专属作战单位：',
      items: [
        { name: '1. 勇士 (Brave Soldier)', desc: '具备皇后的机动能力（移动距离上限为5格）。' },
        { name: '2. 实习飞行员 (Trainee Pilot)', desc: '具备马的机动能力（无任何出击冷却限制）。' },
        { name: '3. 特警 (Special Police)', desc: '斜向移动，不吃子；可瞬间突进至目标贴身并锁定目标使其1回合无法移动（被锁单位下回合享有免疫保护）。' },
        { name: '4. 装甲车 (Armored Car)', desc: '具备车的机动能力（移动距离上限为4格）。' },
      ],
    },
    {
      title: '3. 总统无敌护甲与将死判定',
      content: '• 只要己方第一夫人或至少一名保镖在场，总统即处于“绝对无敌（Invincible）”状态，免疫任何将军威胁。\n• 当第一夫人与全部保镖均阵亡后，总统进入“脆弱（Vulnerable）”状态，此时可被将军并判定将死（Checkmate）。',
    },
    {
      title: '4. 特殊战局判定',
      content: '• 总统混入人群中（逼和/Stalemate）：轮到走子的一方无任何合法走法且未被将军，战局判定为平局。\n• 兵力不足（Insufficient Forces）：双方所剩子力均无法强行将死对手时，自动判定为和棋。',
    },
    {
      title: '5. 掷硬币争夺首发先手 (Initiative)',
      content: '每局对弈开局进行50/50概率的掷硬币。蓝方选择正面或反面，猜中方将夺得首回合先手行动权。',
    },
    {
      title: '6. 沙盒战术推演模式 (Sandbox)',
      content: '随时从顶部菜单切换至沙盒模式。棋盘初始为空白，点击任意方格可自由召唤双方单位，点击“开始测试 (Play)”即可按实战规则进行战术验证。',
    },
  ],
};
