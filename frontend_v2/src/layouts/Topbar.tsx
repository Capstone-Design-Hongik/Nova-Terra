import { Link } from 'react-router-dom'
import copyIcon from '../assets/copy.svg'

interface TopbarProps {
  onConnectWallet?: () => void
  isConnected?: boolean
  walletAddress?: string
}

export default function Topbar({ onConnectWallet, isConnected, walletAddress }: TopbarProps) {
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
          className="text-sm font-medium text-white transition-colors hover:text-primary"
        >
          마켓플레이스
        </Link>
        <Link
          to="/trade"
          className="text-sm font-medium text-white transition-colors hover:text-primary"
        >
          거래
        </Link>
        <Link
          to="/dao"
          className="text-sm font-medium text-white transition-colors hover:text-primary"
        >
          DAO
        </Link>
        <Link
          to="/portfolio"
          className="text-sm font-medium text-white transition-colors hover:text-primary"
        >
          포트폴리오
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {isConnected && walletAddress ? (
          <button
            onClick={handleCopyAddress}
            className="cursor-pointer flex flex-row items-center justify-center gap-2.5 rounded-full bg-[#1ABCF7] py-3 pr-5 pl-7 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
          >
            <img src={copyIcon} alt="copy" className="w-4 h-4" />
            {formatAddress(walletAddress)}
          </button>
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
