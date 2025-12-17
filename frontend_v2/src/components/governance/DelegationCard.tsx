export default function DelegationCard() {
  return (
    <div className="flex flex-col justify-between rounded-xl p-6 border border-gray-600 bg-gray-800 shadow-lg">
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">위임 상태</p>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 uppercase border border-green-500/30">
            Active
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-600 bg-cover bg-center"></div>
          <div>
            <p className="font-bold text-lg text-white">에이전트 스미스</p>
            <p className="text-gray-400 text-sm">부동산 전문가 (Lv 5)</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button className="flex-1 py-2 px-3 rounded-lg border border-gray-600 text-white text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors">
          변경
        </button>
        <button className="flex-1 py-2 px-3 rounded-lg border border-transparent bg-gray-900 text-white text-sm font-medium hover:bg-black/40 hover:text-white transition-colors">
          내역
        </button>
      </div>
    </div>
  )
}
