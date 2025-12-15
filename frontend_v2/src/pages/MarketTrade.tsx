import { useParams } from 'react-router-dom'
import Topbar from '../layouts/Topbar'
import PropertyDetail from '../components/PropertyDetail'

export default function MarketTrade() {
  const { id } = useParams()

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
  ]

  const currentProperty = properties.find((p) => p.id === Number(id))

  if (!currentProperty) {
    return (
      <div className="min-h-screen bg-black">
        <Topbar isConnected={true} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-white text-xl">부동산을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Topbar isConnected={true} />

      <PropertyDetail
        name={currentProperty.name}
        location={currentProperty.location}
        type={currentProperty.type}
        typeColor={currentProperty.typeColor}
        image={currentProperty.image}
        vacancyRate={currentProperty.vacancyRate}
        annualYield={currentProperty.annualYield}
        totalValue={currentProperty.totalValue}
        stoPrice={currentProperty.stoPrice}
        fundingPercentage={currentProperty.fundingPercentage}
        investors={currentProperty.investors}
      />
    </div>
  )
}