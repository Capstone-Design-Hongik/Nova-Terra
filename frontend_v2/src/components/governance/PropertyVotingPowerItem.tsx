interface PropertyVotingPowerItemProps {
  propertyName: string
  location: string
  votingPower: string
  isDelegated: boolean
  delegatedTo?: string
  image?: string
}

export default function PropertyVotingPowerItem({
  propertyName,
  location,
  votingPower,
  isDelegated,
  delegatedTo,
  image,
}: PropertyVotingPowerItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-600 bg-gray-800 hover:bg-gray-750 transition-colors">
      {/* Property Image */}
      <div
        className="w-16 h-16 rounded-lg bg-cover bg-center border border-gray-600 flex-shrink-0"
        style={image ? { backgroundImage: `url(${image})` } : { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >
        {!image && (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-base mb-1 truncate">{propertyName}</h3>
        <p className="text-gray-400 text-sm flex items-center gap-1 mb-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{location}</span>
        </p>

        {/* Voting Power and Delegation Status */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-bold text-sm">{votingPower}</span>
            <span className="text-gray-400 text-xs">NVT</span>
          </div>

          {isDelegated ? (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              위임됨 {delegatedTo && `→ ${delegatedTo}`}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              직접 보유
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
