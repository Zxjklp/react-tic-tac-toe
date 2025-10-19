export default function MarkSelector({ selected, setSelected }) {
  return (
    <div className='bg-[#1f3641] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[0_6px_0_#10212a] sm:shadow-[0_8px_0_#10212a]'>
      <h2 className='text-[#a8bfc9] text-center mb-4 sm:mb-6 text-sm sm:text-base font-bold'>
        PICK PLAYER 1'S MARK
      </h2>
      <div className='bg-[#1a2a33] rounded-lg p-2 flex mb-3 sm:mb-4'>
        <button
          className={`flex-1 rounded-lg p-2 sm:p-3 flex items-center justify-center cursor-pointer transition-colors ${
            selected === "x" ? "bg-[#a8bfc9]" : "bg-transparent"
          }`}
          onClick={() => setSelected("x")}
          aria-pressed={selected === "x"}
        >
          <svg
            className='w-6 h-6 sm:w-8 sm:h-8'
            viewBox='0 0 64 64'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z'
              fill={selected === "x" ? "#1a2a33" : "#a8bfc9"}
              fillRule='evenodd'
            />
          </svg>
        </button>
        <button
          className={`flex-1 rounded-lg p-2 sm:p-3 flex items-center justify-center cursor-pointer transition-colors ${
            selected === "o" ? "bg-[#a8bfc9]" : "bg-transparent"
          }`}
          onClick={() => setSelected("o")}
          aria-pressed={selected === "o"}
        >
          <svg
            className='w-6 h-6 sm:w-8 sm:h-8'
            viewBox='0 0 64 64'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z'
              fill={selected === "o" ? "#1a2a33" : "#a8bfc9"}
            />
          </svg>
        </button>
      </div>
      <p className='text-[#a8bfc9] opacity-50 text-center text-xs sm:text-sm'>
        REMEMBER: X GOES FIRST
      </p>
    </div>
  );
}
