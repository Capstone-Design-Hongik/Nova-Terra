import { BrowserProvider } from 'ethers' 

// ============================================
//          1. 메타마스크 연결 (topbar 가져옴)
// ============================================
export const getProvider = async (): Promise<BrowserProvider> => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask가 설치되지 않았습니다')
  }
  return new BrowserProvider(window.ethereum)
}

/**
 * 연결된 지갑 주소 가져오기
 * Topbar.tsx 패턴 그대로 재사용
 */
export const getWalletAddress = async (): Promise<string> => {
  const provider = await getProvider()
  const accounts = await provider.listAccounts()

  if (accounts.length === 0) {
    throw new Error('연결된 지갑이 없습니다')
  }

  return accounts[0].address
}