import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import Topbar from '../layouts/Topbar'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import PropertyCard from '../components/PropertyCard'
import arrowdownIcon from '../assets/arrowdown.svg'

export default function Marketplace() {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [visibleCount, setVisibleCount] = useState(6)

  const properties = [
    {
      id: 1,
      name: '강남 파이낸스 허브 타워 A',
      location: '서울, 대한민국',
      type: '상업용',
      typeColor: 'text-[#1ABCF7] border-[#1ABCF7]/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvW63qZV6K-N-4Usv64ZtwjFMH42E6IHDxXU3O2JMKatuPXGHcZwz-7mu07QQilkcWrw5b8wxuZnMjfBF5HUvhWxSHxhm84a_Oa_lvY-0b1dEtTV4LYJB2z4qyU52GYnnuJPJLbNhJxrUSiBo0iRV4i2dKTW7swhWBbgba6HVQFshKgVQZdGV2KlxoewkCXglSlRAXuDcz4pKppdrjPvvaIP9qgD29s-LkM_LHMGZNrIkRdIqqBCUYXyfsH_V-h_PDmgpN6O1gbx4',
      vacancyRate: '2.5%',
      annualYield: '6.8%',
      totalValue: '$45M',
      stoPrice: '$50.00',
      fundingPercentage: 75,
      investors: 3250,
    },
    {
      id: 2,
      name: '한남 더 힐 4단지',
      location: '서울, 대한민국',
      type: '주거용',
      typeColor: 'text-blue-400 border-blue-400/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqqeMwWAJu5M0DcbP-sp7euQ3DyaQbo7lpziImIf4gi6DfRhugIilATcqIXnSxCoJg7Bos7xM59-ZiMdx4MU5OO95cvfT7MUX1-kxpIw5jMIRXuwQm2q2wLfUVkUVtWt0pZJ0gC1E1c9wd0v8C5SnsC5c7Ws3oR_q_P5Z8Gy6I8FuO1a1nSg-OiCLOxopjBCdWBmDsmCVvUkQbmRBys6-_qU68hCwW4yI_dEaFHtPxdKg_UYOmJHT-ug9OOGLyQMol3nvSc6NpP88',
      vacancyRate: '0.8%',
      annualYield: '4.2%',
      totalValue: '$12M',
      stoPrice: '$25.00',
      fundingPercentage: 92,
      investors: 1102,
    },
    {
      id: 3,
      name: '인천 물류 센터 B',
      location: '인천, 대한민국',
      type: '산업용',
      typeColor: 'text-purple-400 border-purple-400/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrqVWnw7u2PA0fys35tGuTWc5vLMKSgBMQDwFWIoInHQiTcgR1S-qlRqpaDjhrKGyRe-z_BsVqlPnPIjt9fTKOcFZpG8ks1BMLt7P3Y1o2jsUP5QdaQf11ljrO7r36RUu-iJrpHu8CXjt51Nq2g5Y3Sq9OdFsB6SleXpLTgvhhrp0O98aIUmz1_SazrsEPAnC8YzbNuoDOFkiklseZr-oYeA4QF3Rp3JdNtCH21DHOyiDmht0HMgNCaUYE3k7X-8nqBEhKrfxOMUg',
      vacancyRate: '0.0%',
      annualYield: '8.5%',
      totalValue: '$68M',
      stoPrice: '$100.00',
      fundingPercentage: 45,
      investors: 890,
    },
    {
      id: 4,
      name: '성수 레드브릭 레인',
      location: '서울, 대한민국',
      type: '상가',
      typeColor: 'text-orange-400 border-orange-400/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1QRowud8kr-F3SmLua9cFzIUUTSMNiKJ4F6wtursITYzcg8YGEdIKbGcDXkctCntYpjVkS4SxLU8x_vaJbr_Q9tNc35UX9jUyNn1brxlGuSLKVLwYXHcht2nDGC8zGwNAv8GiU6VYQuWD8_WGHy8TZR_i6sR3XhAkW2CxyxKhTuYyI-vzaixIFm1h7pMzi_ntd0lDoCni386Q5wKdMxzmyKSjqwxJSlA5sklhmEFG7VyYXxa02jCVHu8uS0Oj7yd5FcAOK20aH2U',
      vacancyRate: '5.0%',
      annualYield: '5.9%',
      totalValue: '$8.5M',
      stoPrice: '$10.00',
      fundingPercentage: 20,
      investors: 450,
    },
    {
      id: 5,
      name: '여의도 테크 타워',
      location: '서울, 대한민국',
      type: '상업용',
      typeColor: 'text-[#1ABCF7] border-[#1ABCF7]/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIaLY_SdQrVhDGAxBxkH_LMcld34Bi82LR3CYAFf-clDDxYJYkX9Bbra0v8znvbatyzdVCQUIKPocbMen3CMNUGv3FC_DxhG2OfB4oQC8_Gxx8pJvemVWC2Nfj0mA2ukuHA_-UMM7H3ZIZ_P8lw1-dS97bF1Ft3HXwNv6FNEmTMmq3U2oy2bpNE3XDAAF2-j8gIljfkRoiLNB_5EEEP53rBlP39w823oUECH55H9kT8DYcTH-mx0mVXIp0ET1nX2ZNCvJjrFxb_ZE',
      vacancyRate: '1.2%',
      annualYield: '7.1%',
      totalValue: '$120M',
      stoPrice: '$75.00',
      fundingPercentage: 98,
      investors: 5600,
    },
    {
      id: 6,
      name: '부산 그랜드 오션 뷰',
      location: '부산, 대한민국',
      type: '숙박시설',
      typeColor: 'text-pink-400 border-pink-400/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7uExUQYspcffVb24n559iFGquVjyALBvs_lTBC_4KphNVjLqFwREGisvtvN1IK3un7wrWTm9Z1BZBwJ3KEBpSGCGAo3bHdI-Rz5zDqg82OrSBr7eqFTql-lc6JuhBDzeLjtciHmYXrGBxQEyhDR-nNP4H3JC4kZyE_zGl7-UXqGqkSmSENtdPYR5dCFfSry-SoKwBtmrVb8yThmQP82BbRKUZ6tyLEXvkkuxXvUB1UgjwI49i1KrZDIxt56yA3PdzAXPS5BdcCfc',
      vacancyRate: '계절성',
      annualYield: '9.4%',
      totalValue: '$32M',
      stoPrice: '$100.00',
      fundingPercentage: 12,
      investors: 205,
    },
    {
      id: 7,
      name: '판교 테크노밸리 A동',
      location: '경기, 대한민국',
      type: '상업용',
      typeColor: 'text-[#1ABCF7] border-[#1ABCF7]/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvW63qZV6K-N-4Usv64ZtwjFMH42E6IHDxXU3O2JMKatuPXGHcZwz-7mu07QQilkcWrw5b8wxuZnMjfBF5HUvhWxSHxhm84a_Oa_lvY-0b1dEtTV4LYJB2z4qyU52GYnnuJPJLbNhJxrUSiBo0iRV4i2dKTW7swhWBbgba6HVQFshKgVQZdGV2KlxoewkCXglSlRAXuDcz4pKppdrjPvvaIP9qgD29s-LkM_LHMGZNrIkRdIqqBCUYXyfsH_V-h_PDmgpN6O1gbx4',
      vacancyRate: '3.1%',
      annualYield: '7.5%',
      totalValue: '$85M',
      stoPrice: '$60.00',
      fundingPercentage: 65,
      investors: 2800,
    },
    {
      id: 8,
      name: '제주 힐링 리조트',
      location: '제주, 대한민국',
      type: '숙박시설',
      typeColor: 'text-pink-400 border-pink-400/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7uExUQYspcffVb24n559iFGquVjyALBvs_lTBC_4KphNVjLqFwREGisvtvN1IK3un7wrWTm9Z1BZBwJ3KEBpSGCGAo3bHdI-Rz5zDqg82OrSBr7eqFTql-lc6JuhBDzeLjtciHmYXrGBxQEyhDR-nNP4H3JC4kZyE_zGl7-UXqGqkSmSENtdPYR5dCFfSry-SoKwBtmrVb8yThmQP82BbRKUZ6tyLEXvkkuxXvUB1UgjwI49i1KrZDIxt56yA3PdzAXPS5BdcCfc',
      vacancyRate: '계절성',
      annualYield: '8.2%',
      totalValue: '$28M',
      stoPrice: '$80.00',
      fundingPercentage: 55,
      investors: 680,
    },
  ]

  const getConnectedWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].address)
        }
      }
    } catch (error) {
      console.error('지갑 주소 가져오기 실패:', error)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getConnectedWallet()
  }, [])

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6)
  }

  const visibleProperties = properties.slice(0, visibleCount)
  const hasMore = visibleCount < properties.length

  return (
    <div className="min-h-screen bg-black">
      <Topbar isConnected={true} walletAddress={walletAddress} />

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
              <PropertyCard key={property.id} {...property} />
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
    </div>
  )
}
