interface VotingPowerCardProps {
  onClick?: () => void
  isActive?: boolean
}

export default function VotingPowerCard({ onClick, isActive }: VotingPowerCardProps) {
  return (
    <div className={`flex flex-col justify-between rounded-xl p-6 border bg-gray-800 shadow-lg relative overflow-hidden group hover:border-[#1ABCF7] transition-colors ${
      isActive ? 'border-[#1ABCF7]' : 'border-gray-600'
    }`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">나의 투표권</p>
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
