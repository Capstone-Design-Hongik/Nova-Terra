interface DelegationCardProps {
  onClick?: () => void
}

export default function DelegationCard({ onClick }: DelegationCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl p-6 border border-gray-600 bg-gray-800 shadow-lg">
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">위임 상태</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-600 bg-cover bg-center"></div>
          <div>
            <p className="font-bold text-lg text-white">에이전트 스미스</p>
            <p className="text-gray-400 text-sm">부동산 전문가</p>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-600">
        <button
          onClick={onClick}
          className="cursor-pointer w-full bg-[#1ABCF7] hover:bg-[#1ABCF7]/90 text-black font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          위임하러가기
        </button>
      </div>
    </div>
  )
}
