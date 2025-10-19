import Header from "./Header";
import MarkSelector from "./MarkSelector";
import NewGameButtons from "./NewGameButtons";
import GameBoard from "./GameBoard";
import { useState } from "react";

export default function App() {
  const [showBoard, setShowBoard] = useState(false);
  const [selectedMark, setSelectedMark] = useState("x");
  const handleStartCpuGame = () => setShowBoard(true);
  const handleQuitGame = () => setShowBoard(false);

  return (
    <div className='min-h-screen bg-[#1a2a33] p-6 flex flex-col items-center gap-8'>
      {!showBoard && <Header />}
      <div className='w-full max-w-[460px] flex flex-col gap-8'>
        {showBoard ? (
          <GameBoard selectedMark={selectedMark} onQuit={handleQuitGame} />
        ) : (
          <>
            <MarkSelector
              selected={selectedMark}
              setSelected={setSelectedMark}
            />
            <NewGameButtons onStartCpuGame={handleStartCpuGame} />
          </>
        )}
      </div>
    </div>
  );
}
