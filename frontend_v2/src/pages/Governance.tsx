import { useState } from 'react'
import Topbar from '../layouts/Topbar'
import GovernancePropertyCard from '../components/governance/GovernancePropertyCard'
import GovernanceProposalPanel from '../components/governance/GovernanceProposalPanel'

interface Property {
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

export default function Governance() {
  const [selectedCategory, setSelectedCategory] = useState('전체 자산')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyInfo | null>(null)

  // Mock data based on code7.html
  const properties: Property[] = [
    {
      id: '1',
      name: 'Gangnam Tower B',
      location: 'Gangnam-gu, Seoul',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8rm4evMFoHKbpqQi0RJGbOBcwB_W2Qz8bUsplE83jLT3rz04Cojj5ajIwVEfU7IyPlqQojbqcvnqf_0ggdcHOe45OEZAD1aWbQczDPc6bhsI1AF6fTZKbiz33QhvUs-tSpEW2khR0G1QJH-AeinZzQzeyHKnFABu3X_6E_hXhcYzOaI1GlU0cV_e9th1kZ7X9Jc6OMrJO6oOcbR_QhB5pP6t5iYoit5apGx9jUBunH6iopAVaQNh3Rv8pN7DlNIx-_Cc0xVl9-nY',
      category: '오피스',
      tier: 'Tier A',
      assetValue: '₩450.2B',
      myStake: '0.05%',
      proposalStatus: 'active',
      proposalTitle: 'Lobby Renovation Budget Approval',
      voterCount: 12,
    },
    {
      id: '2',
      name: 'Yeouido Office A',
      location: 'Yeouido-dong, Seoul',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaNJVm9Eq2KhglrBGi6r7O-fT2foooh0MKmN5AhUAlAl_AYZt4Hm9_lzrc75meEposKvQJeBGtIWBAaJ6vJ8_qzw64sTX0Bt09nbxBzFlYXwcg3y11LV9dL0ur11MxV-OoEsShuo-37L7PJgMsfqmC4QPDMVO3y5JXxmrMRmNfYSoDG5zTf9bDq-UAkocipQoNhoP-bnK5hyKwXSrTni_FF6bWGD-REIKIQOQQFq8CxeuEGRPBBb3dlICNYbX_uMBWXjM2zvGWE1o',
      category: '복합 용도',
      tier: 'Tier S',
      assetValue: '₩820.0B',
      myStake: '0.01%',
      proposalStatus: 'urgent',
      proposalTitle: '자산 매각: 15% 프리미엄 제안',
      proposalDeadline: '4시간 12분 후 종료',
      voterCount: 89,
    },
    {
      id: '3',
      name: 'Pangyo Tech Site C',
      location: 'Pangyo, Gyeonggi',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCerICwrF9VZVEOU7ZPjr8AIbaXRddFZa6MXZ16I13i_bzVyQT6cGs8YRE4uI0r87Zhm0buAGSOmgGZmw5gPCZEJ3SftUdw9POryrQWno2d1tBSJmB6Lbsi2-bAJeNm0W40YvyfAkTYfwL5W-UMegstJixJtWfwaIWPofsaqiZfJyO-4DwTqbzu0_NMwcW9vCxuo_z9GqcqdePPlN9xVipYr8mwk5EqTtXbUR2kYdvK2Dxroru5nxvsFBn61QIkQAMDKArDDKdtNNg',
      category: '연구',
      tier: 'Tier B+',
      assetValue: '₩120.5B',
      myStake: '0.12%',
      proposalStatus: 'scheduled',
      proposalTitle: 'Solar Panel Installation',
      proposalDeadline: '10월 24일 시작',
    },
    {
      id: '4',
      name: 'Busan Logistics Hub',
      location: 'Busan Port District',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSXkFT46o-WUj4k7mjr4_dTlyJQ2X9Qx3-FPEs5_owU1h9kF9BS9FE4otkWlNkdqEk_gV0izQOLz4YY6aMeFkQt55lxmWhtL4BrTVQV5bL2vk8QRWU584kXuFhK8NPlr9H1Fj0eLwVgoZZXQqMRVdB8hru-EV0X6uWMGMTR3FkoaJaZuAh3QQWaLqozOV0YDwq0DatbpX-6U871bedvZhuGwKWIuKG5tAenQzByrx3derQbs67G36v468cr2Vpo0F63PszuOhPtrY',
      category: '물류',
      tier: 'Tier B',
      assetValue: '₩88.4B',
      myStake: '0.08%',
      proposalStatus: 'none',
    },
    {
      id: '5',
      name: 'Seongsu Retail Block',
      location: 'Seongsu-dong, Seoul',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEqqXmPxa38_ILxWbV2bKdliudUkrFTPNB2C17KBk9eat5jlhZuLxCpgePLNa2cwojV-aB1HDRl3Tmrg9Y8GU3Xg3z5LWjvS3FQzf776zJ7nAwtxLodtlA8xhgCZ_YGsaqGpf_OPU4ZnfYOExVG9E12vgE3JPKqpAVT6100qHjcjKglKzpuKoVct35Nocyrete048lXJJN_B1EhpteBXyEfANSI8HKUPJ1ZEraVdLQnZTs4fXjPxCt8wG6gUJfhID38LL6VQONI1M',
      category: '소매',
      tier: 'Tier A-',
      assetValue: '₩62.0B',
      myStake: '0.02%',
      proposalStatus: 'completed',
      proposalTitle: '보안 업체 갱신',
      proposalDeadline: '5일 전',
      voterCount: 4,
    },
    {
      id: '6',
      name: 'Hannam Heights',
      location: 'Hannam-dong, Seoul',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-ORDjFk11SNP3PtWGx2kQplm5tVIrXXI7qJBcneJwC8yjQMDJhyZXDt9k30OO6i7JeRoSewwvfJR5C3zcHpH2GWscVoEX2R9NOM0juEYC1WCDeR-6J6dxO3r6OCYeExZwvFjg1vUUMntNk0NzJ3teypQ0vu3CcvDPwnkH0Sd2DJ5wWJwttger40TzhKy9USPhU0uW6_S35fiHaBCriYJTWjU3BcAdv0qK3hGEVTe2E70uanyMKwPCtj6_w5OguKbB8gg-jjp-mpg',
      category: '주거용',
      tier: 'Tier S+',
      assetValue: '₩210.5B',
      myStake: '--',
      proposalStatus: 'none',
    },
  ]

  const categories = ['전체 자산', '상업 오피스', '소매 및 복합', '물류']

  const filteredProperties = properties.filter((property) => {
    const matchesCategory = selectedCategory === '전체 자산' || property.category.includes(selectedCategory.split(' ')[0])
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handlePropertyClick = (property: Property) => {
    // Convert Property to PropertyInfo
    const propertyInfo: PropertyInfo = {
      id: property.id,
      name: property.name,
      location: property.location,
      image: property.image,
      category: property.category,
      status: '활성',
      apr: '8.5%',
      tokenPrice: '$12.45',
      totalVoters: '1,240',
      governanceScore: '92',
      myVotingPower: '2,450',
    }
    setSelectedProperty(propertyInfo)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setTimeout(() => setSelectedProperty(null), 300)
  }

  return (
    <div className="min-h-screen bg-black">
      <Topbar isConnected={true} />

      <main className="w-full px-4 md:px-10 py-8 mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white">
              부동산 거버넌스
            </h1>
            <p className="text-gray-400 text-base font-normal leading-normal">
              포트폴리오에서 부동산 자산을 선택하여 안건을 확인하고 투표에 참여하세요.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              시스템 운영 중
            </span>
            <span className="text-xs text-gray-500 font-mono">Block: #18,293,021</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Voting Power */}
          <div className="flex flex-col justify-between rounded-xl p-6 border border-gray-600 bg-gray-800 shadow-lg relative overflow-hidden group">
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
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-400 font-medium">+2.1%</span>
                <span className="text-gray-400">풀 지분</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-600">
              <div className="flex justify-between text-xs mb-1 text-gray-400">
                <span>락업 기간</span>
                <span>145일 남음</span>
              </div>
              <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-[#1ABCF7] w-[65%] rounded-full shadow-[0_0_10px_rgba(26,188,247,0.5)]"></div>
              </div>
            </div>
          </div>

          {/* Delegation Status */}
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

          {/* Participation Rate */}
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
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8 bg-gray-800 p-2 rounded-xl border border-gray-600 shadow-lg">
          <div className="flex gap-2 p-1 overflow-x-auto w-full lg:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedCategory === category
                    ? 'bg-[#1ABCF7] text-black shadow-sm'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex w-full lg:w-auto gap-3 items-center">
            <div className="relative w-full lg:w-72">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1ABCF7] focus:border-transparent placeholder-gray-500"
                placeholder="건물 이름 또는 위치로 검색..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 rounded-lg border border-gray-600 bg-black/50 hover:bg-gray-900 text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <GovernancePropertyCard
              key={property.id}
              {...property}
              onClick={() => handlePropertyClick(property)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 disabled:opacity-50 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-lg bg-[#1ABCF7] text-black font-bold text-sm shadow-sm shadow-[#1ABCF7]/30">
              1
            </button>
            <button className="w-10 h-10 rounded-lg hover:bg-gray-800 text-gray-400 font-medium text-sm transition-colors">
              2
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </main>

      {/* Governance Proposal Panel */}
      <GovernanceProposalPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        property={selectedProperty}
      />
    </div>
  )
}
