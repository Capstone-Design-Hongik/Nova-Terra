export default function ParticipationCard() {
  return (
    <div className="flex flex-col justify-between rounded-xl p-6 border border-gray-600 bg-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">참여율</p>
        <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <p className="text-3xl font-bold leading-tight text-white">85%</p>
        <p className="text-green-400 text-sm font-medium mb-1.5 flex items-center">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
          +5% vs avg
        </p>
      </div>
      <p className="text-gray-400 text-sm mb-4">이번 분기에 20개의 제안 중 17개에 투표하셨습니다.</p>
      <div className="flex gap-1 h-8 items-end">
        <div className="flex-1 bg-gray-900 h-[40%] rounded-sm"></div>
        <div className="flex-1 bg-gray-900 h-[60%] rounded-sm"></div>
        <div className="flex-1 bg-purple-500 h-[80%] rounded-sm relative group cursor-pointer shadow-[0_0_10px_rgba(160,32,240,0.5)]">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-gray-600">
            현재
          </div>
        </div>
        <div className="flex-1 bg-gray-900 h-[50%] rounded-sm"></div>
        <div className="flex-1 bg-gray-900 h-[70%] rounded-sm"></div>
      </div>
    </div>
  )
}
