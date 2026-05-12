import { Contract } from 'ethers'
import { TOKEN_FACTORY_ABI } from '../../ABIs'
import { getProvider } from '../provider'

// TokenFactory 컨트랙트 주소 (환경변수나 config에서 가져오거나 하드코딩)
const TOKEN_FACTORY_ADDRESS = '0x4959CF91F289D61BEA0f177f18291b94dC4Bed35' // 실제 주소

// TokenFactory에 미등록된 컨트랙트의 dividendAddress 수동 매핑
const DIVIDEND_ADDRESS_FALLBACK: Record<string, string> = {
  '0x6f22dE7b12c17896Bb12ec88CCC9B7554c05b30c': '0x89644E13433f4e6Eb07aE42459929DcF906dAeA1',
}

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

// 숫자 인덱스로 Property 정보 가져오기 (TokenFactory는 uint256 인덱스 기반)
export const getPropertyInfo = async (propertyId: string): Promise<PropertyInfo> => {
  const contract = await getTokenFactoryContract()
  const result = await contract.getProperty(propertyId)

  return {
    tokenAddress: result[3],
    dividendAddress: result[5],
    governanceAddress: result[6],
    propertyId: result[0].toString(),
    totalSupply: result[8].toString(),
    tokenPrice: result[9].toString(),
    initialized: result[11],
  }
}

// PropertyToken 컨트랙트 주소로 역방향 조회
export const getPropertyInfoByTokenAddress = async (tokenAddress: string): Promise<PropertyInfo | null> => {
  try {
    const contract = await getTokenFactoryContract()
    const count = Number(await contract.getPropertyCount())

    for (let i = 1; i <= count; i++) {
      const result = await contract.getProperty(i)
      if (result[3].toLowerCase() === tokenAddress.toLowerCase()) {
        return {
          tokenAddress: result[3],
          dividendAddress: result[5],
          governanceAddress: result[6],
          propertyId: result[0].toString(),
          totalSupply: result[8].toString(),
          tokenPrice: result[9].toString(),
          initialized: result[11],
        }
      }
    }
    // TokenFactory에 없으면 fallback 매핑에서 찾기
    const fallbackDividend = DIVIDEND_ADDRESS_FALLBACK[tokenAddress]
    if (fallbackDividend) {
      return {
        tokenAddress,
        dividendAddress: fallbackDividend,
        governanceAddress: '0x0000000000000000000000000000000000000000',
        propertyId: '0',
        totalSupply: '0',
        tokenPrice: '0',
        initialized: true,
      }
    }

    return null
  } catch (error) {
    console.error('TokenAddress로 Property 정보 조회 실패:', error)
    return null
  }
}