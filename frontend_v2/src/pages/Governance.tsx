import { useState } from 'react'
import Topbar from '../layouts/Topbar'
import GovernancePropertyCard from '../components/governance/GovernancePropertyCard'
import GovernanceProposalPanel from '../components/governance/GovernanceProposalPanel'
import VotingPowerCard from '../components/governance/VotingPowerCard'
import DelegationCard from '../components/governance/DelegationCard'
import VotingPowerPanel from '../components/governance/VotingPowerPanel'

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
  const [isVotingPowerPanelOpen, setIsVotingPowerPanelOpen] = useState(false)

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

      <main className="w-full px-4 md:px-10 py-8 mx-auto max-w-350">
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <VotingPowerCard
            onClick={() => setIsVotingPowerPanelOpen(true)}
            isActive={isVotingPowerPanelOpen}
          />
          <DelegationCard />
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

      {/* Voting Power Panel */}
      <VotingPowerPanel
        isOpen={isVotingPowerPanelOpen}
        onClose={() => setIsVotingPowerPanelOpen(false)}
      />
    </div>
  )
}
