import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import Topbar from '../layouts/Topbar'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'

export default function Marketplace() {
  const [walletAddress, setWalletAddress] = useState<string>('')

  const getConnectedWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].address)
        }
      }
    } catch (error) {
      console.error('지갑 주소 가져오기 실패:', error)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getConnectedWallet()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <Topbar isConnected={true} walletAddress={walletAddress} />

      <section className="relative flex flex-col items-center justify-center gap-8 overflow-hidden px-4 text-center" style={{ marginTop: '120px' }}>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-dark via-background-dark to-background-dark opacity-60"></div>

        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-4xl font-black leading-tight tracking-tighter text-white md:text-6xl">
            <span className="text-[#1ABCF7] bg-clip-text bg-linear-to-r from-primary to-accent">미래</span>의 부동산을 소유하세요
          </h1>
          <p className="text-lg text-white md:text-xl">
            높은 수익률, 즉각적인 유동성, 블록체인 투명성을 갖춘 프리미엄 토큰화된 부동산에 투자하세요.
          </p>
        </div>

        <SearchBar />
      </section>

      <div className="w-full border-b border-gray-500 mt-20 "></div>
      <FilterBar />
      <div className="w-full border-b border-gray-500"></div>
    </div>
  )
}
