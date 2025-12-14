import { useNavigate } from 'react-router-dom'
import { BrowserProvider } from 'ethers'
import walletIcon from '../assets/wallet.png'

export default function Onboarding() {
  const navigate = useNavigate()

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('메타마스크를 설치해주세요!')
        return
      }

      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])

      const chainId = '0x164CE'

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId,
                  chainName: 'GIWA Sepolia',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://sepolia-rpc.giwa.io'],
                  blockExplorerUrls: ['https://sepolia-explorer.giwa.io'],
                },
              ],
            })
          } catch (addError) {
            console.error('네트워크 추가 실패:', addError)
            alert('네트워크 추가에 실패했습니다.')
            return
          }
        } else {
          console.error('네트워크 전환 실패:', switchError)
          alert('네트워크 전환에 실패했습니다.')
          return
        }
      }

      navigate('/marketplace')
    } catch (error) {
      console.error('지갑 연결 실패:', error)
      alert('지갑 연결에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-white text-6xl font-bold mb-4">
        NovaTerra
      </h1>

      <p className="text-gray-400 text-lg mb-8 text-center ">
        Connect your wallet to start building your decentralized real estate portfolio today.
      </p>

      <button
        onClick={connectWallet}
        className="cursor-pointer bg-[#1ABCF7] text-black font-semibold rounded-lg hover:bg-[#15a8dc] transition duration-200 flex items-center gap-3 py-3 pr-5 pl-7"
      >
        <img src={walletIcon} alt="wallet" className="w-6 h-6" />
        지갑연결
      </button>
    </div>
  )
}
