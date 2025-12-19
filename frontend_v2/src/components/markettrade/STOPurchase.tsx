import { useState } from 'react'

interface STOPurchaseProps {
  stoPrice: string
  propertyName: string
  propertyLocation?: string
  maxAvailable?: number
  symbol: string
  onNext: (quantity: number) => void
}

export default function STOPurchase({ stoPrice, propertyName, propertyLocation, maxAvailable = 4500, symbol, onNext }: STOPurchaseProps) {
  const [quantity, setQuantity] = useState(0)

  const pricePerToken = parseFloat(stoPrice.replace(/[^0-9.]/g, ''))
  const subtotal = quantity * pricePerToken

  const handleMaxClick = () => {
    setQuantity(maxAvailable)
  }

  const handleNext = () => {
    onNext(quantity)
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">{symbol} 토큰 구매</h2>
        <div className="flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-xs text-gray-400 border border-gray-600">
          <span className="w-2 h-2 rounded-full bg-[#1ABCF7] animate-pulse shadow-[0_0_8px_#1ABCF7]"></span>
          GIWA Sepolia Tesnet 네트워크
        </div>
      </div>

      {/* Property Info */}
      <div className="mb-8 rounded-xl bg-gray-900 border border-gray-600 p-5">
        <div className="flex items-start gap-4">
          <div className="flex w-12 h-12 items-center justify-center rounded-lg bg-[#1ABCF7]/10 text-[#1ABCF7] shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-1">구매 대상 부동산</p>
            <h3 className="text-lg font-bold text-white mb-1.5">{propertyName}</h3>
            {propertyLocation && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{propertyLocation}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-8 h-8 items-center justify-center rounded-full bg-[#1ABCF7] text-black font-bold text-sm shadow-[0_0_10px_rgba(26,188,247,0.4)]">
            1
          </div>
          <span className="text-xs font-medium text-white">수량</span>
        </div>
        <div className="h-px flex-1 bg-[#1ABCF7]/50 mx-2"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-8 h-8 items-center justify-center rounded-full border border-gray-600 bg-black text-gray-400 font-bold text-sm">
            2
          </div>
          <span className="text-xs font-medium text-gray-400">확인</span>
        </div>
        <div className="h-px flex-1 bg-gray-600 mx-2"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-8 h-8 items-center justify-center rounded-full border border-gray-600 bg-black text-gray-400 font-bold text-sm">
            3
          </div>
          <span className="text-xs font-medium text-gray-400">완료</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Token Price Info */}
        <div className="rounded-xl bg-linear-to-br from-[#1ABCF7]/10 to-[#A020F0]/5 border border-[#1ABCF7]/30 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex w-10 h-10 items-center justify-center rounded-full bg-[#1ABCF7]/20 text-[#1ABCF7]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">1 {symbol} 토큰 가격</p>
                <p className="text-2xl font-bold text-white">{pricePerToken.toLocaleString()} KRWT</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1ABCF7]/20 px-3 py-1 text-xs font-bold text-[#1ABCF7]">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                현재가
              </span>
            </div>
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            구매 수량 ({symbol})
          </label>
          <div className="relative group">
            <input
              className="block w-full rounded-xl border border-gray-600 bg-black p-4 pr-32 text-lg text-white placeholder:text-gray-600 focus:border-[#1ABCF7] focus:ring-1 focus:ring-[#1ABCF7] transition-all outline-none"
              placeholder="수량 입력"
              type="number"
              value={quantity === 0 ? '' : quantity}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  setQuantity(0)
                } else {
                  const num = parseInt(value)
                  if (!isNaN(num)) {
                    setQuantity(Math.max(0, num))
                  }
                }
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right">
              <span className="block text-sm font-bold text-white">{symbol}</span>
              <span className="block text-xs text-gray-400">~{subtotal.toLocaleString()} KRWT</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>구매 가능: {maxAvailable.toLocaleString()} {symbol}</span>
            <button
              onClick={handleMaxClick}
              className="text-[#1ABCF7] hover:text-white transition-colors"
            >
              최대
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="rounded-xl bg-black/50 p-4 border border-gray-600 space-y-3 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-white">총 결제 금액</span>
            <div className="text-right">
              <span className="block text-xl font-bold text-[#1ABCF7] drop-shadow-[0_0_8px_rgba(26,188,247,0.3)]">
                {subtotal.toLocaleString()} KRWT
              </span>
              <span className="block text-xs text-gray-400">{quantity} {symbol} x {pricePerToken.toLocaleString()} KRWT</span>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handleNext}
          disabled={quantity === 0}
          className={`w-full rounded-xl py-4 text-base font-bold transition-all transform ${
            quantity === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'cursor-pointer bg-[#1ABCF7] text-black shadow-[0_0_20px_rgba(26,188,247,0.4)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-0.5'
          }`}
        >
          {quantity === 0 ? '수량을 입력해주세요' : '구매 진행하기'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          '구매 진행하기'를 클릭하시면 NovaTerra의{' '}
          <a className="text-[#1ABCF7] hover:underline hover:text-white transition-colors" href="#">
            이용약관
          </a>{' '}
          및{' '}
          <a className="text-[#1ABCF7] hover:underline hover:text-white transition-colors" href="#">
            토큰 판매 계약
          </a>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}
