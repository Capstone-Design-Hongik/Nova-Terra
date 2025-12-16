import { useState } from 'react'
import emptyHeartIcon from '../../assets/emptyheart.svg'
import heartIcon from '../../assets/heart.svg'
import locationIcon from '../../assets/location.svg'

interface PropertyCardProps {
  id: string
  name: string
  location: string
  type: string
  typeColor: string
  image: string
  occupancyRate: number
  monthlyRent: number
  totalValue: number
  stoPrice: number
  fundingPercentage: number
  investors: number
  onClick?: () => void
  onPurchaseClick?: () => void
}

export default function PropertyCard({
  name,
  location,
  type,
  typeColor,
  image,
  occupancyRate,
  monthlyRent,
  totalValue,
  stoPrice,
  fundingPercentage,
  investors,
  onClick,
  onPurchaseClick,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPurchaseClick) {
      onPurchaseClick()
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer group relative flex flex-col overflow-hidden rounded-xl border border-gray-600 bg-gray-800 shadow-xl transition-all hover:border-[#1ABCF7]/50 hover:shadow-2xl hover:shadow-[#1ABCF7]/10">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-900">
        <div className={`absolute left-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-bold backdrop-blur-md border ${typeColor}`}>
          {type}
        </div>
        <div
          onClick={toggleFavorite}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 backdrop-blur-md hover:bg-white/20 cursor-pointer transition-all"
        >
          <img
            src={isFavorite ? heartIcon : emptyHeartIcon}
            alt="favorite"
            className="w-5 h-5"
          />
        </div>
        <img
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h4 className="text-lg font-bold leading-tight text-white group-hover:text-[#1ABCF7] transition-colors">
            {name}
          </h4>
          <div className="mt-1 flex items-center gap-1 text-sm text-gray-400">
          <img
          className="h-4 w-4"
          src={locationIcon}
        />
            {location}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-gray-600/50 rounded-lg overflow-hidden mb-5">
          <div className="bg-gray-800 p-3">
            <p className="text-xs text-gray-400">임대율</p>
            <p className="font-medium text-white">{(occupancyRate * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-gray-800 p-3">
            <p className="text-xs text-gray-400">월 임대료</p>
            <p className="font-medium text-[#1ABCF7]">KRWT {(monthlyRent / 10000).toFixed(0)}만</p>
          </div>
          <div className="bg-gray-800 p-3">
            <p className="text-xs text-gray-400">총 가치</p>
            <p className="font-medium text-white">KRWT {(totalValue / 100000000).toFixed(1)}억</p>
          </div>
          <div className="bg-gray-800 p-3">
            <p className="text-xs text-gray-400">STO 가격</p>
            <p className="font-medium text-white">KRWT {stoPrice.toFixed(0)}</p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>{fundingPercentage}% 펀딩됨</span>
            <span>{investors.toLocaleString()} 투자자</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-600">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#1ABCF7] to-[#A020F0]"
              style={{ width: `${fundingPercentage}%` }}
            ></div>
          </div>
          <button
            onClick={handleBuyClick}
            className="cursor-pointer mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1ABCF7] py-2.5 text-sm font-bold text-black transition-colors hover:bg-white hover:text-black"
          >
            STO 구매
          </button>
        </div>
      </div>
    </div>
  )
}
