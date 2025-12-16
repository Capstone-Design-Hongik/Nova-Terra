import { useNavigate } from 'react-router-dom'

interface PropertyDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  property: {
    id: string
    name: string
    location: string
    locationDetail: string
    type: string
    typeColor: string
    image: string
    occupancyRate: number
    monthlyRent: number
    totalValue: number
    stoPrice: number
    fundingPercentage: number
    investors: number
    description: string
    highlights: string[]
    dividendCycle: string
    nextDividend: string
  } | null
  onPurchaseClick?: () => void
}

export default function PropertyDetailPanel({ isOpen, onClose, property, onPurchaseClick }: PropertyDetailPanelProps) {
  const navigate = useNavigate()

  if (!property) return null

  const handleBuyClick = () => {
    if (onPurchaseClick) {
      onPurchaseClick()
    } else {
      navigate(`/trade/${property.id}`)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div
        className={`fixed right-0 w-full md:w-1/2 bg-gray-900 border-l border-gray-600 z-50 flex flex-col rounded-l-2xl shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative" style={{scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #111827'}}>
          {/* Hero Image Section */}
          <div className="relative h-64 w-full">
            <img
              alt={property.name}
              className="h-full w-full object-cover"
              src={property.image}
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/20 to-transparent"></div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-red-500/80 hover:text-white backdrop-blur-md transition-all border border-white/10"
              aria-label="Close panel"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block rounded-md bg-[#1ABCF7]/90 px-2.5 py-0.5 text-xs font-bold text-black backdrop-blur-md">
                  {property.type}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-md border border-white/10">
                  <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  높은 수익률
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white shadow-sm leading-tight">{property.name}</h2>
            </div>
          </div>

          {/* Detail Content */}
          <div className="p-6 flex flex-col gap-8">
            {/* Price Section */}
            <div className="flex items-center justify-between border-b border-gray-600 pb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">현재 STO 가격</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#1ABCF7]">₩{property.stoPrice.toFixed(0)}</span>
                  <span className="text-sm text-green-400 font-medium flex items-center bg-green-400/10 px-1.5 rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    2.4%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">월 임대료</p>
                <span className="text-2xl font-bold text-white">₩{(property.monthlyRent / 10000).toFixed(0)}만</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex gap-3 items-start bg-black/30 p-4 rounded-xl border border-gray-600/50">
              <div className="mt-1 size-8 rounded-full bg-[#1ABCF7]/10 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{property.locationDetail}</h4>
                <p className="text-gray-400 text-sm mt-1">주요 업무 지구 중심부에 위치하여 우수한 접근성을 자랑합니다.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-black p-4 border border-gray-600 group hover:border-[#1ABCF7]/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">임대율</span>
                  <svg className="w-4.5 h-4.5 text-[#A020F0]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-white">{(property.occupancyRate * 100).toFixed(1)}%</p>
                <p className="text-[11px] text-gray-400 mt-1">시장 평균 대비 매우 높음</p>
              </div>

              <div className="rounded-xl bg-black p-4 border border-gray-600 group hover:border-[#1ABCF7]/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">총 자산 가치</span>
                  <svg className="w-4.5 h-4.5 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-white">₩{(property.totalValue / 100000000).toFixed(1)}억</p>
                <p className="text-[11px] text-gray-400 mt-1">최근 감정평가액 기준</p>
              </div>

              <div className="rounded-xl bg-black p-4 border border-gray-600 group hover:border-[#1ABCF7]/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">투자자 수</span>
                  <svg className="w-4.5 h-4.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-white">{property.investors.toLocaleString()}</p>
                <p className="text-[11px] text-gray-400 mt-1">활발한 투자 참여</p>
              </div>

              <div className="rounded-xl bg-black p-4 border border-gray-600 group hover:border-[#1ABCF7]/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">배당 주기</span>
                  <svg className="w-4.5 h-4.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-white">{property.dividendCycle}</p>
                <p className="text-[11px] text-gray-400 mt-1">다음 배당일: {property.nextDividend}</p>
              </div>
            </div>

            {/* Investment Points */}
            <div>
              <h4 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-linear-to-b from-[#1ABCF7] to-[#A020F0] rounded-full"></span>
                투자 매력 포인트
              </h4>
              <ul className="space-y-3">
                {property.highlights.map((highlight, index) => {
                  const [title, ...descParts] = highlight.split(':')
                  const description = descParts.join(':').trim()
                  return (
                    <li key={index} className="flex gap-3 text-sm text-gray-400 items-start">
                      <svg className="w-4.5 h-4.5 text-[#1ABCF7] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><strong className="text-white">{title}:</strong> {description}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold text-white text-lg mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gray-600 rounded-full"></span>
                상세 설명
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {property.description}
              </p>
            </div>

            <div className="h-4"></div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-600 bg-gray-900/95 backdrop-blur p-6 z-10 shrink-0">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-white font-medium">펀딩 모집률</span>
            <span className="text-[#1ABCF7] font-bold">{property.fundingPercentage}% 달성</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black mb-5 border border-gray-600/50">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#1ABCF7] to-[#A020F0] shadow-[0_0_10px_rgba(26,188,247,0.4)] relative overflow-hidden"
              style={{ width: `${property.fundingPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBuyClick}
              className="cursor-pointer flex-1 rounded-xl bg-linear-to-r from-[#1ABCF7] to-[#0090bf] py-3.5 text-center font-bold text-black text-lg shadow-lg hover:shadow-[#1ABCF7]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>STO 구매하기</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-3">
            투자는 원금 손실 위험이 있습니다. <a className="underline hover:text-white" href="#">계약서</a>를 확인하세요.
          </p>
        </div>
      </div>
    </>
  )
}
