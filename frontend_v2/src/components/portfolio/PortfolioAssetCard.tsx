interface PortfolioAssetCardProps {
  id: string
  name: string
  location: string
  image?: string
  status: 'active' | 'preparing'
  holdingAmount: number
  currentValue: number
  unclaimedRewards: number
  onClaim: (id: string) => void
  onClick?: () => void
}

export default function PortfolioAssetCard({
  id,
  name,
  location,
  image,
  status,
  holdingAmount,
  currentValue,
  unclaimedRewards,
  onClaim,
  onClick,
}: PortfolioAssetCardProps) {
  const isActive = status === 'active'
  const statusColor = isActive ? 'text-[#1ABCF7] border-[#1ABCF7]/30' : 'text-gray-400 border-gray-600'
  const statusText = isActive ? '운영중' : '준비중'
  const hoverColor = isActive ? 'hover:border-[#1ABCF7]/50 hover:shadow-[0_0_20px_rgba(26,188,247,0.1)]' : 'hover:border-gray-600/80'

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleClaimClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClaim(id)
  }

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer group flex flex-col overflow-hidden rounded-2xl border border-gray-600 bg-gray-800 transition-all hover:-translate-y-1 ${hoverColor}`}
    >
      {/* Property Image */}
      <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
        <div className={`absolute left-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold backdrop-blur-md border ${statusColor}`}>
          {statusText}
        </div>
        {image ? (
          <img
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            src={image}
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
            <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-gray-800 via-transparent to-transparent"></div>
      </div>

      {/* Property Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h4 className={`text-lg font-bold text-white leading-tight mb-1 transition-colors ${isActive ? 'group-hover:text-[#1ABCF7]' : ''}`}>
            {name}
          </h4>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {location}
          </div>
        </div>

        {/* Holdings Info */}
        <div className="grid grid-cols-2 gap-3 mb-5 border-y border-gray-600 py-4 bg-black/30 rounded-lg px-2">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">보유 수량</p>
            <p className="text-sm font-bold text-white">{holdingAmount} STO</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 mb-0.5">현재 평가 가치</p>
            <p className="text-sm font-bold text-white">{currentValue.toLocaleString()} KRWT</p>
          </div>
        </div>

        {/* Claim Section */}
        <div className="mt-auto bg-black rounded-xl p-4 border border-gray-600 relative overflow-hidden">
          {unclaimedRewards > 0 && (
            <div className="absolute top-0 left-0 w-0.5 h-full bg-[#1ABCF7] shadow-[0_0_8px_#1ABCF7]"></div>
          )}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">미수령 수익금</span>
            <span className={`text-sm font-bold ${unclaimedRewards > 0 ? 'text-[#1ABCF7] drop-shadow-[0_0_5px_rgba(26,188,247,0.5)]' : 'text-gray-400'}`}>
              KRWT {unclaimedRewards.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleClaimClick}
            className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg bg-[#1ABCF7] py-2.5 text-sm font-bold text-black shadow-[0_0_10px_rgba(26,188,247,0.3)] transition-all hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            수익 클레임
          </button>
        </div>
      </div>
    </div>
  )
}
