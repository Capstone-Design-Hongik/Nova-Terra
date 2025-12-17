import { Contract } from 'ethers' 
import { PROPERTY_TOKEN_ABI } from '../../ABIs'
import { getProvider, getWalletAddress } from '../provider'


// ============================================
//       3. 컨트랙트 인스턴스 생성
// ============================================
/**
 * PropertyToken 컨트랙트 인스턴스 가져오기
 * @param contractAddress 백엔드에서 받은 컨트랙트 주소
 */
export const getPropertyContract = async (
    contractAddress: string
  ): Promise<Contract> => {
    const provider = await getProvider()
    return new Contract(contractAddress, PROPERTY_TOKEN_ABI, provider)
  }

// ============================================
//       4. 부동산 기본 정보 조회
//          (지갑 연결 불필요)
// ============================================
//부동산 기본 정보 가져오기
export interface PropertyBasicInfo {
  name: string                  // "제주 오션빌리지"
  symbol: string                // "JEJU"
  propertyId: string            // bytes32를 string으로
  maxSupply: string             // 최대 발행량
  totalSupply: string           // 현재 발행량
  remainingSupply: string       // 남은 수량
  tokenPrice: string            // 토큰 1개 가격 (KRWT)
  contractAddress: string       // 컨트랙트 주소
  owner: string                 // 관리자 주소
  paymentToken: string          // KRWT 컨트랙트 주소
  identityRegistry: string      // 신원 검증 컨트랙트
  compliance: string            // 컴플라이언스 컨트랙트
  paused: boolean               // 일시정지 여부
  initialized: boolean          // 초기화 여부
}
/**
 * 부동산 기본 정보 가져오기
 * 지갑 연결 없이도 조회 가능 (public view 함수들)
 * @param contractAddress 컨트랙트 주소
 */
export const getPropertyBasicInfo = async (contractAddress: string): Promise<PropertyBasicInfo> => {
  try {
    const contract = await getPropertyContract(contractAddress)

    // Promise.all로 병렬 처리 (빠름!)
    const [
      name,
      symbol,
      propertyId,
      maxSupply,
      totalSupply,
      remainingSupply,
      tokenPrice,
      owner,
      paymentToken,
      identityRegistry,
      compliance,
      paused,
      initialized,
    ] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.propertyId(),
      contract.maxSupply(),
      contract.totalSupply(),
      contract.remainingSupply(),
      contract.tokenPrice(),
      contract.owner(),
      contract.paymentToken(),
      contract.identityRegistry(),
      contract.compliance(),
      contract.paused(),
      contract.initialized(),
    ])

    return {
      name,
      symbol,
      propertyId,                           // bytes32 그대로 string으로 변환됨
      maxSupply: maxSupply.toString(),      // bigint → string
      totalSupply: totalSupply.toString(),
      remainingSupply: remainingSupply.toString(),
      tokenPrice: tokenPrice.toString(),
      contractAddress,
      owner,
      paymentToken,
      identityRegistry,
      compliance,
      paused,
      initialized,
    }
  } catch (error) {
    console.error('부동산 기본 정보 조회 실패:', error)
    throw error
  }
}
// ============================================
//       5. 사용자 보유량 조회
//          (지갑 연결 필요)
// ============================================
/**
 * 사용자의 토큰 보유량 조회
 * @param contractAddress 컨트랙트 주소
 * @param userAddress 조회할 사용자 주소 (없으면 현재 연결된 지갑)
 */
export const getUserBalance = async (
  contractAddress: string,
  userAddress?: string
): Promise<string> => {
  const contract = await getPropertyContract(contractAddress)

  // userAddress 없으면 현재 지갑 주소 사용
  const address = userAddress || await getWalletAddress()

  const balance = await contract.balanceOf(address)
  return balance.toString()
}


// ============================================
//       6. 전체 정보 한번에 조회
//          (지갑 연결 필요)
// ============================================
export interface PropertyFullInfo extends PropertyBasicInfo {
  userBalance: string           // 사용자 보유량
  userAddress: string           // 사용자 지갑 주소
}
/**
 * 부동산 정보 + 사용자 보유량 한번에 가져오기
 * 포트폴리오, 구매 패널 등에서 사용
 * @param contractAddress 컨트랙트 주소
 */
//부동 산정보 + 사용자 보유량
export const getPropertyFullInfo = async (contractAddress: string): Promise<PropertyFullInfo> => {
  try {
    const contract = await getPropertyContract(contractAddress)
    const userAddress = await getWalletAddress()

    // 모든 정보 한번에 가져오기 (병렬 처리)
    const [
      name,
      symbol,
      propertyId,
      maxSupply,
      totalSupply,
      remainingSupply,
      tokenPrice,
      owner,
      paymentToken,
      identityRegistry,
      compliance,
      paused,
      initialized,
      userBalance,  // 사용자 보유량 추가!
    ] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.propertyId(),
      contract.maxSupply(),
      contract.totalSupply(),
      contract.remainingSupply(),
      contract.tokenPrice(),
      contract.owner(),
      contract.paymentToken(),
      contract.identityRegistry(),
      contract.compliance(),
      contract.paused(),
      contract.initialized(),
      contract.balanceOf(userAddress),  // 사용자 보유량
    ])

    return {
      // 부동산 정보
      name,
      symbol,
      propertyId,
      maxSupply: maxSupply.toString(),
      totalSupply: totalSupply.toString(),
      remainingSupply: remainingSupply.toString(),
      tokenPrice: tokenPrice.toString(),
      contractAddress,
      owner,
      paymentToken,
      identityRegistry,
      compliance,
      paused,
      initialized,

      // 사용자 정보
      userBalance: userBalance.toString(),
      userAddress,
    }
  } catch (error) {
    console.error('전체 정보 조회 실패:', error)
    throw error
  }
}

// ============================================
//       7. STO 구매 (트랜잭션)
// ============================================
export const buyPropertyToken = async (
  contractAddress: string,
  amount: number  // 구매할 STO 수량
): Promise<string> => {
  // 1. provider 가져오기
  const provider = await getProvider()

  // 2. signer 가져오기 (트랜잭션 서명 필요)
  const signer = await provider.getSigner()

  // 3. 컨트랙트 인스턴스 생성 (signer 연결)
  const contract = new Contract(contractAddress,
PROPERTY_TOKEN_ABI, signer)

  // 4. buy 함수 호출
  const tx = await contract.buy(amount)

  // 5. 트랜잭션 완료 대기
  const receipt = await tx.wait()

  // 6. 트랜잭션 해시 반환
  return receipt.hash
}
