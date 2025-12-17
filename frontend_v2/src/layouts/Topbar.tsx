import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import copyIcon from '../assets/copy.svg'
import OnChainIDModal from '../components/OnChainIDModal'

interface TopbarProps {
  onConnectWallet?: () => void
  isConnected?: boolean
  walletAddress?: string
}

export default function Topbar({ onConnectWallet, isConnected, walletAddress: externalWalletAddress }: TopbarProps) {
  const location = useLocation()
  const [internalWalletAddress, setInternalWalletAddress] = useState<string>('')
  const [isIDModalOpen, setIsIDModalOpen] = useState(false)

  useEffect(() => {
    if (!externalWalletAddress) {
      const getConnectedWallet = async () => {
        try {
          if (typeof window.ethereum !== 'undefined') {
            const provider = new BrowserProvider(window.ethereum)
            const accounts = await provider.listAccounts()
            if (accounts.length > 0) {
              setInternalWalletAddress(accounts[0].address)
            }
          }
        } catch (error) {
          console.error('지갑 주소 가져오기 실패:', error)
        }
      }

      getConnectedWallet()
    }
  }, [externalWalletAddress])

  const walletAddress = externalWalletAddress || internalWalletAddress

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      alert('지갑 주소가 복사되었습니다!')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white bg-background-dark/95 px-6 py-4 backdrop-blur-md lg:px-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold leading-tight tracking-tight text-white">
          NovaTerra
        </h2>
      </div>

      <nav className="hidden items-center gap-8 md:flex">
        <Link
          to="/marketplace"
          className={`text-sm text-white transition-colors hover:text-primary ${location.pathname === '/marketplace' ? 'font-bold' : 'font-medium'}`}
        >
          마켓플레이스
        </Link>
        <Link
          to="/trade"
          className={`text-sm text-white transition-colors hover:text-primary ${location.pathname === '/trade' ? 'font-bold' : 'font-medium'}`}
        >
          거래
        </Link>
        <Link
          to="/dao"
          className={`text-sm text-white transition-colors hover:text-primary ${location.pathname === '/dao' ? 'font-bold' : 'font-medium'}`}
        >
          DAO
        </Link>
        <Link
          to="/portfolio"
          className={`text-sm text-white transition-colors hover:text-primary ${location.pathname === '/portfolio' ? 'font-bold' : 'font-medium'}`}
        >
          포트폴리오
        </Link>
      </nav>

      <div className="flex items-center gap-4 relative">
        {isConnected && walletAddress ? (
          <>
            <button
              onClick={handleCopyAddress}
              className="cursor-pointer flex flex-row items-center justify-center gap-2.5 rounded-full bg-[#1ABCF7] py-3 pr-5 pl-7 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
            >
              <img src={copyIcon} alt="copy" className="cursor-pointer w-4 h-4" />
              {formatAddress(walletAddress)}
            </button>
            <button
              onClick={() => setIsIDModalOpen(true)}
              className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border-2 border-[#1ABCF7] text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
              title="온체인 신분증 보기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </button>

            <OnChainIDModal
              isOpen={isIDModalOpen}
              onClose={() => setIsIDModalOpen(false)}
            />
          </>
        ) : (
          <button
            onClick={onConnectWallet}
            className="flex flex-col items-center justify-center gap-2.5 rounded-full bg-[#1ABCF7] py-3 pr-5 pl-7 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
          >
            지갑 연결
          </button>
        )}
      </div>
    </header>
  )
}
