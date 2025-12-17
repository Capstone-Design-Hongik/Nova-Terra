import { useState, useEffect } from 'react'
import { getTotalClaimable } from '../../apis/blockchain/contracts/dividendDistributor'
import { getUserBalance } from '../../apis/blockchain/contracts/propertyToken'
import { getPropertyInfo } from  '../../apis/blockchain/contracts/tokenFactory'


interface PortfolioDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  asset: {
    id: string
    name: string
    location: string
    image?: string
    status: 'active' | 'preparing'
    holdingAmount: number
    currentValue: number
    unclaimedRewards: number
    // contractAddress: string  //이따 id로 바꿔 
    symbol: string
  } | null
  onClaimClick?: () => void
}

export default function PortfolioDetailPanel({ isOpen, onClose, asset, onClaimClick }: PortfolioDetailPanelProps) {
  // 블록체인 데이터 상태 관리
  const [blockchainData, setBlockchainData] = useState({
    holdingAmount: asset?.holdingAmount || 0,
    unclaimedRewards: asset?.unclaimedRewards || 0,
    isLoading: false,
  })

  // 블록체인 데이터 로드
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!asset || !isOpen) return

      try {
        setBlockchainData(prev => ({ ...prev, isLoading: true }))

        // 1. TokenFactory에서 Property 정보 가져오기 (dividendAddress 얻기 위해)
        const propertyInfo = await getPropertyInfo(asset.id)

        // 2. 보유 수량 조회 (PropertyToken)
        const balance = await getUserBalance(propertyInfo.tokenAddress)

        // 3. 미청구 배당금 조회 (DividendDistributor)
        const unclaimedRewards = await getTotalClaimable(propertyInfo.dividendAddress)

        setBlockchainData({
          holdingAmount: Number(balance),
          unclaimedRewards: Number(unclaimedRewards),
          isLoading: false,
        })
      } catch (error) {
        console.error('블록체인 데이터 로드 실패:', error)
        setBlockchainData(prev => ({ ...prev, isLoading: false }))
      }
    }

    loadBlockchainData()
  }, [asset, isOpen])


  // 클레임 함수 (현재 미사용 - 나중에 사용할 수 있음)
  // const handleClaimClick = async () => {
  //   if (!asset) return

  //   try {
  //     setBlockchainData(prev => ({ ...prev, isLoading: true }))

  //     // 1. 먼저 dividendAddress 가져오기
  //     const propertyInfo = await getPropertyInfo(asset.id)

  //     // 2. 모든 배당금 청구
  //     const txHashes = await claimAllDividends(propertyInfo.dividendAddress)

  //     console.log('청구 완료! 트랜잭션:', txHashes)
  //     alert(`배당금 청구가 완료되었습니다!\n트랜잭션: ${txHashes.join(', ')}`)

  //     // 3. 데이터 새로고침
  //     const unclaimedRewards = await getTotalClaimable(propertyInfo.dividendAddress)
  //     setBlockchainData(prev => ({
  //       ...prev,
  //       unclaimedRewards: Number(unclaimedRewards),
  //       isLoading: false,
  //     }))

  //     onClaimClick?.()
  //   } catch (error) {
  //     console.error('클레임 실패:', error)
  //     alert('배당금 청구에 실패했습니다: ' + (error as Error).message)
  //     setBlockchainData(prev => ({ ...prev, isLoading: false }))
  //   }
  // }

  if (!asset) return null

  const isActive = asset.status === 'active'
  const statusColor = isActive ? 'text-[#1ABCF7] border-[#1ABCF7]/30' : 'text-gray-400 border-gray-600'
  const statusText = isActive ? '운영중' : '준비중'

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      ></div>

      {/* Panel */}
      <div
        className={`fixed right-0 z-50 w-full md:w-1/2 overflow-y-auto bg-black border-l border-gray-600 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 left-4 z-10 float-left ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 border border-gray-600 text-white transition-all hover:bg-gray-700 hover:border-[#1ABCF7]"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-8 py-12">
          {/* Hero Image Section */}
          <div className="relative mb-8 overflow-hidden rounded-2xl">
            <div className="relative aspect-video w-full bg-gray-900">
              {asset.image ? (
                <img src={asset.image} alt={asset.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>

              {/* Status Badge */}
              <div className={`absolute left-4 top-4 rounded-full bg-black/70 px-4 py-1.5 text-sm font-bold backdrop-blur-md border ${statusColor}`}>
                {statusText}
              </div>

              {/* Property Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-3xl font-black text-white mb-2">{asset.name}</h2>
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{asset.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">투자 현황</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 border border-gray-600 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-2">보유 수량</p>
                <p className="text-2xl font-bold text-white">
                  {blockchainData.isLoading ? '로딩중...' : blockchainData.holdingAmount} {asset.symbol}
                </p>
              </div>
              <div className="bg-gray-800 border border-gray-600 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-2">현재 평가액</p>
                <p className="text-2xl font-bold text-[#1ABCF7]">{asset.currentValue.toLocaleString()} KRWT</p>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">수익 정보</h3>
            <div className="bg-linear-to-br from-gray-800 to-[#1ABCF7]/5 border border-[#1ABCF7]/30 rounded-xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">미수령 수익금</p>
                  <p className="text-3xl font-bold text-[#1ABCF7] drop-shadow-[0_0_10px_rgba(26,188,247,0.5)]">
                    {blockchainData.isLoading ? '로딩중...' : `${blockchainData.unclaimedRewards.toLocaleString()} KRWT`}
                  </p>
                </div>
                <span className="flex h-3 w-3 rounded-full bg-[#1ABCF7] shadow-[0_0_8px_#1ABCF7] animate-pulse mt-2"></span>
              </div>

              {blockchainData.unclaimedRewards > 0 && !blockchainData.isLoading ? (
                <button
                  onClick={onClaimClick}
                  className="cursor-pointer w-full rounded-lg bg-[#1ABCF7] py-3 text-sm font-bold text-black transition-all hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                >
                  수익 클레임 하기
                </button>
              ) : (
                <button
                  disabled
                  className="w-full rounded-lg bg-gray-700 py-3 text-sm font-bold text-gray-400 cursor-not-allowed"
                >
                  클레임 가능한 수익 없음
                </button>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">자산 상세 정보</h3>
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">자산 ID</span>
                  <span className="text-white font-medium">#{asset.id}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">운영 상태</span>
                  <span className={`font-medium ${isActive ? 'text-[#1ABCF7]' : 'text-gray-400'}`}>
                    {statusText}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-700">
                  <span className="text-gray-400">임대 수익 주기</span>
                  <span className="text-white font-medium">매월</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-400">블록체인 네트워크</span>
                  <span className="text-white font-medium">GIWA Sepolia Testnet</span>
                </div>
              </div>  
            </div>
          </div>

          {/* Transaction History */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">거래 내역</h3>
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <div>
                    <p className="text-white font-medium">STO 구매</p>
                    <p className="text-xs text-gray-400 mt-1">2023.09.15</p>
                  </div>
                  <span className="text-white font-medium">{asset.holdingAmount} STO</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <div>
                    <p className="text-white font-medium">임대 수익 수령</p>
                    <p className="text-xs text-gray-400 mt-1">2023.10.01</p>
                  </div>
                  <span className="text-green-400 font-medium">+KRWT 85,000</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-white font-medium">임대 수익 수령</p>
                    <p className="text-xs text-gray-400 mt-1">2023.11.01</p>
                  </div>
                  <span className="text-green-400 font-medium">+KRWT 85,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
