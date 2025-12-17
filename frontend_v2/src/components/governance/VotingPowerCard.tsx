interface VotingPowerCardProps {
  onClick?: () => void
  isActive?: boolean
}

export default function VotingPowerCard({ onClick, isActive }: VotingPowerCardProps) {
  return (
    <div className={`flex flex-col justify-between rounded-xl p-6 border bg-gray-800 shadow-lg relative overflow-hidden group hover:border-[#1ABCF7] transition-colors ${
      isActive ? 'border-[#1ABCF7]' : 'border-gray-600'
    }`}>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg className="w-16 h-16 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
        </svg>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">나의 투표권</p>
          <svg className="w-5 h-5 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-3xl font-bold leading-tight text-white mb-1">
          12,450 <span className="text-lg text-gray-400 font-normal">NVT</span>
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-600">

        <button
          onClick={onClick}
          className="cursor-pointer w-full bg-[#1ABCF7] hover:bg-[#1ABCF7]/90 text-black font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          내 투표권 보러가기
        </button>
      </div>
    </div>
  )
}
