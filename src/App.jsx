import Header from "./Header";
import MarkSelector from "./MarkSelector";
import NewGameButtons from "./NewGameButtons";
import GameBoard from "./GameBoard";
import { useState } from "react";

export default function App() {
  const [showBoard, setShowBoard] = useState(false);
  const [selectedMark, setSelectedMark] = useState("x");
  const [gameMode, setGameMode] = useState("cpu"); // "cpu" or "player"
  const handleStartCpuGame = () => {
    setGameMode("cpu");
    setShowBoard(true);
  };
  const handleStartPlayerGame = () => {
    setGameMode("player");
    setShowBoard(true);
  };
  const handleQuitGame = () => setShowBoard(false);

  return (
    <div className='min-h-screen bg-[#1a2a33] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center gap-6 sm:gap-8'>
      {!showBoard && <Header />}
      <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[460px] flex flex-col gap-6 sm:gap-8'>
        {showBoard ? (
          <GameBoard
            selectedMark={selectedMark}
            gameMode={gameMode}
            onQuit={handleQuitGame}
          />
        ) : (
          <>
            <MarkSelector
              selected={selectedMark}
              setSelected={setSelectedMark}
            />
            <NewGameButtons
              onStartCpuGame={handleStartCpuGame}
              onStartPlayerGame={handleStartPlayerGame}
            />
          </>
        )}
      </div>
    </div>
  );
}
