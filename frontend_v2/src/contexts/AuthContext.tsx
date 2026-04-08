import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { BrowserProvider } from 'ethers'
import { instance } from '../utils/axiosInstance'

interface AuthContextType {
  accessToken: string
  isLoggedIn: boolean
  walletAddress: string
  isWalletConnected: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  connectWallet: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access_token') || '')
  const [walletAddress, setWalletAddress] = useState('')

  // 토큰이 바뀌면 axios 헤더 반영
  useEffect(() => {
    if (accessToken) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    } else {
      delete instance.defaults.headers.common['Authorization']
    }
  }, [accessToken])

  // 페이지 로드 시 기존 연결된 지갑 확인
  useEffect(() => {
    const checkWallet = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            setWalletAddress(accounts[0].address)
          }
        }
      } catch (e) {
        console.error('지갑 확인 실패:', e)
      }
    }
    checkWallet()
  }, [])

  const setTokens = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    setAccessToken(access)
    instance.defaults.headers.common['Authorization'] = `Bearer ${access}`
  }

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
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName: 'GIWA Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia-rpc.giwa.io'],
                blockExplorerUrls: ['https://sepolia-explorer.giwa.io'],
              },
            ],
          })
        } else {
          alert('네트워크 전환에 실패했습니다.')
          return
        }
      }

      const accounts = await provider.listAccounts()
      if (accounts.length > 0) {
        const address = accounts[0].address
        setWalletAddress(address)
        await instance.patch('/api/v1/users/me/wallet', { walletAddress: address })
      }
    } catch (error) {
      console.error('지갑 연결 실패:', error)
      alert('지갑 연결에 실패했습니다.')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isLoggedIn: accessToken !== '',
        walletAddress,
        isWalletConnected: walletAddress !== '',
        setTokens,
        connectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
