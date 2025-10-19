export default function NewGameButtons({ onStartCpuGame, onStartPlayerGame }) {
  return (
    <div className='flex flex-col gap-3 sm:gap-4 mt-3 sm:mt-4'>
      <button
        onClick={onStartCpuGame}
        className='w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase bg-[#f2b137] hover:bg-[#f5c563] text-[#1a2a33] shadow-[0_6px_0_#cc8b13] sm:shadow-[0_8px_0_#cc8b13] cursor-pointer transition-colors duration-200 text-sm sm:text-base'
      >
        NEW GAME (VS CPU)
      </button>
      <button
        onClick={onStartPlayerGame}
        className='w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase bg-[#31c3bd] hover:bg-[#52d4ce] text-[#1a2a33] shadow-[0_6px_0_#118c87] sm:shadow-[0_8px_0_#118c87] cursor-pointer transition-colors duration-200 text-sm sm:text-base'
      >
        NEW GAME (VS PLAYER)
      </button>
    </div>
  );
}
