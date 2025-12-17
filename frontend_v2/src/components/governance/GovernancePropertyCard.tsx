interface GovernancePropertyCardProps {
  id: string
  name: string
  location: string
  image?: string
  category: string
  tier: string
  assetValue: string
  myStake: string
  proposalStatus: 'active' | 'urgent' | 'scheduled' | 'completed' | 'none'
  proposalTitle?: string
  proposalDetail?: string
  proposalDeadline?: string
  voterCount?: number
  onClick?: () => void
}

export default function GovernancePropertyCard({
  name,
  location,
  image,
  category,
  tier,
  assetValue,
  myStake,
  proposalStatus,
  proposalTitle,
  proposalDeadline,
  voterCount,
  onClick,
}: GovernancePropertyCardProps) {
  // Category color mapping
  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      '오피스': 'bg-[#1ABCF7] text-black',
      '복합 용도': 'bg-purple-500 text-white',
      '연구': 'bg-teal-500 text-white',
      '물류': 'bg-orange-500 text-white',
      '소매': 'bg-pink-500 text-white',
      '주거용': 'bg-indigo-500 text-white',
    }
    return colors[cat] || 'bg-gray-500 text-white'
  }

  // Tier color mapping
  const getTierColor = (tierValue: string) => {
    if (tierValue.includes('S')) return 'text-purple-400'
    if (tierValue.includes('A')) return 'text-[#1ABCF7]'
    return 'text-white'
  }

  // Status-based styling
  const getHoverColor = () => {
    switch (proposalStatus) {
      case 'active':
        return 'hover:shadow-[#1ABCF7]/20 hover:border-[#1ABCF7]/50'
      case 'urgent':
        return 'hover:shadow-purple-500/20 hover:border-purple-500/50'
      case 'completed':
        return 'hover:shadow-pink-500/20 hover:border-pink-500/50'
      default:
        return 'hover:shadow-teal-500/20 hover:border-teal-500/50'
    }
  }

  const renderProposalSection = () => {
    if (proposalStatus === 'none') {
      return (
        <div className="bg-gray-900 rounded-lg p-3 mb-4 border border-gray-600 flex items-center justify-center h-16.5">
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            진행 중인 안건 없음
          </span>
        </div>
      )
    }

    if (proposalStatus === 'active') {
      return (
        <div className="bg-gray-900 rounded-lg p-3 mb-4 border border-gray-600">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">최신 안건</span>
            <span className="text-[10px] text-[#1ABCF7] font-bold uppercase drop-shadow-[0_0_5px_rgba(26,188,247,0.8)]">
              투표 진행 중
            </span>
          </div>
          <p className="text-sm font-medium text-white line-clamp-1">{proposalTitle}</p>
        </div>
      )
    }

    if (proposalStatus === 'urgent') {
      return (
        <div className="bg-purple-500/10 rounded-lg p-3 mb-4 border border-purple-500/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-purple-400 font-medium">중요 결정</span>
            <span className="text-[10px] text-purple-400 font-bold uppercase">{proposalDeadline}</span>
          </div>
          <p className="text-sm font-bold text-white line-clamp-1">{proposalTitle}</p>
        </div>
      )
    }

    if (proposalStatus === 'scheduled') {
      return (
        <div className="bg-gray-900 rounded-lg p-3 mb-4 border border-gray-600">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">예정</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">{proposalDeadline}</span>
          </div>
          <p className="text-sm font-medium text-white line-clamp-1">{proposalTitle}</p>
        </div>
      )
    }

    if (proposalStatus === 'completed') {
      return (
        <div className="bg-green-500/10 rounded-lg p-3 mb-4 border border-green-500/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-green-400 font-medium">승인됨</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">{proposalDeadline}</span>
          </div>
          <p className="text-sm font-medium text-white line-clamp-1">{proposalTitle}</p>
        </div>
      )
    }

    return null
  }

  const renderBadge = () => {
    if (proposalStatus === 'active') {
      return (
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          {voterCount ? `${voterCount}개 진행 중인 안건` : '진행 중인 안건'}
        </div>
      )
    }

    if (proposalStatus === 'urgent') {
      return (
        <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-purple-500/20">
          <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          긴급 조치
        </div>
      )
    }

    if (proposalStatus === 'scheduled') {
      return (
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          1개 대기 중
        </div>
      )
    }

    if (proposalStatus === 'completed') {
      return (
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          최근 통과됨
        </div>
      )
    }

    return null
  }

  const renderActionButton = () => {
    if (proposalStatus === 'active') {
      return (
        <button className="flex items-center gap-1 text-[#1ABCF7] text-sm font-bold hover:gap-2 transition-all hover:text-cyan-400">
          안건 보기
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )
    }

    if (proposalStatus === 'urgent') {
      return (
        <button className="flex items-center gap-1 text-purple-400 text-sm font-bold hover:gap-2 transition-all hover:text-purple-300">
          지금 투표하기
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )
    }

    if (proposalStatus === 'completed') {
      return (
        <button className="flex items-center gap-1 text-gray-400 text-sm font-bold group-hover:text-[#1ABCF7] transition-all">
          결과 보기
        </button>
      )
    }

    return (
      <button className="flex items-center gap-1 text-gray-400 text-sm font-bold group-hover:text-[#1ABCF7] transition-all">
        상세 보기
      </button>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col rounded-xl border border-gray-600 bg-gray-800 shadow-lg overflow-hidden transition-all duration-300 cursor-pointer ${getHoverColor()}`}
    >
      {/* Property Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-900">
        {image ? (
          <img
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            src={image}
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <svg className="w-20 h-20 text-white/10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-gray-800 via-transparent to-transparent"></div>

        {/* Status Badge */}
        {renderBadge()}

        {/* Category and Name */}
        <div className="absolute bottom-4 left-4">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${getCategoryColor(category)}`}>
            {category}
          </span>
          <h3 className="text-xl font-bold text-white leading-tight">{name}</h3>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {location}
          </div>
          <span className={`font-mono text-sm font-semibold ${getTierColor(tier)}`}>{tier}</span>
        </div>

        {/* Proposal Section */}
        {renderProposalSection()}

        {/* Asset Info */}
        <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-600">
          <div>
            <p className="text-xs text-gray-400 mb-1">자산 가치</p>
            <p className="font-bold text-white">{assetValue}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">내 지분</p>
            <p className="font-bold text-white">{myStake}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto flex items-center justify-between">
          {voterCount && voterCount > 0 ? (
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-gray-800 bg-gray-600"></div>
              <div className="w-7 h-7 rounded-full border-2 border-gray-800 bg-gray-600"></div>
              <span className="w-7 h-7 rounded-full border-2 border-gray-800 bg-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-400">
                +{voterCount}
              </span>
            </div>
          ) : (
            <div className="text-xs text-gray-400">
              {proposalStatus === 'none' ? '관심 목록 항목' : proposalStatus === 'completed' ? '최근 투표 없음' : ''}
            </div>
          )}
          {renderActionButton()}
        </div>
      </div>
    </div>
  )
}
