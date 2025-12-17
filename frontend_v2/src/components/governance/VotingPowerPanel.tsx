import { useMemo } from 'react'
import PropertyVotingPowerItem from './PropertyVotingPowerItem'

interface PropertyVotingPower {
  id: string
  propertyName: string
  location: string
  votingPower: string
  isDelegated: boolean
  delegatedTo?: string
  image?: string
}

interface VotingPowerPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function VotingPowerPanel({ isOpen, onClose }: VotingPowerPanelProps) {
  const properties = useMemo<PropertyVotingPower[]>(() => {
    if (!isOpen) return []

    // Mock data - 실제로는 API나 props에서 받아올 데이터
    return [
      {
        id: '1',
        propertyName: 'Gangnam Tower B',
        location: 'Gangnam-gu, Seoul',
        votingPower: '2,450',
        isDelegated: false,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8rm4evMFoHKbpqQi0RJGbOBcwB_W2Qz8bUsplE83jLT3rz04Cojj5ajIwVEfU7IyPlqQojbqcvnqf_0ggdcHOe45OEZAD1aWbQczDPc6bhsI1AF6fTZKbiz33QhvUs-tSpEW2khR0G1QJH-AeinZzQzeyHKnFABu3X_6E_hXhcYzOaI1GlU0cV_e9th1kZ7X9Jc6OMrJO6oOcbR_QhB5pP6t5iYoit5apGx9jUBunH6iopAVaQNh3Rv8pN7DlNIx-_Cc0xVl9-nY',
      },
      {
        id: '2',
        propertyName: 'Yeouido Office A',
        location: 'Yeouido-dong, Seoul',
        votingPower: '5,320',
        isDelegated: true,
        delegatedTo: '에이전트 스미스',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaNJVm9Eq2KhglrBGi6r7O-fT2foooh0MKmN5AhUAlAl_AYZt4Hm9_lzrc75meEposKvQJeBGtIWBAaJ6vJ8_qzw64sTX0Bt09nbxBzFlYXwcg3y11LV9dL0ur11MxV-OoEsShuo-37L7PJgMsfqmC4QPDMVO3y5JXxmrMRmNfYSoDG5zTf9bDq-UAkocipQoNhoP-bnK5hyKwXSrTni_FF6bWGD-REIKIQOQQFq8CxeuEGRPBBb3dlICNYbX_uMBWXjM2zvGWE1o',
      },
      {
        id: '3',
        propertyName: 'Pangyo Tech Site C',
        location: 'Pangyo, Gyeonggi',
        votingPower: '1,850',
        isDelegated: false,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCerICwrF9VZVEOU7ZPjr8AIbaXRddFZa6MXZ16I13i_bzVyQT6cGs8YRE4uI0r87Zhm0buAGSOmgGZmw5gPCZEJ3SftUdw9POryrQWno2d1tBSJmB6Lbsi2-bAJeNm0W40YvyfAkTYfwL5W-UMegstJixJtWfwaIWPofsaqiZfJyO-4DwTqbzu0_NMwcW9vCxuo_z9GqcqdePPlN9xVipYr8mwk5EqTtXbUR2kYdvK2Dxroru5nxvsFBn61QIkQAMDKArDDKdtNNg',
      },
      {
        id: '4',
        propertyName: 'Busan Logistics Hub',
        location: 'Busan Port District',
        votingPower: '1,230',
        isDelegated: true,
        delegatedTo: '에이전트 김',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSXkFT46o-WUj4k7mjr4_dTlyJQ2X9Qx3-FPEs5_owU1h9kF9BS9FE4otkWlNkdqEk_gV0izQOLz4YY6aMeFkQt55lxmWhtL4BrTVQV5bL2vk8QRWU584kXuFhK8NPlr9H1Fj0eLwVgoZZXQqMRVdB8hru-EV0X6uWMGMTR3FkoaJaZuAh3QQWaLqozOV0YDwq0DatbpX-6U871bedvZhuGwKWIuKG5tAenQzByrx3derQbs67G36v468cr2Vpo0F63PszuOhPtrY',
      },
      {
        id: '5',
        propertyName: 'Seongsu Retail Block',
        location: 'Seongsu-dong, Seoul',
        votingPower: '1,600',
        isDelegated: false,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEqqXmPxa38_ILxWbV2bKdliudUkrFTPNB2C17KBk9eat5jlhZuLxCpgePLNa2cwojV-aB1HDRl3Tmrg9Y8GU3Xg3z5LWjvS3FQzf776zJ7nAwtxLodtlA8xhgCZ_YGsaqGpf_OPU4ZnfYOExVG9E12vgE3JPKqpAVT6100qHjcjKglKzpuKoVct35Nocyrete048lXJJN_B1EhpteBXyEfANSI8HKUPJ1ZEraVdLQnZTs4fXjPxCt8wG6gUJfhID38LL6VQONI1M',
      },
    ]
  }, [isOpen])

