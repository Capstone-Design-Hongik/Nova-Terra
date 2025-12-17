import { Contract } from 'ethers'
import { DIVIDEND_DISTRIBUTOR_ABI } from '../../ABIs'
import { getProvider, getWalletAddress } from '../provider'

// ============================================
//       컨트랙트 인스턴스 생성
// ============================================
export const getDividendDistributorContract = async (
  contractAddress: string
): Promise<Contract> => {
  const provider = await getProvider()
  return new Contract(contractAddress, DIVIDEND_DISTRIBUTOR_ABI, provider)
}

// ============================================
//       기본 정보 조회 (지갑 연결 불필요)
// ============================================
export interface DividendDistributorBasicInfo {
  owner: string
  token: string                    // PropertyToken 주소
  paymentToken: string             // KRWT 주소
  currentDividendId: string
  totalDistributed: string         // 총 분배된 배당금
  contractBalance: string          // 컨트랙트 잔액
  dividendCount: string            // 배당 개수
  contractAddress: string
}

export const getDividendDistributorBasicInfo = async (
  contractAddress: string
): Promise<DividendDistributorBasicInfo> => {
  try {
    const contract = await getDividendDistributorContract(contractAddress)

    const [
      owner,
      token,
      paymentToken,
      currentDividendId,
      totalDistributed,
      contractBalance,
      dividendCount,
    ] = await Promise.all([
      contract.owner(),
      contract.token(),
      contract.paymentToken(),
      contract.currentDividendId(),
      contract.totalDistributed(),
      contract.getContractBalance(),
      contract.getDividendCount(),
    ])

    return {
      owner,
      token,
      paymentToken,
      currentDividendId: currentDividendId.toString(),
      totalDistributed: totalDistributed.toString(),
      contractBalance: contractBalance.toString(),
      dividendCount: dividendCount.toString(),
      contractAddress,
    }
  } catch (error) {
    console.error('배당 컨트랙트 기본 정보 조회 실패:', error)
    throw error
  }
}

// ============================================
//       배당 정보 조회
// ============================================
export interface DividendInfo {
  snapshotId: string
  totalAmount: string              // 총 배당금
  dividendPerToken: string         // 토큰당 배당금
  claimedAmount: string            // 청구된 금액
  timestamp: string                // 배당 생성 시간
  active: boolean                  // 활성화 여부
  unclaimedAmount: string          // 미청구 금액
}

export const getDividendInfo = async (
  contractAddress: string,
  dividendId: number
): Promise<DividendInfo> => {
  try {
    const contract = await getDividendDistributorContract(contractAddress)

    const [dividend, unclaimedAmount] = await Promise.all([
      contract.dividends(dividendId),
      contract.getUnclaimedAmount(dividendId),
    ])

    return {
      snapshotId: dividend[0].toString(),
      totalAmount: dividend[1].toString(),
      dividendPerToken: dividend[2].toString(),
      claimedAmount: dividend[3].toString(),
      timestamp: dividend[4].toString(),
      active: dividend[5],
      unclaimedAmount: unclaimedAmount.toString(),
    }
  } catch (error) {
    console.error('배당 정보 조회 실패:', error)
    throw error
  }
}

// ============================================
//       배당 ID 목록 조회
// ============================================
export const getDividendIds = async (
  contractAddress: string
): Promise<string[]> => {
  try {
    const contract = await getDividendDistributorContract(contractAddress)
    const ids = await contract.getDividendIds()
    return ids.map((id: any) => id.toString())
  } catch (error) {
    console.error('배당 ID 목록 조회 실패:', error)
    throw error
  }
}

// ============================================
//       사용자별 청구 가능 배당금 조회 (지갑 필요)
// ============================================
export const getClaimableDividend = async (
  contractAddress: string,
  dividendId: number,
  holderAddress?: string
): Promise<string> => {
  try {
    const contract = await getDividendDistributorContract(contractAddress)
    const holder = holderAddress || (await getWalletAddress())

    const claimable = await contract.getClaimableDividend(dividendId,
holder)
    return claimable.toString()
  } catch (error) {
    console.error('청구 가능 배당금 조회 실패:', error)
    throw error
  }
}

export const getTotalClaimable = async (
  contractAddress: string,
  holderAddress?: string
): Promise<string> => {
  try {
    const contract = await getDividendDistributorContract(contractAddress)
    const holder = holderAddress || (await getWalletAddress())

    const total = await contract.getTotalClaimable(holder)
    return total.toString()
  } catch (error) {
    console.error('전체 청구 가능 배당금 조회 실패:', error)
    throw error
  }
}

// ============================================
//       청구 여부 확인
// ============================================
export const isClaimedDividend = async (
  contractAddress: string,
  dividendId: number,
  holderAddress?: string
): Promise<boolean> => {
  try {
    const contract = await getDividendDistributorContract(contractAddress)
    const holder = holderAddress || (await getWalletAddress())

    return await contract.claimed(dividendId, holder)
  } catch (error) {
    console.error('배당 청구 여부 확인 실패:', error)
    throw error
  }
}

// ============================================
//       전체 정보 한번에 조회 (지갑 필요)
// ============================================
export interface DividendDistributorFullInfo extends
DividendDistributorBasicInfo {
  userTotalClaimable: string       // 사용자 전체 청구 가능 금액
  userAddress: string
}

export const getDividendDistributorFullInfo = async (
  contractAddress: string
): Promise<DividendDistributorFullInfo> => {
  try {
    const basicInfo = await
getDividendDistributorBasicInfo(contractAddress)
    const userAddress = await getWalletAddress()
    const userTotalClaimable = await getTotalClaimable(contractAddress,
userAddress)

    return {
      ...basicInfo,
      userTotalClaimable,
      userAddress,
    }
  } catch (error) {
    console.error('배당 컨트랙트 전체 정보 조회 실패:', error)
    throw error
  }
}
