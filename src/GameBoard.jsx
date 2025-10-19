import { useState } from "react";

export default function GameBoard({ selectedMark, onQuit }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(selectedMark);
  const [isGameActive, setIsGameActive] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ x: 0, o: 0, ties: 0 });

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

  const checkWinner = (boardState) => {
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
  };

  const handleCellClick = (index) => {
    if (board[index] || !isGameActive || winner) return;

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
      // Switch turns
      setCurrentPlayer(currentPlayer === "x" ? "o" : "x");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(selectedMark);
    setIsGameActive(true);
    setWinner(null);
    setWinningLine([]);
  };

  const renderCellContent = (cellValue, isWinning = false) => {
    if (!cellValue) return null;

    const iconColor = isWinning
      ? "#1a2a33"
      : cellValue === "x"
      ? "#31c3bd"
      : "#f2b137";

    if (cellValue === "x") {
      return (
        <svg
          width='40'
          height='40'
          viewBox='0 0 64 64'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z'
            fill={iconColor}
            fillRule='evenodd'
          />
        </svg>
      );
    } else {
      return (
        <svg
          width='40'
          height='40'
          viewBox='0 0 64 64'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z'
            fill={iconColor}
          />
        </svg>
      );
    }
  };

  return (
    <div className='w-full max-w-[460px] mx-auto flex flex-col items-center gap-6 relative'>
      {/* Header row */}
      <div className='grid grid-cols-3 w-full mb-4 items-center'>
        <div className='flex justify-start'>
          <img
            src='/src/assets/logo.svg'
            alt='Tic-tac-toe game logo featuring X and O symbols in a playful design'
            width={72}
            height={32}
          />
        </div>
        <div className='flex justify-center'>
          <div className='bg-[#1f3641] rounded-lg flex items-center justify-center text-[#a8bfc9] font-bold shadow-[0_4px_0_#10212a] gap-2 w-full max-w-[140px] h-12'>
            {currentPlayer === "x" ? (
              <svg
                width='24'
                height='24'
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
                width='24'
                height='24'
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
          <button className='bg-[#a8bfc9] rounded-lg p-2.5 flex items-center justify-center cursor-pointer shadow-[0_4px_0_#6d8b99]'>
            <svg width='20' height='20' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M19.524 0h-1.88a.476.476 0 0 0-.476.499l.159 3.284A9.81 9.81 0 0 0 9.835.317C4.415.317-.004 4.743 0 10.167.004 15.597 4.406 20 9.835 20a9.796 9.796 0 0 0 6.59-2.536.476.476 0 0 0 .019-.692l-1.348-1.349a.476.476 0 0 0-.65-.022 6.976 6.976 0 0 1-9.85-.63 6.987 6.987 0 0 1 .63-9.857 6.976 6.976 0 0 1 10.403 1.348l-4.027-.193a.476.476 0 0 0-.498.476v1.881c0 .263.213.476.476.476h7.944A.476.476 0 0 0 20 8.426V.476A.476.476 0 0 0 19.524 0Z'
                fill='#1F3641'
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Game grid */}
      <div className='grid grid-cols-3 gap-4 w-full'>
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
              } rounded-xl aspect-square flex items-center justify-center shadow-[0_8px_0_#10212a] cursor-pointer hover:bg-[#2a4a56] transition-colors`}
              onClick={() => handleCellClick(i)}
            >
              {renderCellContent(cellValue, isWinningCell)}
            </div>
          );
        })}
      </div>
      {/* Score row */}
      <div className='flex w-full gap-4 mt-6'>
        <div className='flex-1 bg-[#31c3bd] rounded-xl py-2 text-center text-[#1a2a33] font-bold'>
          X (YOU)
          <div className='text-2xl'>{scores.x}</div>
        </div>
        <div className='flex-1 bg-[#a8bfc9] rounded-xl py-2 text-center text-[#1a2a33] font-bold'>
          TIES
          <div className='text-2xl'>{scores.ties}</div>
        </div>
        <div className='flex-1 bg-[#f2b137] rounded-xl py-2 text-center text-[#1a2a33] font-bold'>
          O (CPU)
          <div className='text-2xl'>{scores.o}</div>
        </div>
      </div>

      {/* Win Modal */}
      {winner && (
        <>
          <div className='fixed inset-0 bg-black/60 z-40 pointer-events-none'></div>
          <div className='fixed inset-0 flex items-center justify-center z-50'>
            <div className='bg-[#1f3641] rounded-xl p-8 text-center max-w-lg w-full mx-4 shadow-2xl pointer-events-auto'>
              {winner === "tie" ? (
                <>
                  <div className='text-[#a8bfc9] text-lg font-bold mb-2'>
                    ROUND TIED
                  </div>
                </>
              ) : (
                <>
                  <div className='text-[#a8bfc9] text-lg font-bold mb-2'>
                    {winner === selectedMark
                      ? "YOU WON!"
                      : "OH NO, YOU LOST..."}
                  </div>
                  <div className='flex items-center justify-center gap-2 mb-6'>
                    {winner === "x" ? (
                      <svg
                        width='32'
                        height='32'
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
                      className={`text-2xl font-bold ${
                        winner === "x" ? "text-[#31c3bd]" : "text-[#f2b137]"
                      }`}
                    >
                      TAKES THE ROUND
                    </span>
                  </div>
                </>
              )}

              <div className='flex gap-3'>
                <button
                  className='flex-1 bg-[#a8bfc9] hover:bg-[#c5d2dc] text-[#1a2a33] font-bold py-3 px-4 rounded-lg transition-colors'
                  onClick={onQuit}
                >
                  QUIT
                </button>
                <button
                  className='flex-1 bg-[#f2b137] hover:bg-[#f5c563] text-[#1a2a33] font-bold py-3 px-4 rounded-lg transition-colors'
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
