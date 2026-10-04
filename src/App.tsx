import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  createInitialBoard,
  createEmptyBoard,
  createCustomPiece,
  getLegalMovesForPiece,
  getVIPStatus,
  getJetsStatus,
  applyMove,
  endTurnMaintenance,
  evaluateGameStatus,
  coordToPos,
  getPieceName,
  Board,
} from './engine/warfareRules';
import { generateTextBasedGrid } from './engine/textGrid';
import { getBestAIMove, AIDifficulty } from './engine/ai';
import { sounds } from './utils/audio';
import {
  Faction,
  Position,
  MoveTarget,
  Piece,
  PieceType,
  Move,
} from './types/chess';
import { useLanguage } from './i18n';
import { Header } from './components/Header';
import { TacticalBoard } from './components/TacticalBoard';
import { MinimalStatus } from './components/MinimalStatus';
import { AdvancedModeDrawer } from './components/AdvancedModeDrawer';
import { PromotionModal } from './components/PromotionModal';
import { RulesModal } from './components/RulesModal';
import { CoinTossModal } from './components/CoinTossModal';
import { PieceSummonModal } from './components/PieceSummonModal';
import { SandboxControls } from './components/SandboxControls';
import { Trophy, RotateCcw, SlidersHorizontal, Users, ShieldAlert } from 'lucide-react';

