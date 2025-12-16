import { useState, useEffect } from 'react'
import Topbar from '../layouts/Topbar'
import SearchBar from '../components/marketplace/SearchBar'
import FilterBar from '../components/FilterBar'
import PropertyCard from '../components/marketplace/PropertyCard'
import PropertyDetailPanel from '../components/marketplace/PropertyDetailPanel'
import arrowdownIcon from '../assets/arrowdown.svg'
import { getProperties, getBuildingTypeLabel, getBuildingTypeColor } from '../apis/properties'

interface Property {
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
}

export default function Marketplace() {
  const [visibleCount, setVisibleCount] = useState(6)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties()
        const transformedProperties: Property[] = data.map((prop) => ({
          id: prop.id,
          name: prop.name,
          location: prop.address.split(' ').slice(0, 2).join(' '),
          locationDetail: prop.address,
          type: getBuildingTypeLabel(prop.buildingType),
          typeColor: getBuildingTypeColor(prop.buildingType),
          image: prop.coverImageUrl,
          occupancyRate: prop.occupancyRate,
          monthlyRent: prop.totalMonthlyRent,
          totalValue: prop.totalValuation,
          stoPrice: prop.totalValuation / prop.totalTokens,
          fundingPercentage: 75,
          investors: 1000,
          description: prop.description,
          highlights: [
            `주요 임차인: ${prop.majorTenants}`,
            `전용면적: ${prop.exclusiveAreaSqm}㎡`,
            `주차 공간: ${prop.parkingSpaces}면`
          ],
          dividendCycle: '매월',
          nextDividend: '15일 후'
        }))
        setProperties(transformedProperties)
      } catch (error) {
        console.error('부동산 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-surface-dark via-background-dark to-background-dark opacity-60"></div>

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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ABCF7]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleProperties.map((property) => (
                <PropertyCard key={property.id} {...property} onClick={() => handlePropertyClick(property)} />
              ))}
            </div>
          )}
          {!loading && hasMore && (
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
