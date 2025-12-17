interface STOCompleteProps {
  propertyName: string
  quantity: number
  totalAmount: number
  transactionId: string
  symbol: string
  onViewPortfolio: () => void
  onExploreMore: () => void
}

export default function STOComplete({
  propertyName,
  quantity,
  totalAmount,
  transactionId,
  symbol,
  onViewPortfolio,
  onExploreMore,
}: STOCompleteProps) {
  const handleCopyTxId = () => {
    navigator.clipboard.writeText(transactionId)
    alert('Transaction ID가 복사되었습니다!')
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 flex flex-col h-full">
      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-8 h-8 items-center justify-center rounded-full bg-[#1ABCF7] text-black font-bold text-sm shadow-[0_0_10px_rgba(26,188,247,0.4)]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs font-medium text-[#1ABCF7]">수량</span>
        </div>
        <div className="h-px flex-1 bg-[#1ABCF7] shadow-[0_0_4px_rgba(26,188,247,0.5)] mx-2"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-8 h-8 items-center justify-center rounded-full bg-[#1ABCF7] text-black font-bold text-sm shadow-[0_0_10px_rgba(26,188,247,0.4)]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs font-medium text-[#1ABCF7]">확인</span>
        </div>
        <div className="h-px flex-1 bg-[#1ABCF7] shadow-[0_0_4px_rgba(26,188,247,0.5)] mx-2"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-8 h-8 items-center justify-center rounded-full bg-[#1ABCF7] text-black font-bold text-sm shadow-[0_0_10px_rgba(26,188,247,0.6)]">
            3
          </div>
          <span className="text-xs font-bold text-white">완료</span>
        </div>
      </div>

      {/* Success Content */}
      <div className="flex flex-col items-center justify-center flex-1 py-4 text-center">
        <div className="mb-6 flex w-24 h-24 items-center justify-center rounded-full bg-[#1ABCF7]/10 text-[#1ABCF7] shadow-[0_0_30px_rgba(26,188,247,0.2)] border border-[#1ABCF7]/20">
          <svg className="w-12 h-12 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">STO 구매 완료!</h1>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
          축하합니다! 성공적으로 투자가 완료되었으며 회원님의 포트폴리오에 자산이 추가되었습니다.
        </p>

        {/* Purchase Summary */}
        <div className="w-full rounded-xl border border-gray-600 bg-black/60 p-6 backdrop-blur-sm mb-8 text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1ABCF7]"></div>
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-400 shrink-0">구매 자산</span>
              <span className="font-bold text-white text-right">{propertyName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">구매 수량</span>
              <span className="font-bold text-[#1ABCF7]">{quantity} {symbol}</span>
            </div>
            <div className="h-px bg-gray-600 w-full border-dashed border-t border-gray-600/50"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">총 결제 금액</span>
              <span className="font-bold text-xl text-white">{totalAmount.toLocaleString()} KRWT</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 gap-2">
              <span className="text-sm text-gray-400">Transaction ID</span>
              <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-1.5 border border-gray-600">
                <a
                  href={`https://sepolia-explorer.giwa.io/tx/${transactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#1ABCF7]/80 hover:text-[#1ABCF7] truncate max-w-37.5 sm:max-w-50 transition-colors cursor-pointer"
                  title="Explorer에서 보기"
                >
                  {transactionId}
                </a>
                <button
                  onClick={handleCopyTxId}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="복사"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          <button
            onClick={onExploreMore}
            className="cursor-pointer order-2 md:order-1 rounded-xl border border-gray-600 bg-transparent py-3.5 text-sm font-bold text-gray-400 hover:border-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            다른 부동산 탐색
          </button>
          <button
            onClick={onViewPortfolio}
            className="cursor-pointer order-1 md:order-2 rounded-xl bg-[#1ABCF7] py-3.5 text-sm font-bold text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all shadow-[0_0_15px_rgba(26,188,247,0.3)] transform hover:-translate-y-0.5"
          >
            내 포트폴리오 보기
          </button>
        </div>

        <div className="mt-6">
          <a
            className="text-xs text-gray-400 hover:text-[#1ABCF7] transition-colors flex items-center justify-center gap-1 group"
            href={`https://sepolia-explorer.giwa.io/tx/${transactionId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            블록체인에서 거래 내역 확인하기
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
