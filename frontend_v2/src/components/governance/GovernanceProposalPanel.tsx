import { useEffect, useState } from 'react'
import ProposalCard from './ProposalCard'

interface Proposal {
  id: string
  proposalNumber: string
  title: string
  description: string
  status: 'active' | 'passed' | 'rejected' | 'executed'
  deadline?: string
  voteFor: number
  voteAgainst: number
  voterCount: number
}

interface PropertyInfo {
  id: string
  name: string
  location: string
  image?: string
  category: string
  status: string
  apr: string
  tokenPrice: string
  totalVoters: string
  governanceScore: string
  myVotingPower: string
}

interface GovernanceProposalPanelProps {
  isOpen: boolean
  onClose: () => void
  property: PropertyInfo | null
}

export default function GovernanceProposalPanel({
  isOpen,
  onClose,
  property,
}: GovernanceProposalPanelProps) {
  const [selectedFilter, setSelectedFilter] = useState('전체')
  const [proposals, setProposals] = useState<Proposal[]>([])

  useEffect(() => {
    if (isOpen && property) {
      // Mock proposals data
      const mockProposals: Proposal[] = [
        {
          id: '1',
          proposalNumber: '#1024',
          title: '에너지 효율을 위한 로비 HVAC 시스템 교체',
          description:
            '메인 로비 에어컨 장치를 새로운 친환경 모델로 업그레이드하는 제안. 예상 비용은 $50,000이며 연간 에너지 비용 15% 절감 예상.',
          status: 'active',
          deadline: '12시간 30분 후 종료',
          voteFor: 75,
          voteAgainst: 25,
          voterCount: 42,
        },
        {
          id: '2',
          proposalNumber: '#1023',
          title: '3분기 배당 분배 전략',
          description:
            '토큰 보유자에게 임대 수익 3.5% 즉시 분배 또는 1.5% 건물 유지보수 기금 재투자 중 선택에 대한 투표.',
          status: 'active',
          deadline: '2일 4시간 후 종료',
          voteFor: 45,
          voteAgainst: 55,
          voterCount: 12,
        },
        {
          id: '3',
          proposalNumber: '#1022',
          title: '주차장 확장 1단계',
          description:
            '지하 주차 시설을 50대 추가 차량 수용을 위해 확장하기 위한 초기 조사 및 건축 설계도 승인.',
          status: 'executed',
          deadline: '10월 12일 통과됨',
          voteFor: 88,
          voteAgainst: 12,
          voterCount: 0,
        },
      ]
      setProposals(mockProposals)
    }
  }, [isOpen, property])

  const filters = ['전체', '진행 중', '통과됨', '거부됨']

  const filteredProposals = proposals.filter((proposal) => {
    if (selectedFilter === '전체') return true
    if (selectedFilter === '진행 중') return proposal.status === 'active'
    if (selectedFilter === '통과됨') return proposal.status === 'passed' || proposal.status === 'executed'
    if (selectedFilter === '거부됨') return proposal.status === 'rejected'
    return true
  })

  if (!property) return null

  return (
    <>
      {/* Backdrop - Left half transparent, right half dark */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '60px' }}
        onClick={onClose}
      >
        {/* Left half - transparent */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2"></div>
        {/* Right half - dark backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Panel */}
      <div
        className={`fixed right-0 w-full md:w-1/2 bg-black border-l border-gray-600 shadow-2xl transform transition-transform duration-300 ease-out z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px', height: 'calc(100vh - 60px)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Breadcrumb */}
          <div className="flex flex-wrap gap-2 items-center text-sm mb-6">
            <a className="text-gray-400 hover:text-[#1ABCF7] transition-colors" href="#">
              거버넌스
            </a>
            <span className="text-gray-500">/</span>
            <a className="text-gray-400 hover:text-[#1ABCF7] transition-colors" href="#">
              부동산
            </a>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">{property.name}</span>
          </div>

          {/* Property Header */}
          <div className="relative w-full h-[280px] rounded-xl overflow-hidden group border border-gray-700 mb-6">
            {property.image ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${property.image})` }}
              ></div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#1ABCF7]/20 text-[#1ABCF7] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {property.category}
                  </span>
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> {property.status}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{property.name}</h1>
                <p className="text-gray-300 flex items-center gap-1 text-sm">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {property.location}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>{' '}
                  공유
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>{' '}
                  상세 보기
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col gap-1 rounded-lg p-5 bg-gray-800 border border-gray-600 shadow-lg">
              <p className="text-gray-400 text-sm font-medium">스테이킹 연 수익률</p>
              <p className="text-white text-2xl font-bold">{property.apr}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-lg p-5 bg-gray-800 border border-gray-600 shadow-lg">
              <p className="text-gray-400 text-sm font-medium">토큰 가격</p>
              <p className="text-white text-2xl font-bold">{property.tokenPrice}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-lg p-5 bg-gray-800 border border-gray-600 shadow-lg">
              <p className="text-gray-400 text-sm font-medium">총 투표자 수</p>
              <p className="text-white text-2xl font-bold">{property.totalVoters}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-lg p-5 bg-gray-800 border border-gray-600 shadow-lg">
              <p className="text-gray-400 text-sm font-medium">거버넌스 점수</p>
              <div className="flex items-center gap-2">
                <span className="text-white text-2xl font-bold">{property.governanceScore}</span>
                <span className="text-gray-400 text-sm">/100</span>
              </div>
            </div>
          </div>

          {/* Proposals Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white">안건</h2>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex p-1 bg-gray-800 rounded-lg flex-1 sm:flex-none border border-gray-600">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                        selectedFilter === filter
                          ? 'bg-[#1ABCF7] text-black shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <button
                  className="hidden sm:flex bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white p-2 rounded-lg transition-colors"
                  title="Filter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Proposals List */}
            <div className="flex flex-col gap-4">
              {filteredProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  {...proposal}
                  onVoteClick={() => console.log('Vote clicked for proposal:', proposal.id)}
                />
              ))}
              <button className="w-full py-4 text-gray-400 hover:text-white text-sm font-medium border border-dashed border-gray-600 rounded-xl hover:bg-white/5 transition-colors">
                더 많은 안건 불러오기
              </button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Create Proposal Button */}
            <button className="w-full bg-white hover:bg-gray-100 text-black transition-colors py-3 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>{' '}
              제안 생성
            </button>

            {/* My Voting Power */}
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 shadow-lg">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                </svg>
                나의 투표권
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">총 투표력</p>
                  <p className="text-3xl font-bold text-white">
                    {property.myVotingPower}{' '}
                    <span className="text-sm font-normal text-gray-400">NPT-A</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">보유</p>
                    <p className="text-white font-medium">{property.myVotingPower}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">위임</p>
                    <p className="text-white font-medium">0</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-600">
                <a className="text-[#1ABCF7] text-sm font-medium hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  위임 관리
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Governance Rules */}
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 shadow-lg">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
                거버넌스 규칙
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3 text-gray-400">
                  <svg
                    className="w-4.5 h-4.5 text-[#1ABCF7] shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>정족수:</strong> 전체 공급량의 40%가 제안에 투표해야 유효합니다.
                  </span>
                </li>
                <li className="flex gap-3 text-gray-400">
                  <svg
                    className="w-4.5 h-4.5 text-[#1ABCF7] shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>투표 기간:</strong> 모든 제안은 3일간 활성 상태를 유지합니다.
                  </span>
                </li>
                <li className="flex gap-3 text-gray-400">
                  <svg
                    className="w-4.5 h-4.5 text-[#1ABCF7] shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>실행 지연:</strong> 통과된 제안은 24시간 락업 기간이 있습니다.
                  </span>
                </li>
              </ul>
              <a className="block mt-4 text-center text-gray-400 hover:text-[#1ABCF7] text-xs underline transition-colors">
                전체 거버넌스 문서 읽기
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
