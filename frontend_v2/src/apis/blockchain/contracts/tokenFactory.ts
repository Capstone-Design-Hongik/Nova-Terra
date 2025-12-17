import { Contract } from 'ethers'
import { TOKEN_FACTORY_ABI } from '../../ABIs'
import { getProvider } from '../provider'

// TokenFactory 컨트랙트 주소 (환경변수나 config에서 가져오거나 하드코딩)
const TOKEN_FACTORY_ADDRESS = '0x4959CF91F289D61BEA0f177f18291b94dC4Bed35' // 실제 주소

// PropertyInfo 타입 정의
export interface PropertyInfo {
  tokenAddress: string           // PropertyToken 주소
  dividendAddress: string         // DividendDistributor 주소 <- 우리가 필요한 것!
  governanceAddress: string
  propertyId: string
  totalSupply: string
  tokenPrice: string
  initialized: boolean
}

// TokenFactory 컨트랙트 인스턴스 가져오기
export const getTokenFactoryContract = async (): Promise<Contract> => {
  const provider = await getProvider()
  return new Contract(TOKEN_FACTORY_ADDRESS, TOKEN_FACTORY_ABI, provider)
}

// Property 정보 가져오기
export const getPropertyInfo = async (propertyId: string): Promise<PropertyInfo> => {
  try {
    const contract = await getTokenFactoryContract()
    const result = await contract.getProperty(propertyId)

    console.log('🔍 propertyId:', propertyId)
    console.log('🔍 result:', result)

    return {
      tokenAddress: result[3],           // tokenAddress
      dividendAddress: result[5],        // dividendAddress ← 우리가 원하는 주소!
      governanceAddress: result[6],      // governanceAddress
      propertyId: result[0].toString(),  // propertyId
      totalSupply: result[8].toString(), // maxSupply
      tokenPrice: result[9].toString(),  // tokenPrice
      initialized: result[11]            // active
    }
  } catch (error) {
    console.error('Property 정보 조회 실패:', error)
    throw error
  }
}