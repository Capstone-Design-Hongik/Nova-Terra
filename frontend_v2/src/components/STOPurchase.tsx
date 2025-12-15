import { useState } from 'react'

interface STOPurchaseProps {
  stoPrice: string
  propertyName: string
  maxAvailable?: number
  onNext: (quantity: number) => void
}

export default function STOPurchase({ stoPrice, maxAvailable = 4500, onNext }: STOPurchaseProps) {
  const [quantity, setQuantity] = useState(10)

  const pricePerToken = parseFloat(stoPrice.replace('$', '')) * 1300
  const subtotal = quantity * pricePerToken
  const platformFee = subtotal * 0.005
  const gasFee = 1500
  const total = subtotal + platformFee + gasFee

  const handleMaxClick = () => {
    setQuantity(maxAvailable)
  }

  const handleNext = () => {
    onNext(quantity)
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">STO 토큰 구매</h2>
        <div className="flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-xs text-gray-400 border border-gray-600">
          <span className="w-2 h-2 rounded-full bg-[#1ABCF7] animate-pulse shadow-[0_0_8px_#1ABCF7]"></span>
          KRW 스테이블 네트워크
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
        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            구매 수량 (STO)
          </label>
          <div className="relative group">
            <input
              className="block w-full rounded-xl border border-gray-600 bg-black p-4 pr-32 text-lg text-white placeholder:text-gray-600 focus:border-[#1ABCF7] focus:ring-1 focus:ring-[#1ABCF7] transition-all outline-none"
              placeholder="0"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right">
              <span className="block text-sm font-bold text-white">STO</span>
              <span className="block text-xs text-gray-400">~₩{subtotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>구매 가능: {maxAvailable.toLocaleString()} STO</span>
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
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">소계 ({quantity} STO x ₩{pricePerToken.toLocaleString()})</span>
            <span className="text-white font-medium">₩{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">플랫폼 수수료 (0.5%)</span>
            <span className="text-white font-medium">₩{platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-400">
              예상 가스비
              <svg className="w-3.5 h-3.5 cursor-help text-gray-400 hover:text-[#1ABCF7] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white font-medium">~₩{gasFee.toLocaleString()} (KRW Stable)</span>
          </div>
          <div className="border-t border-gray-600 pt-3 mt-3 flex justify-between items-center">
            <span className="text-base font-bold text-white">총 예상 비용</span>
            <div className="text-right">
              <span className="block text-xl font-bold text-[#1ABCF7] drop-shadow-[0_0_8px_rgba(26,188,247,0.3)]">
                ₩{total.toLocaleString()}
              </span>
              <span className="block text-xs text-gray-400">KRW Coin 결제</span>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-[#1ABCF7] py-4 text-base font-bold text-black shadow-[0_0_20px_rgba(26,188,247,0.4)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-0.5"
        >
          구매 진행하기 (KRW)
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
