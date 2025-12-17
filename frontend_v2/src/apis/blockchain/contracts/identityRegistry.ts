import { Contract } from 'ethers'
import { IDENTITY_REGISTRY_ABI } from '../../ABIs'
import { getProvider, getWalletAddress } from '../provider'

// ============================================
//       Interface 정의
// ============================================

export interface IdentityRegistryBasicInfo {
  owner: string
  trustedIssuersRegistry: string
  claimTopicsRegistry: string
  registeredCount: string
  contractAddress: string
}

export interface IdentityInfo {
  wallet: string
  identityAddress: string
  isRegistered: boolean
  isVerified: boolean
}

export interface IdentityRegistryFullInfo extends IdentityRegistryBasicInfo
  {
  myIdentityInfo: IdentityInfo
}

// ============================================
//       컨트랙트 인스턴스 생성
// ============================================

/**
 * IdentityRegistry 컨트랙트 인스턴스 가져오기
 */
export const getIdentityRegistryContract = async (
  contractAddress: string
): Promise<Contract> => {
  const provider = await getProvider()
  return new Contract(contractAddress, IDENTITY_REGISTRY_ABI, provider)
}

// ============================================
//       기본 정보 조회 (지갑 연결 불필요)
// ============================================

/**
 * IdentityRegistry 기본 정보 가져오기
 */
export const getIdentityRegistryBasicInfo = async (
  contractAddress: string
): Promise<IdentityRegistryBasicInfo> => {
  try {
    const contract = await getIdentityRegistryContract(contractAddress)

    const [
      owner,
      trustedIssuersRegistry,
      claimTopicsRegistry,
      registeredCount,
    ] = await Promise.all([
      contract.owner(),
      contract.trustedIssuersRegistry(),
      contract.claimTopicsRegistry(),
      contract.getRegisteredCount(),
    ])

    return {
      owner,
      trustedIssuersRegistry,
      claimTopicsRegistry,
      registeredCount: registeredCount.toString(),
      contractAddress,
    }
  } catch (error) {
    console.error('IdentityRegistry 기본 정보 조회 실패:', error)
    throw error
  }
}

// ============================================
//       특정 지갑 정보 조회
// ============================================

/**
 * 특정 지갑의 ONCHAINID 주소 조회
 */
export const getIdentityAddress = async (
  contractAddress: string,
  wallet: string
): Promise<string> => {
  const contract = await getIdentityRegistryContract(contractAddress)
  return await contract.identity(wallet)
}

/**
 * 지갑 등록 여부 확인
 */
export const isRegistered = async (
  contractAddress: string,
  wallet: string
): Promise<boolean> => {
  const contract = await getIdentityRegistryContract(contractAddress)
  return await contract.contains(wallet)
}

/**
 * 지갑 검증 여부 확인
 */
export const isVerified = async (
  contractAddress: string,
  wallet: string
): Promise<boolean> => {
  const contract = await getIdentityRegistryContract(contractAddress)
  return await contract.isVerified(wallet)
}

/**
 * 특정 지갑의 전체 정보 조회
 */
export const getIdentityInfo = async (
  contractAddress: string,
  wallet: string
): Promise<IdentityInfo> => {
  try {
    const contract = await getIdentityRegistryContract(contractAddress)

    const [identityAddress, registered, verified] = await Promise.all([
      contract.identity(wallet),
      contract.contains(wallet),
      contract.isVerified(wallet),
    ])

    return {
      wallet,
      identityAddress,
      isRegistered: registered,
      isVerified: verified,
    }
  } catch (error) {
    console.error('IdentityInfo 조회 실패:', error)
    throw error
  }
}

// ============================================
//       등록된 지갑 목록 조회
// ============================================

/**
 * 모든 등록된 지갑 주소 목록
 */
export const getAllRegisteredWallets = async (
  contractAddress: string
): Promise<string[]> => {
  const contract = await getIdentityRegistryContract(contractAddress)
  return await contract.getRegisteredWallets()
}

/**
 * 등록된 모든 지갑의 상세 정보 (병렬 처리)
 */
export const getAllRegisteredIdentities = async (
  contractAddress: string
): Promise<IdentityInfo[]> => {
  try {
    const wallets = await getAllRegisteredWallets(contractAddress)

    // 각 지갑에 대해 병렬로 정보 가져오기
    const promises = wallets.map(wallet => getIdentityInfo(contractAddress,
  wallet))
    return await Promise.all(promises)
  } catch (error) {
    console.error('등록된 Identity 목록 조회 실패:', error)
    throw error
  }
}

// ============================================
//       내 정보 조회 (지갑 연결 필요)
// ============================================

/**
 * 현재 연결된 지갑의 Identity 정보
 */
export const getMyIdentityInfo = async (
  contractAddress: string
): Promise<IdentityInfo> => {
  const wallet = await getWalletAddress()
  return await getIdentityInfo(contractAddress, wallet)
}

// ============================================
//       전체 정보 한번에 조회 (지갑 연결 필요)
// ============================================

/**
 * IdentityRegistry 기본 정보 + 내 Identity 정보
 */
export const getIdentityRegistryFullInfo = async (
  contractAddress: string
): Promise<IdentityRegistryFullInfo> => {
  try {
    const [basicInfo, myInfo] = await Promise.all([
      getIdentityRegistryBasicInfo(contractAddress),
      getMyIdentityInfo(contractAddress),
    ])

    return {
      ...basicInfo,
      myIdentityInfo: myInfo,
    }
  } catch (error) {
    console.error('IdentityRegistry 전체 정보 조회 실패:', error)
    throw error
  }
}