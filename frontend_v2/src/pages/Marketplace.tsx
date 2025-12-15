import { useState } from 'react'
import Topbar from '../layouts/Topbar'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import PropertyCard from '../components/PropertyCard'
import PropertyDetailPanel from '../components/PropertyDetailPanel'
import arrowdownIcon from '../assets/arrowdown.svg'

interface Property {
  id: number
  name: string
  location: string
  locationDetail: string
  type: string
  typeColor: string
  image: string
  vacancyRate: string
  annualYield: string
  totalValue: string
  stoPrice: string
  fundingPercentage: number
  investors: number
  description: string
  highlights: string[]
  dividendCycle: string
  nextDividend: string
}

export default function Marketplace() {
  const [visibleCount, setVisibleCount] = useState(6)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const properties: Property[] = [
    {
      id: 1,
      name: '강남 파이낸스 허브 타워 A',
      location: '서울, 대한민국',
      locationDetail: '서울특별시 강남구 테헤란로 152',
      type: '상업용',
      typeColor: 'text-[#1ABCF7] border-[#1ABCF7]/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvW63qZV6K-N-4Usv64ZtwjFMH42E6IHDxXU3O2JMKatuPXGHcZwz-7mu07QQilkcWrw5b8wxuZnMjfBF5HUvhWxSHxhm84a_Oa_lvY-0b1dEtTV4LYJB2z4qyU52GYnnuJPJLbNhJxrUSiBo0iRV4i2dKTW7swhWBbgba6HVQFshKgVQZdGV2KlxoewkCXglSlRAXuDcz4pKppdrjPvvaIP9qgD29s-LkM_LHMGZNrIkRdIqqBCUYXyfsH_V-h_PDmgpN6O1gbx4',
      vacancyRate: '2.5%',
      annualYield: '6.8%',
      totalValue: '$45M',
      stoPrice: '$50.00',
      fundingPercentage: 75,
      investors: 3250,
      description: '강남 파이낸스 허브 타워 A는 서울의 랜드마크로서 지하 7층, 지상 30층 규모의 프라임급 오피스 빌딩입니다. 2020년 준공되어 최신식 내진 설계와 친환경 건축 자재를 사용하였으며, LEED Gold 인증을 획득했습니다. 입주사 임직원을 위한 프리미엄 라운지, 피트니스 센터, 대형 컨퍼런스 룸 등 다양한 어메니티 시설을 갖추고 있어 공실 리스크가 극히 낮습니다.',
      highlights: [
        '안정적인 수익 구조: 글로벌 IT 기업 및 금융 기관과 10년 장기 임대 계약 체결 (WALE 5.2년)',
        '스마트 빌딩 시스템: AI 기반 에너지 관리 시스템(BEMS) 도입으로 관리비 15% 절감 및 자산 가치 상승',
        '개발 호재: GTX-A/C 노선 삼성역 개통 예정에 따른 광역 교통망 확충 및 주변 상권 가치 동반 상승'
      ],
      dividendCycle: '매월',
      nextDividend: '15일 후'
    },
    {
      id: 2,
      name: '한남 더 힐 4단지',
      location: '서울, 대한민국',
      locationDetail: '서울특별시 용산구 한남동',
      type: '주거용',
      typeColor: 'text-blue-400 border-blue-400/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqqeMwWAJu5M0DcbP-sp7euQ3DyaQbo7lpziImIf4gi6DfRhugIilATcqIXnSxCoJg7Bos7xM59-ZiMdx4MU5OO95cvfT7MUX1-kxpIw5jMIRXuwQm2q2wLfUVkUVtWt0pZJ0gC1E1c9wd0v8C5SnsC5c7Ws3oR_q_P5Z8Gy6I8FuO1a1nSg-OiCLOxopjBCdWBmDsmCVvUkQbmRBys6-_qU68hCwW4yI_dEaFHtPxdKg_UYOmJHT-ug9OOGLyQMol3nvSc6NpP88',
      vacancyRate: '0.8%',
      annualYield: '4.2%',
      totalValue: '$12M',
      stoPrice: '$25.00',
      fundingPercentage: 92,
      investors: 1102,
      description: '한남 더 힐은 서울에서 가장 프리미엄한 주거 단지 중 하나로, 한강 조망과 최상급 주거 환경을 자랑합니다. 24시간 컨시어지 서비스와 최고급 커뮤니티 시설을 갖추고 있습니다.',
      highlights: [
        '프리미엄 입지: 한강 조망과 편리한 교통 접근성',
        '높은 임대 수요: 외국계 기업 임원 및 고소득층 선호 단지',
        '안정적 자산가치: 역대 최저 공실률 유지'
      ],
      dividendCycle: '분기',
      nextDividend: '45일 후'
    },
    {
      id: 3,
      name: '인천 물류 센터 B',
      location: '인천, 대한민국',
      locationDetail: '인천광역시 연수구 송도국제도시',
      type: '산업용',
      typeColor: 'text-purple-400 border-purple-400/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrqVWnw7u2PA0fys35tGuTWc5vLMKSgBMQDwFWIoInHQiTcgR1S-qlRqpaDjhrKGyRe-z_BsVqlPnPIjt9fTKOcFZpG8ks1BMLt7P3Y1o2jsUP5QdaQf11ljrO7r36RUu-iJrpHu8CXjt51Nq2g5Y3Sq9OdFsB6SleXpLTgvhhrp0O98aIUmz1_SazrsEPAnC8YzbNuoDOFkiklseZr-oYeA4QF3Rp3JdNtCH21DHOyiDmht0HMgNCaUYE3k7X-8nqBEhKrfxOMUg',
      vacancyRate: '0.0%',
      annualYield: '8.5%',
      totalValue: '$68M',
      stoPrice: '$100.00',
      fundingPercentage: 45,
      investors: 890,
      description: '최첨단 물류 시설로 이커머스 성장에 따른 안정적인 수요를 자랑합니다. 자동화 시스템과 친환경 인증으로 높은 효율성을 실현하고 있습니다.',
      highlights: [
        '높은 수익률: 이커머스 성장으로 물류센터 수요 급증',
        '완전 가동: 100% 임대율로 안정적인 현금흐름',
        '최신 시설: 자동화 물류 시스템 및 친환경 LEED 인증'
      ],
      dividendCycle: '매월',
      nextDividend: '10일 후'
    }
  ]

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6)
  }

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setTimeout(() => setSelectedProperty(null), 300)
  }

  const visibleProperties = properties.slice(0, visibleCount)
  const hasMore = visibleCount < properties.length

  return (
    <div className="min-h-screen bg-black">
      <Topbar isConnected={true} />

      <section className="relative flex flex-col items-center justify-center gap-8 overflow-hidden px-4 text-center" style={{ marginTop: '120px' }}>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-dark via-background-dark to-background-dark opacity-60"></div>

        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-4xl font-black leading-tight tracking-tighter text-white md:text-6xl">
            <span className="text-[#1ABCF7] bg-clip-text bg-linear-to-r from-primary to-accent">미래</span>의 부동산을 소유하세요
          </h1>
          <p className="text-lg text-white md:text-xl">
            높은 수익률, 즉각적인 유동성, 블록체인 투명성을 갖춘 프리미엄 토큰화된 부동산에 투자하세요.
          </p>
        </div>

        <SearchBar />
      </section>

      <div className="w-full border-b border-gray-500 mt-20 "></div>
      <FilterBar />
      <div className="w-full border-b border-gray-500"></div>

      <section className="flex-1 px-4 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-white">추천 부동산</h3>
            <a className="text-sm font-medium text-[#1ABCF7] hover:text-[#A020F0] transition-colors hover:underline" href="#">
              전체 보기 ({properties.length})
            </a>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.id} {...property} onClick={() => handlePropertyClick(property)} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="cursor-pointer flex items-center gap-2 rounded-full border border-gray-600 bg-gray-800 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-700 hover:border-[#1ABCF7]"
              >
                더 많은 자산 보기
                <img src={arrowdownIcon} alt="dropdown" className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Property Detail Panel */}
      <PropertyDetailPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        property={selectedProperty}
      />
    </div>
  )
}
