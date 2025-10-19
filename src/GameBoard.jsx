import { useState, useEffect, useCallback } from "react";

export default function GameBoard({ selectedMark, gameMode, onQuit }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("x"); // X always starts first
  const [isGameActive, setIsGameActive] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ x: 0, o: 0, ties: 0 });
  const [showRestartModal, setShowRestartModal] = useState(false);

  const checkWinner = useCallback((boardState) => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return { winner: boardState[a], line: pattern };
      }
    }
    if (boardState.every((cell) => cell !== null)) {
      return { winner: "tie", line: [] };
    }
    return null;
  }, []);

  const handleCellClick = (index) => {
    // Basic validation - same for both modes
    if (board[index] || !isGameActive || winner) return;

    // In CPU mode, only allow moves when it's the player's turn
    if (gameMode === "cpu" && currentPlayer !== selectedMark) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setIsGameActive(false);

      // Update scores
      if (result.winner === "tie") {
        setScores((prev) => ({ ...prev, ties: prev.ties + 1 }));
      } else {
        setScores((prev) => ({
          ...prev,
          [result.winner]: prev[result.winner] + 1,
        }));
      }
    } else {
      // Switch turns between X and O
      setCurrentPlayer(currentPlayer === "x" ? "o" : "x");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("x"); // X always starts first
    setIsGameActive(true);
    setWinner(null);
    setWinningLine([]);
  };

  const handleRestartClick = () => {
    setShowRestartModal(true);
  };

  const handleRestartConfirm = () => {
    setShowRestartModal(false);
    onQuit(); // Go back to starting screen
  };

  const handleRestartCancel = () => {
    setShowRestartModal(false);
  };

  // CPU turn effect
  useEffect(() => {
    // Only run CPU logic in CPU mode
    if (gameMode !== "cpu") return;

    const cpuMark = selectedMark === "x" ? "o" : "x";

    if (currentPlayer === cpuMark && isGameActive && !winner) {
      // CPU move logic
      const makeCpuMove = (boardState) => {
        const playerMark = selectedMark;

        // Check if CPU can win
        for (let i = 0; i < 9; i++) {
          if (!boardState[i]) {
            const testBoard = [...boardState];
            testBoard[i] = cpuMark;
            if (checkWinner(testBoard)?.winner === cpuMark) {
              return i;
            }
          }
        }

        // Check if CPU needs to block player from winning
        for (let i = 0; i < 9; i++) {
          if (!boardState[i]) {
            const testBoard = [...boardState];
            testBoard[i] = playerMark;
            if (checkWinner(testBoard)?.winner === playerMark) {
              return i;
            }
          }
        }

        // Take center if available
        if (!boardState[4]) {
          return 4;
        }

        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter((i) => !boardState[i]);
        if (availableCorners.length > 0) {
          return availableCorners[
            Math.floor(Math.random() * availableCorners.length)
          ];
        }

        // Take any available spot
        const availableSpots = boardState
          .map((spot, index) => (spot === null ? index : null))
          .filter((spot) => spot !== null);
        return availableSpots[
          Math.floor(Math.random() * availableSpots.length)
        ];
      };

      const timer = setTimeout(() => {
        const cpuMove = makeCpuMove(board);
        if (cpuMove !== undefined) {
          const newBoard = [...board];
          newBoard[cpuMove] = cpuMark;
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
            setIsGameActive(false);

            // Update scores
            if (result.winner === "tie") {
              setScores((prev) => ({ ...prev, ties: prev.ties + 1 }));
            } else {
              setScores((prev) => ({
                ...prev,
                [result.winner]: prev[result.winner] + 1,
              }));
            }
          } else {
            // Switch turns between X and O
            setCurrentPlayer(cpuMark === "x" ? "o" : "x");
          }
        }
      }, 1000); // 1 second delay for CPU move

      return () => clearTimeout(timer);
    }
  }, [
    currentPlayer,
    board,
    isGameActive,
    winner,
    selectedMark,
    gameMode,
    checkWinner,
  ]);

  const renderCellContent = (cellValue, isWinning = false) => {
    if (!cellValue) return null;

    const iconColor = isWinning
      ? "#1a2a33"
      : cellValue === "x"
      ? "#31c3bd"
      : "#f2b137";

    if (cellValue === "x") {
      return (
        <>
          {/* Filled X - visible by default */}
          <svg
            className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 group-hover:opacity-0 transition-opacity'
            viewBox='0 0 64 64'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z'
              fill={iconColor}
              fillRule='evenodd'
            />
          </svg>
          {/* Outline X - visible on hover (from icon-x-outline.svg) */}
          <svg
            className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 absolute opacity-0 group-hover:opacity-100 transition-opacity'
            viewBox='0 0 64 64'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M51.12 1.269c.511 0 1.023.195 1.414.586l9.611 9.611c.391.391.586.903.586 1.415s-.195 1.023-.586 1.414L44.441 32l17.704 17.705c.391.39.586.902.586 1.414 0 .512-.195 1.024-.586 1.415l-9.611 9.611c-.391.391-.903.586-1.415.586a1.994 1.994 0 0 1-1.414-.586L32 44.441 14.295 62.145c-.39.391-.902.586-1.414.586a1.994 1.994 0 0 1-1.415-.586l-9.611-9.611a1.994 1.994 0 0 1-.586-1.415c0-.512.195-1.023.586-1.414L19.559 32 1.855 14.295a1.994 1.994 0 0 1-.586-1.414c0-.512.195-1.024.586-1.415l9.611-9.611c.391-.391.903-.586 1.415-.586s1.023.195 1.414.586L32 19.559 49.705 1.855c.39-.391.902-.586 1.414-.586Z'
              stroke='#31C3BD'
              strokeWidth='2'
              fill='none'
            />
          </svg>
        </>
      );
    } else {
      return (
        <>
          {/* Filled O - visible by default */}
          <svg
            className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 group-hover:opacity-0 transition-opacity'
            viewBox='0 0 64 64'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z'
              fill={iconColor}
            />
          </svg>
          {/* Outline O - visible on hover (from icon-o-outline.svg) */}
          <svg
            className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 absolute opacity-0 group-hover:opacity-100 transition-opacity'
            viewBox='0 0 66 66'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M33 1c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C15.327 65 1 50.673 1 33 1 15.327 15.327 1 33 1Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z'
              stroke='#F2B137'
              strokeWidth='2'
              fill='none'
            />
          </svg>
        </>
      );
    }
  };

  return (
    <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[460px] mx-auto flex flex-col items-center gap-4 sm:gap-6 relative'>
      {/* Header row */}
      <div className='grid grid-cols-3 w-full mb-2 sm:mb-4 items-center'>
        <div className='flex justify-start'>
          <img
            src='/src/assets/logo.svg'
            alt='Tic-tac-toe game logo featuring X and O symbols in a playful design'
            className='w-12 h-5 sm:w-16 md:w-18 lg:w-[72px] lg:h-8'
          />
        </div>
        <div className='flex justify-center'>
          <div className='bg-[#1f3641] rounded-lg flex items-center justify-center text-[#a8bfc9] font-bold shadow-[0_4px_0_#10212a] gap-1 sm:gap-2 w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] h-10 sm:h-12 text-xs sm:text-sm lg:text-base'>
            {currentPlayer === "x" ? (
              <svg
                className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6'
                viewBox='0 0 64 64'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z'
                  fill='#a8bfc9'
                  fillRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6'
                viewBox='0 0 64 64'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z'
                  fill='#a8bfc9'
                />
              </svg>
            )}
            TURN
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            className='bg-[#a8bfc9] rounded-lg p-2 sm:p-2.5 flex items-center justify-center cursor-pointer shadow-[0_4px_0_#6d8b99] hover:bg-[#c5d2dc] transition-colors'
            onClick={handleRestartClick}
          >
            <svg
              className='w-4 h-4 sm:w-5 sm:h-5'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path
                d='M19.524 0h-1.88a.476.476 0 0 0-.476.499l.159 3.284A9.81 9.81 0 0 0 9.835.317C4.415.317-.004 4.743 0 10.167.004 15.597 4.406 20 9.835 20a9.796 9.796 0 0 0 6.59-2.536.476.476 0 0 0 .019-.692l-1.348-1.349a.476.476 0 0 0-.65-.022 6.976 6.976 0 0 1-9.85-.63 6.987 6.987 0 0 1 .63-9.857 6.976 6.976 0 0 1 10.403 1.348l-4.027-.193a.476.476 0 0 0-.498.476v1.881c0 .263.213.476.476.476h7.944A.476.476 0 0 0 20 8.426V.476A.476.476 0 0 0 19.524 0Z'
                fill='#1F3641'
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Game grid */}
      <div className='grid grid-cols-3 gap-3 sm:gap-4 w-full'>
        {board.map((cellValue, i) => {
          const isWinningCell = winningLine.includes(i);
          const winningCellBg =
            winner === "x"
              ? "bg-[#31c3bd]"
              : winner === "o"
              ? "bg-[#f2b137]"
              : "bg-[#1f3641]";

          return (
            <div
              key={i}
              className={`${
                isWinningCell ? winningCellBg : "bg-[#1f3641]"
              } rounded-xl aspect-square flex items-center justify-center shadow-[0_8px_0_#10212a] cursor-pointer hover:bg-[#2a4a56] transition-colors relative group`}
              onClick={() => handleCellClick(i)}
            >
              {renderCellContent(cellValue, isWinningCell)}
            </div>
          );
        })}
      </div>
      {/* Score row */}
      <div className='flex w-full gap-2 sm:gap-4 mt-4 sm:mt-6'>
        <div className='flex-1 bg-[#31c3bd] rounded-lg sm:rounded-xl py-2 sm:py-3 text-center text-[#1a2a33] font-bold text-xs sm:text-sm md:text-base'>
          {gameMode === "player"
            ? selectedMark === "x"
              ? "X (P1)"
              : "X (P2)"
            : selectedMark === "x"
            ? "X (YOU)"
            : "X (CPU)"}
          <div className='text-lg sm:text-xl lg:text-2xl mt-1'>{scores.x}</div>
        </div>
        <div className='flex-1 bg-[#a8bfc9] rounded-lg sm:rounded-xl py-2 sm:py-3 text-center text-[#1a2a33] font-bold text-xs sm:text-sm md:text-base'>
          TIES
          <div className='text-lg sm:text-xl lg:text-2xl mt-1'>
            {scores.ties}
          </div>
        </div>
        <div className='flex-1 bg-[#f2b137] rounded-lg sm:rounded-xl py-2 sm:py-3 text-center text-[#1a2a33] font-bold text-xs sm:text-sm md:text-base'>
          {gameMode === "player"
            ? selectedMark === "o"
              ? "O (P1)"
              : "O (P2)"
            : selectedMark === "o"
            ? "O (YOU)"
            : "O (CPU)"}
          <div className='text-lg sm:text-xl lg:text-2xl mt-1'>{scores.o}</div>
        </div>
      </div>

      {/* Restart Confirmation Modal */}
      {showRestartModal && (
        <>
          <div className='fixed inset-0 bg-black/60 z-40 pointer-events-none'></div>
          <div className='fixed inset-0 flex items-center justify-center z-50'>
            <div className='bg-[#1f3641] rounded-xl p-8 sm:p-12 text-center w-full mx-4 shadow-2xl pointer-events-auto'>
              <div className='text-[#a8bfc9] text-sm sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10'>
                RESTART GAME?
              </div>

              <div className='flex gap-2 sm:gap-3 justify-center'>
                <button
                  className='bg-[#a8bfc9] hover:bg-[#c5d2dc] text-[#1a2a33] font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-xs sm:text-sm md:text-base'
                  onClick={handleRestartCancel}
                >
                  NO, CANCEL
                </button>
                <button
                  className='bg-[#f2b137] hover:bg-[#f5c563] text-[#1a2a33] font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-xs sm:text-sm md:text-base'
                  onClick={handleRestartConfirm}
                >
                  YES, RESTART
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Win Modal */}
      {winner && (
        <>
          <div className='fixed inset-0 bg-black/60 z-40 pointer-events-none'></div>
          <div className='fixed inset-0 flex items-center justify-center z-50'>
            <div className='bg-[#1f3641] rounded-xl p-8 sm:p-12 text-center w-full mx-4 shadow-2xl pointer-events-auto'>
              {winner === "tie" ? (
                <>
                  <div className='text-[#a8bfc9] text-sm sm:text-base md:text-2xl lg:text-3xl font-bold mb-8 sm:mb-10'>
                    ROUND TIED
                  </div>
                </>
              ) : (
                <>
                  <div className='text-[#a8bfc9] text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-4'>
                    {gameMode === "player"
                      ? winner === selectedMark
                        ? "PLAYER 1 WINS!"
                        : "PLAYER 2 WINS!"
                      : winner === selectedMark
                      ? "YOU WON!"
                      : "OH NO, YOU LOST..."}
                  </div>
                  <div className='flex items-center justify-center gap-2 mb-8 sm:mb-10'>
                    {winner === "x" ? (
                      <svg
                        className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12'
                        viewBox='0 0 64 64'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z'
                          fill='#31c3bd'
                          fillRule='evenodd'
                        />
                      </svg>
                    ) : (
                      <svg
                        width='32'
                        height='32'
                        viewBox='0 0 64 64'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z'
                          fill='#f2b137'
                        />
                      </svg>
                    )}
                    <span
                      className={`text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold ${
                        winner === "x" ? "text-[#31c3bd]" : "text-[#f2b137]"
                      }`}
                    >
                      TAKES THE ROUND
                    </span>
                  </div>
                </>
              )}

              <div className='flex gap-3 justify-center'>
                <button
                  className='bg-[#a8bfc9] hover:bg-[#c5d2dc] text-[#1a2a33] font-bold py-3 px-6 rounded-lg transition-colors text-xs sm:text-sm md:text-base'
                  onClick={onQuit}
                >
                  QUIT
                </button>
                <button
                  className='bg-[#f2b137] hover:bg-[#f5c563] text-[#1a2a33] font-bold py-3 px-6 rounded-lg transition-colors text-xs sm:text-sm md:text-base'
                  onClick={resetGame}
                >
                  NEXT ROUND
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