export default function App() {
  const { lang, t, getPiece, getFactionName, getDifficulty } = useLanguage();

  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [turn, setTurn] = useState<Faction>('white');
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [legalTargets, setLegalTargets] = useState<MoveTarget[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Position;
    to: Position;
  } | null>(null);
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  const [gameMode, setGameMode] = useState<'ai' | 'pvp' | 'sandbox'>('ai');
  const [sandboxState, setSandboxState] = useState<'edit' | 'play'>('edit');
  const [summonSquare, setSummonSquare] = useState<Position | null>(null);
  const [sandboxValidationError, setSandboxValidationError] = useState<string | null>(null);
  const [initialSandboxBoard, setInitialSandboxBoard] = useState<Board | null>(null);

  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('normal');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);
  const [showCoinToss, setShowCoinToss] = useState<boolean>(true);

  // Handle Coin Toss Complete
  const handleCoinTossComplete = (firstTurn: Faction) => {
    setTurn(firstTurn);
    setShowCoinToss(false);
  };

  // Evaluate current game status
  const gameStatus = useMemo(() => {
    // In Sandbox edit mode, the game is in setup phase, not played yet: never evaluate checkmate/game over
    if (gameMode === 'sandbox' && sandboxState === 'edit') {
      const whiteVIP = getVIPStatus(board, 'white');
      const blackVIP = getVIPStatus(board, 'black');
      const whiteJets = getJetsStatus(board, 'white');
      const blackJets = getJetsStatus(board, 'black');
      return {
        turn,
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
    return evaluateGameStatus(board, turn, turnNumber);
  }, [board, turn, turnNumber, gameMode, sandboxState]);

  // Generate text-based grid string
  const textBasedGrid = useMemo(() => {
    return generateTextBasedGrid(board, selectedPos, legalTargets, gameStatus, lang);
  }, [board, selectedPos, legalTargets, gameStatus, lang]);

  // Execute a move
  const executeMove = useCallback(
    (
      from: Position,
      to: Position,
      target: MoveTarget,
      promotionType?: PieceType
    ) => {
      const piece = board[from.row][from.col];
      if (!piece) return;

      const { newBoard, moveDetails, requiresPromotion } = applyMove(
        board,
        from,
        to,
        promotionType,
        lang
      );

      if (requiresPromotion) {
        setPendingPromotion({ from, to });
        return;
      }

      // Track captured pieces
      if (moveDetails.captured && moveDetails.type === 'capture') {
        if (moveDetails.captured.faction === 'white') {
          setCapturedWhite((prev) => [...prev, moveDetails.captured!]);
        } else {
          setCapturedBlack((prev) => [...prev, moveDetails.captured!]);
        }
      }

      // Audio feedback
      if (moveDetails.type === 'lock') {
        sounds.playLock();
      } else if (moveDetails.type === 'capture') {
        sounds.playCapture();
      } else if (moveDetails.type === 'promotion') {
        sounds.playPromotion();
      } else if (piece.type === 'jet') {
        sounds.playJet();
      } else {
        sounds.playMove();
      }

      // Perform maintenance: tick down other Jets' cooldowns and current faction's lockedTurns
      const updatedBoard = endTurnMaintenance(newBoard, turn, piece.id);

      setBoard(updatedBoard);
      setMoveHistory((prev) => [...prev, moveDetails]);
      setSelectedPos(null);
      setLegalTargets([]);

      const nextTurn: Faction = turn === 'white' ? 'black' : 'white';
      const nextTurnNumber = turn === 'black' ? turnNumber + 1 : turnNumber;

      setTurn(nextTurn);
      setTurnNumber(nextTurnNumber);

      // Check if enemy vulnerable president is in check
      const nextStatus = evaluateGameStatus(updatedBoard, nextTurn, nextTurnNumber);
      if (nextStatus.isCheck && !nextStatus.isCheckmate) {
        sounds.playCheck();
      }
    },
    [board, turn, turnNumber, lang]
  );

  // Handle Square Selection / Click
  const handleSelectSquare = useCallback(
    (pos: Position) => {
      // In Sandbox Edit Mode: clicking any square opens piece summoner
      if (gameMode === 'sandbox' && sandboxState === 'edit') {
        setSummonSquare(pos);
        return;
      }

      if (
        gameStatus.isCheckmate ||
        gameStatus.isStalemate ||
        gameStatus.isInsufficientMaterial ||
        isAIThinking
      ) {
        return;
      }
      if (gameMode === 'ai' && turn === 'black') return;

      const clickedPiece = board[pos.row][pos.col];

      // If user clicks a target square of currently selected piece
      if (selectedPos) {
        const target = legalTargets.find(
          (t) => t.pos.row === pos.row && t.pos.col === pos.col
        );

        if (target) {
          executeMove(selectedPos, pos, target);
          return;
        }
      }

      // Otherwise, selecting a new piece
      if (clickedPiece && clickedPiece.faction === turn) {
        if (clickedPiece.lockedTurns > 0) {
          // Locked by police
          sounds.playSelect();
          setSelectedPos(pos);
          setLegalTargets([]);
          return;
        }

        if (clickedPiece.type === 'jet' && clickedPiece.cooldown > 0) {
          // Jet in cooldown
          sounds.playSelect();
          setSelectedPos(pos);
          setLegalTargets([]);
          return;
        }

        const targets = getLegalMovesForPiece(board, pos, turn);
        sounds.playSelect();
        setSelectedPos(pos);
        setLegalTargets(targets);
      } else {
        // Deselect
        setSelectedPos(null);
        setLegalTargets([]);
      }
    },
    [
      board,
      turn,
      selectedPos,
      legalTargets,
      gameStatus.isCheckmate,
      gameStatus.isStalemate,
      gameStatus.isInsufficientMaterial,
      isAIThinking,
      gameMode,
      sandboxState,
      executeMove,
    ]
  );

  // Handle Promotion Selection
  const handleSelectPromotion = (promoType: PieceType) => {
    if (!pendingPromotion) return;
    const { from, to } = pendingPromotion;
    const piece = board[from.row][from.col];
    if (!piece) return;

    const target: MoveTarget = {
      pos: to,
      type: board[to.row][to.col] ? 'capture' : 'move',
      targetPiece: board[to.row][to.col] || undefined,
    };

    setPendingPromotion(null);
    executeMove(from, to, target, promoType);
  };

  // AI Turn Loop
  useEffect(() => {
    if (
      !showCoinToss &&
      gameMode === 'ai' &&
      turn === 'black' &&
      !gameStatus.isCheckmate &&
      !gameStatus.isStalemate &&
      !isAIThinking
    ) {
      setIsAIThinking(true);
      const thinkDelay = aiDifficulty === 'expert' ? 700 : aiDifficulty === 'normal' ? 500 : 350;
      const timer = setTimeout(() => {
        const aiChoice = getBestAIMove(board, 'black', turnNumber, aiDifficulty);
        if (aiChoice) {
          executeMove(
            aiChoice.from,
            aiChoice.to,
            aiChoice.target,
            aiChoice.promotionType
          );
        }
        setIsAIThinking(false);
      }, thinkDelay);

      return () => clearTimeout(timer);
    }
  }, [
    showCoinToss,
    gameMode,
    aiDifficulty,
    turn,
    board,
    turnNumber,
    gameStatus.isCheckmate,
    gameStatus.isStalemate,
    isAIThinking,
    executeMove,
  ]);

  // Execute Command Line String
  const handleExecuteCommand = (cmd: string): string => {
    const cleanCmd = cmd.trim().toLowerCase();

    if (cleanCmd === 'status') {
      const currentVIP = turn === 'white' ? gameStatus.whiteVIP : gameStatus.blackVIP;
      const fName = getFactionName(turn);
      const invStr = currentVIP.isPresidentInvincible ? `🛡️ ${t('invincibleGuard')}` : `⚠️ ${t('vulnerableKing')}`;
      const flStr = currentVIP.firstLadyAlive ? t('alive') : t('eliminated');
      const chkStr = gameStatus.isCheck ? t('checkAlert') : 'OK';

      return `${t('drawerTitle')}:
- ${t('turnLabel')}: #${turnNumber} (${fName})
- ${t('invincibleGuard')}: ${invStr}
- ${t('firstLadyStatus')}: ${flStr}
- ${t('bodyguardsRemaining')}: ${currentVIP.bodyguardsRemaining}
- Check: ${chkStr}`;
    }

    if (cleanCmd === 'reset') {
      handleResetGame();
      return lang === 'en' ? 'Game reset successfully' : lang === 'ja' ? 'リセットが完了しました' : lang === 'zh' ? '棋局已成功重置' : 'ระบบทำการรีเซ็ตกระดานเรียบร้อย';
    }

    // Select command: "select e2" or "view e2"
    if (cleanCmd.startsWith('select ') || cleanCmd.startsWith('view ')) {
      const coord = cleanCmd.split(' ')[1];
      const pos = coordToPos(coord);
      if (!pos) return `❌ ${lang === 'en' ? 'Invalid coordinate' : 'พิกัดไม่ถูกต้อง'} "${coord}"`;
      const p = board[pos.row][pos.col];
      if (!p) return `❌ ${lang === 'en' ? 'No piece at' : 'ไม่มีหมากที่พิกัด'} ${coord}`;
      if (p.faction !== turn) return `❌ ${lang === 'en' ? 'Cannot select opponent piece' : 'ไม่สามารถเลือกหมากของฝ่ายตรงข้ามได้'}`;

      if (p.lockedTurns > 0) return `❌ ${t('lockedTooltip')}`;
      if (p.type === 'jet' && p.cooldown > 0) {
        return `❌ ${t('jetCooldownTooltip', { turns: p.cooldown })}`;
      }

      const targets = getLegalMovesForPiece(board, pos, turn);
      setSelectedPos(pos);
      setLegalTargets(targets);
      sounds.playSelect();
      const pName = getPiece(p.type).name;
      return `${lang === 'en' ? 'Selected' : 'เลือก'} ${pName} @ ${coord} (${targets.length} ${lang === 'en' ? 'legal moves' : 'ตาเดิน'})`;
    }

    // Lock command: "lock e5"
    if (cleanCmd.startsWith('lock ')) {
      const coord = cleanCmd.split(' ')[1];
      const targetPos = coordToPos(coord);
      if (!targetPos) return `❌ ${lang === 'en' ? 'Invalid coordinate' : 'พิกัดไม่ถูกต้อง'} "${coord}"`;
      if (!selectedPos) return `❌ ${lang === 'en' ? 'Please select Police unit first' : 'กรุณาเลือกตำรวจ (Police) ก่อนทำการล็อกเป้าหมาย'}`;

      const target = legalTargets.find(
        (t) => t.pos.row === targetPos.row && t.pos.col === targetPos.col && t.type === 'lock'
      );
      if (!target) return `❌ ${lang === 'en' ? 'Target cannot be locked' : 'ไม่สามารถล็อกเป้าหมายที่'} ${coord}`;

      executeMove(selectedPos, targetPos, target);
      return `🔒 ${lang === 'en' ? 'Target locked successfully' : 'ทำการล็อกเป้าหมายเรียบร้อย'} @ ${coord}`;
    }

    // Move command: "move e2 e4" or "e2e4" or "e2-e4"
    let fromCoord = '';
    let toCoord = '';

    const parts = cleanCmd.replace('move ', '').replace('-', ' ').split(/\s+/);
    if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 2) {
      fromCoord = parts[0];
      toCoord = parts[1];
    } else if (cleanCmd.length === 4) {
      fromCoord = cleanCmd.substring(0, 2);
      toCoord = cleanCmd.substring(2, 4);
    }

    if (fromCoord && toCoord) {
      const fromPos = coordToPos(fromCoord);
      const toPos = coordToPos(toCoord);

      if (!fromPos) return `❌ ${lang === 'en' ? 'Invalid origin' : 'พิกัดต้นทางไม่ถูกต้อง'} "${fromCoord}"`;
      if (!toPos) return `❌ ${lang === 'en' ? 'Invalid destination' : 'พิกัดปลายทางไม่ถูกต้อง'} "${toCoord}"`;

      const piece = board[fromPos.row][fromPos.col];
      if (!piece) return `❌ ${lang === 'en' ? 'No piece at' : 'ไม่มีหมากที่ช่อง'} ${fromCoord}`;
      if (piece.faction !== turn) return `❌ ${lang === 'en' ? 'Not your piece at' : 'ไม่ใช่หมากของฝ่ายคุณที่'} ${fromCoord}`;

      if (piece.lockedTurns > 0) return `❌ ${t('lockedTooltip')}`;
      if (piece.type === 'jet' && piece.cooldown > 0) {
        return `❌ ${t('jetCooldownTooltip', { turns: piece.cooldown })}`;
      }

      const targets = getLegalMovesForPiece(board, fromPos, turn);
      const validTarget = targets.find((t) => t.pos.row === toPos.row && t.pos.col === toPos.col);

      if (!validTarget) {
        if (piece.type === 'president') {
          return `❌ ${lang === 'en' ? 'President cannot move into attacked squares even when invincible' : 'ไม่สามารถเดิน President เข้าไปในช่องที่อยู่ในอำนาจโจมตีของข้าศึกได้'}`;
        }
        return `❌ ${lang === 'en' ? 'Illegal move' : 'ตาเดินผิดกติกา'}: ${fromCoord} -> ${toCoord}`;
      }

      executeMove(fromPos, toPos, validTarget);
      return `✓ ${fromCoord} -> ${toCoord}`;
    }

    return `❌ ${lang === 'en' ? 'Command not recognized. Type "help" for options.' : 'ไม่เข้าใจคำสั่ง พิมพ์ "help" เพื่อดูรายการ'}`;
  };

  // Sandbox actions
  const handleSummonPiece = (pos: Position, type: PieceType, faction: Faction) => {
    const newBoard = board.map((r) => [...r]);
    newBoard[pos.row][pos.col] = createCustomPiece(type, faction);
    setBoard(newBoard);
    setSandboxValidationError(null);
    sounds.playMove();
  };

  const handleRemovePiece = (pos: Position) => {
    const newBoard = board.map((r) => [...r]);
    newBoard[pos.row][pos.col] = null;
    setBoard(newBoard);
    sounds.playSelect();
  };

  const handleToggleSandboxState = () => {
    if (sandboxState === 'edit') {
      // Validate
      let whiteKings = 0;
      let blackKings = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p?.type === 'president') {
            if (p.faction === 'white') whiteKings++;
            else blackKings++;
          }
        }
      }

      if (whiteKings !== 1 || blackKings !== 1) {
        setSandboxValidationError(t('sandboxValidationError'));
        sounds.playCheck();
        return;
      }

      setSandboxValidationError(null);
      setInitialSandboxBoard(board.map((r) => [...r]));
      setSandboxState('play');
      sounds.playCoinWin();
    } else {
      setSandboxState('edit');
      setSelectedPos(null);
      setLegalTargets([]);
      sounds.playSelect();
    }
  };

  const handleResetTestPlay = () => {
    if (initialSandboxBoard) {
      setBoard(initialSandboxBoard.map((r) => [...r]));
    }
    setTurnNumber(1);
    setSelectedPos(null);
    setLegalTargets([]);
    setPendingPromotion(null);
    sounds.playSelect();
  };

  const handleClearBoard = () => {
    setBoard(createEmptyBoard());
    setSelectedPos(null);
    setLegalTargets([]);
    sounds.playSelect();
  };

  const handleLoadStandardBoard = () => {
    setBoard(createInitialBoard());
    setSelectedPos(null);
    setLegalTargets([]);
    sounds.playSelect();
  };

  const handleSelectGameMode = (mode: 'ai' | 'pvp' | 'sandbox') => {
    setGameMode(mode);
    if (mode === 'sandbox') {
      setSandboxState('edit');
      setBoard(createEmptyBoard());
      setTurn('white');
      setTurnNumber(1);
      setSelectedPos(null);
      setLegalTargets([]);
      setPendingPromotion(null);
      setCapturedWhite([]);
      setCapturedBlack([]);
      setMoveHistory([]);
      setShowCoinToss(false);
      setInitialSandboxBoard(null);
      setSandboxValidationError(null);
    } else {
      setBoard(createInitialBoard());
      setTurn('white');
      setTurnNumber(1);
      setSelectedPos(null);
      setLegalTargets([]);
      setPendingPromotion(null);
      setCapturedWhite([]);
      setCapturedBlack([]);
      setMoveHistory([]);
      setShowCoinToss(true);
      setSandboxValidationError(null);
    }
  };

  const handleToggleGameMode = () => {
    const nextMode = gameMode === 'ai' ? 'pvp' : gameMode === 'pvp' ? 'sandbox' : 'ai';
    handleSelectGameMode(nextMode);
  };

  // Reset Game
  const handleResetGame = () => {
    if (gameMode === 'sandbox') {
      setSandboxState('edit');
      setBoard(createEmptyBoard());
      setTurn('white');
      setTurnNumber(1);
      setSelectedPos(null);
      setLegalTargets([]);
      setPendingPromotion(null);
      setCapturedWhite([]);
      setCapturedBlack([]);
      setMoveHistory([]);
      setIsAIThinking(false);
      setShowCoinToss(false);
      setInitialSandboxBoard(null);
      setSandboxValidationError(null);
    } else {
      setBoard(createInitialBoard());
      setTurn('white');
      setTurnNumber(1);
      setSelectedPos(null);
      setLegalTargets([]);
      setPendingPromotion(null);
      setCapturedWhite([]);
      setCapturedBlack([]);
      setMoveHistory([]);
      setIsAIThinking(false);
      setShowCoinToss(true);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header with Advanced Mode Toggle Button, Language Selector & Difficulty */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReset={handleResetGame}
        onOpenCoinToss={() => setShowCoinToss(true)}
        gameMode={gameMode}
        onSelectGameMode={handleSelectGameMode}
        onToggleGameMode={handleToggleGameMode}
        difficulty={aiDifficulty}
        onChangeDifficulty={setAiDifficulty}
        onOpenRules={() => setRulesOpen(true)}
        isAdvancedOpen={isAdvancedOpen}
        onToggleAdvanced={() => setIsAdvancedOpen((prev) => !prev)}
        movesCount={moveHistory.length}
      />

      {/* Main Playfield: Clean, Centered, Focused on the Board */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-5 max-w-4xl mx-auto w-full gap-3">
        {/* Minimalist Status Header */}
        <MinimalStatus
          gameStatus={gameStatus}
          capturedWhite={capturedWhite}
          capturedBlack={capturedBlack}
        />

        {/* Sandbox Mode Controls */}
        {gameMode === 'sandbox' && (
          <SandboxControls
            sandboxState={sandboxState}
            onToggleSandboxState={handleToggleSandboxState}
            board={board}
            currentTurn={turn}
            onChangeTurn={setTurn}
            onClearBoard={handleClearBoard}
            onLoadStandardBoard={handleLoadStandardBoard}
            onResetTestPlay={handleResetTestPlay}
            validationError={sandboxValidationError}
          />
        )}

        {/* Mobile Difficulty Selector (shows on small screens when in AI mode) */}
        {gameMode === 'ai' && (
          <div className="flex sm:hidden items-center justify-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="text-[10px] text-slate-400 mr-1">{t('difficulty')}:</span>
            {(['easy', 'normal', 'expert'] as AIDifficulty[]).map((level) => {
              const isActive = aiDifficulty === level;
              const meta = getDifficulty(level);
              return (
                <button
                  key={level}
                  onClick={() => setAiDifficulty(level)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                    isActive
                      ? level === 'expert'
                        ? 'bg-rose-950 text-rose-300 font-bold border border-rose-600'
                        : level === 'normal'
                        ? 'bg-amber-950 text-amber-300 font-bold border border-amber-600'
                        : 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-600'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {meta.name}
                </button>
              );
            })}
          </div>
        )}

        {/* AI Thinking Notice with Level Details */}
        {isAIThinking && (
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-950/70 border border-rose-800/90 rounded-full text-rose-300 font-mono text-xs animate-pulse shadow-md">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            <span>
              {t('aiThinkingNotice', {
                difficulty: getDifficulty(aiDifficulty).name,
                desc: getDifficulty(aiDifficulty).desc,
              })}
            </span>
          </div>
        )}

        {/* 8x8 Tactical Warfare Chessboard with Check Shake Effect */}
        <div className="flex flex-col items-center">
          <TacticalBoard
            board={board}
            selectedPos={selectedPos}
            legalTargets={legalTargets}
            onSelectSquare={handleSelectSquare}
            whiteVIP={gameStatus.whiteVIP}
            blackVIP={gameStatus.blackVIP}
            isCheck={gameStatus.isCheck}
            currentTurn={turn}
            disabled={isAIThinking || (gameMode !== 'sandbox' && gameStatus.isCheckmate)}
            isSandboxEdit={gameMode === 'sandbox' && sandboxState === 'edit'}
          />

          {/* Quick legend and Advanced Mode prompt */}
          <div className="mt-2.5 flex items-center justify-between w-full max-w-md px-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="text-amber-400 font-bold">[ • ]</span>
                <span>{t('legendMove')}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-rose-400 font-bold">[*X*]</span>
                <span>{t('legendCapture')}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-cyan-400 font-bold">[🔒X🔒]</span>
                <span>{t('legendLock')}</span>
              </span>
            </div>

            <button
              onClick={() => setIsAdvancedOpen(true)}
              className="text-amber-400/80 hover:text-amber-300 transition-colors flex items-center gap-1 hover:underline"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{t('combatLogPrompt')}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Advanced Mode Slide-Over Drawer (บันทึกการเดิน, Text Grid, คอนโซล) */}
      <AdvancedModeDrawer
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        moves={moveHistory}
        textContent={textBasedGrid}
        onExecuteCommand={handleExecuteCommand}
        onOpenRules={() => setRulesOpen(true)}
      />

      {/* Citizen Promotion Modal */}
      <PromotionModal
        isOpen={pendingPromotion !== null}
        onSelectPromotion={handleSelectPromotion}
      />

      {/* Coin Toss Initiative Modal */}
      <CoinTossModal
        isOpen={showCoinToss}
        gameMode={gameMode}
        onComplete={handleCoinTossComplete}
      />

      {/* Rules & Warfare Manual Modal */}
      <RulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />

      {/* Sandbox Piece Summon Modal */}
      <PieceSummonModal
        isOpen={summonSquare !== null}
        pos={summonSquare}
        currentPiece={summonSquare ? board[summonSquare.row][summonSquare.col] : null}
        onSummon={handleSummonPiece}
        onRemove={handleRemovePiece}
        onClose={() => setSummonSquare(null)}
      />

      {/* Game Over Modal (Checkmate, Stalemate, Insufficient Material) */}
      {!(gameMode === 'sandbox' && sandboxState === 'edit') &&
        (gameStatus.isCheckmate || gameStatus.isStalemate || gameStatus.isInsufficientMaterial) && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-md w-full p-6 text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center mx-auto mb-4">
                {gameStatus.isCheckmate ? (
                  <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
                ) : gameStatus.isStalemate ? (
                  <Users className="w-8 h-8 text-cyan-400" />
                ) : (
                  <ShieldAlert className="w-8 h-8 text-amber-400" />
                )}
              </div>

              <div className="font-mono text-xs text-amber-400 font-bold tracking-widest uppercase">
                {gameStatus.isCheckmate
                  ? t('reportCheckmate')
                  : gameStatus.isStalemate
                  ? t('reportStalemate')
                  : t('reportInsufficient')}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {gameStatus.isCheckmate
                  ? gameStatus.winner === 'white'
                    ? t('winBlue')
                    : t('winRed')
                  : gameStatus.isStalemate
                  ? t('stalemateTitle')
                  : t('insufficientTitle')}
              </h2>

              <p className="text-xs text-slate-300 mt-2 font-mono leading-relaxed">
                {gameStatus.isCheckmate
                  ? t('checkmateDesc')
                  : gameStatus.isStalemate
                  ? t('stalemateDesc')
                  : t('insufficientDesc')}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {gameMode === 'sandbox' ? (
                  <>
                    <button
                      onClick={() => {
                        setSandboxState('edit');
                        setSelectedPos(null);
                        setLegalTargets([]);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-colors shadow"
                    >
                      <span>{t('editSetupBtn')}</span>
                    </button>
                    <button
                      onClick={handleResetTestPlay}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('retryTestBtn')}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleResetGame}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('playAgainBtn')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