  const totalVotingPower = useMemo(() => {
    return properties.reduce((sum, prop) => {
      const power = parseInt(prop.votingPower.replace(/,/g, ''))
      return sum + power
    }, 0)
  }, [properties])

  const directHoldings = useMemo(() => {
    return properties.filter((p) => !p.isDelegated).reduce((sum, prop) => {
      const power = parseInt(prop.votingPower.replace(/,/g, ''))
      return sum + power
    }, 0)
  }, [properties])

  const delegatedPower = useMemo(() => {
    return properties.filter((p) => p.isDelegated).reduce((sum, prop) => {
      const power = parseInt(prop.votingPower.replace(/,/g, ''))
      return sum + power
    }, 0)
  }, [properties])

  return (
    <>
      {/* Backdrop - Left half transparent, right half dark */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '60px' }}
        onClick={onClose}
      >
        {/* Left half - transparent */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2"></div>
        {/* Right half - dark backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Panel */}
      <div
        className={`fixed right-0 w-full md:w-1/2 bg-black border-l border-gray-600 shadow-2xl transform transition-transform duration-300 ease-out z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px', height: 'calc(100vh - 60px)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <svg className="w-8 h-8 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
              </svg>
              나의 투표권
            </h1>
            <p className="text-gray-400">부동산별 투표권 현황을 확인하세요</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-linear-to-br from-[#1ABCF7]/10 to-transparent border border-[#1ABCF7]/30 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">총 투표권</p>
              <p className="text-white text-2xl font-bold">{totalVotingPower.toLocaleString()}</p>
              <p className="text-[#1ABCF7] text-xs mt-1">NVT</p>
            </div>
            <div className="bg-linear-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">직접 보유</p>
              <p className="text-white text-2xl font-bold">{directHoldings.toLocaleString()}</p>
              <p className="text-green-400 text-xs mt-1">
                {totalVotingPower > 0 ? ((directHoldings / totalVotingPower) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="bg-linear-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">위임됨</p>
              <p className="text-white text-2xl font-bold">{delegatedPower.toLocaleString()}</p>
              <p className="text-purple-400 text-xs mt-1">
                {totalVotingPower > 0 ? ((delegatedPower / totalVotingPower) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>

          {/* Properties List */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">부동산별 투표권 ({properties.length})</h2>
            <div className="space-y-3">
              {properties.map((property) => (
                <PropertyVotingPowerItem key={property.id} {...property} />
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              투표권 안내
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-[#1ABCF7]">•</span>
                <span>투표권은 보유한 부동산 토큰 수량에 비례합니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1ABCF7]">•</span>
                <span>위임한 투표권은 위임받은 사람이 대신 투표할 수 있습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1ABCF7]">•</span>
                <span>위임은 언제든지 취소하고 다시 직접 보유로 변경할 수 있습니다.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
