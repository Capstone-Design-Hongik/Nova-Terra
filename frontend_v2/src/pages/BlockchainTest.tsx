import { useState } from 'react'
import { getPropertyBasicInfo, getPropertyFullInfo, getUserBalance, getPropertyContract } from '../apis/blockchain/contracts/propertyToken'
import { getProvider } from '../apis/blockchain/provider'
import { switchToGiwaSepolia } from '../apis/blockchain/network'
import { getOnchainIdInfo, getClaim, hasClaim, isValidClaim } from '../apis/blockchain/contracts/onchainId'
import { getDividendDistributorBasicInfo, getDividendInfo, getDividendIds, getClaimableDividend, getTotalClaimable, getDividendDistributorFullInfo } from '../apis/blockchain/contracts/dividendDistributor'
import { getGovernanceTokenBasicInfo, getVotingPower, getPastVotingPower, getGovernanceTokenFullInfo } from '../apis/blockchain/contracts/governanceToken'
import { getGovernanceBasicInfo, getProposalInfo, checkHasVoted, getAllProposals, getActiveProposals, getGovernanceFullInfo } from '../apis/blockchain/contracts/governance'

  export default function BlockchainTest() {
    const [contractAddress, setContractAddress] = useState('')
    const [onchainIdAddress, setOnchainIdAddress] = useState('')
    const [topic, setTopic] = useState('1')  // KYC topic
    const [dividendAddress, setDividendAddress] = useState('')
    const [dividendId, setDividendId] = useState('1')
    const [governanceTokenAddress, setGovernanceTokenAddress] = useState('')
    const [governanceAddress, setGovernanceAddress] = useState('')
    const [proposalId, setProposalId] = useState('0')
    const [timepoint, setTimepoint] = useState('0')

    // PropertyToken 결과
    const [propertyResult, setPropertyResult] = useState<any>(null)
    const [propertyError, setPropertyError] = useState('')
    const [propertyLoading, setPropertyLoading] = useState(false)

    // ONCHAINID 결과
    const [onchainIdResult, setOnchainIdResult] = useState<any>(null)
    const [onchainIdError, setOnchainIdError] = useState('')
    const [onchainIdLoading, setOnchainIdLoading] = useState(false)

    // DividendDistributor 결과
    const [dividendResult, setDividendResult] = useState<any>(null)
    const [dividendError, setDividendError] = useState('')
    const [dividendLoading, setDividendLoading] = useState(false)

    // GovernanceToken 결과
    const [govTokenResult, setGovTokenResult] = useState<any>(null)
    const [govTokenError, setGovTokenError] = useState('')
    const [govTokenLoading, setGovTokenLoading] = useState(false)

    // Governance 결과
    const [governanceResult, setGovernanceResult] = useState<any>(null)
    const [governanceError, setGovernanceError] = useState('')
    const [governanceLoading, setGovernanceLoading] = useState(false)

    // -1. 네트워크 전환 (Giwa Sepolia로 강제 전환)
    const handleSwitchNetwork = async () => {
      setPropertyLoading(true)
      setPropertyError('')
      setPropertyResult(null)

      try {
        console.log('🔄 Giwa Sepolia로 네트워크 전환 중...')
        await switchToGiwaSepolia()

        console.log('✅ 네트워크 전환 완료!')
        setPropertyResult({ message: '✅ Giwa Sepolia로 전환 완료! 이제 "0️⃣ 네트워크 진단" 버튼을 눌러보세요.' })
      } catch (err: any) {
        console.error('❌ 네트워크 전환 실패:', err)
        setPropertyError(err.message)
      } finally {
        setPropertyLoading(false)
      }
    }

    // 0. 네트워크 진단 테스트 (RPC 연결 확인)
    const testNetworkDiagnostic = async () => {
      if (!contractAddress) {
        alert('컨트랙트 주소를 입력하세요')
        return
      }

      setPropertyLoading(true)
      setPropertyError('')
      setPropertyResult(null)

      try {
        console.log('🔍 네트워크 진단 시작...')
        console.log('컨트랙트 주소:', contractAddress)

        // 1. Provider 연결
        console.log('\n1️⃣ Provider 생성 중...')
        const provider = await getProvider()
        console.log('✅ Provider 생성 성공')

        // 2. 네트워크 정보 확인
        console.log('\n2️⃣ 네트워크 정보 확인 중...')
        const network = await provider.getNetwork()
        console.log('chainId:', network.chainId.toString())
        console.log('network name:', network.name)

        // 3. 블록 번호 확인 (RPC 작동 여부)
        console.log('\n3️⃣ 최신 블록 번호 조회 중...')
        const blockNumber = await provider.getBlockNumber()
        console.log('최신 블록 번호:', blockNumber)

        // 4. 컨트랙트 코드 확인 (컨트랙트 존재 여부)
        console.log('\n4️⃣ 컨트랙트 코드 확인 중...')
        const code = await provider.getCode(contractAddress)
        console.log('컨트랙트 코드 길이:', code.length)
        console.log('컨트랙트 코드 (처음 100자):', code.substring(0, 100))

        if (code === '0x' || code.length <= 2) {
          throw new Error('❌ 컨트랙트가 이 주소에 배포되지 않았습니다!')
        }

        console.log('\n✅ 진단 완료!')

        const diagnosticInfo = {
          chainId: network.chainId.toString(),
          networkName: network.name,
          latestBlock: blockNumber,
          contractCodeLength: code.length,
          contractExists: code !== '0x' && code.length > 2
        }

        console.log('진단 결과:', diagnosticInfo)
        setPropertyResult(diagnosticInfo)

      } catch (err: any) {
        console.error('\n❌ 진단 에러!')
        console.error('에러 메시지:', err.message)
        console.error('에러 상세:', err)
        setPropertyError(err.message)
      } finally {
        setPropertyLoading(false)
      }
    }

    // 1. 기본 정보 테스트 (지갑 연결 불필요)
    const testBasicInfo = async () => {
      if (!contractAddress) {
        alert('컨트랙트 주소를 입력하세요')
        return
      }

      setPropertyLoading(true)
      setPropertyError('')
      setPropertyResult(null)

      try {
        console.log('🔍 기본 정보 조회 시작...')
        console.log('컨트랙트 주소:', contractAddress)

        // 단계별 테스트
        console.log('\n1️⃣ Contract 객체 생성 중...')
        const contract = await getPropertyContract(contractAddress)
        console.log('✅ Contract 생성 성공:', contract.target)

        console.log('\n2️⃣ initialized() 확인 중...')
        const initialized = await contract.initialized()
        console.log('initialized:', initialized)

        console.log('\n3️⃣ name() 호출 중...')
        const name = await contract.name()
        console.log('name:', name)

        console.log('\n4️⃣ symbol() 호출 중...')
        const symbol = await contract.symbol()
        console.log('symbol:', symbol)

        console.log('\n5️⃣ 전체 기본 정보 조회 중...')
        const info = await getPropertyBasicInfo(contractAddress)

        console.log('\n✅ 최종 성공!')
        console.log('결과:', info)

        setPropertyResult(info)
      } catch (err: any) {
        console.error('\n❌ 에러 발생!')
        console.error('에러 메시지:', err.message)
        console.error('에러 상세:', err)
        setPropertyError(err.message)
      } finally {
        setPropertyLoading(false)
      }
    }

    // 2. 전체 정보 테스트 (지갑 연결 필요)
    const testFullInfo = async () => {
      if (!contractAddress) {
        alert('컨트랙트 주소를 입력하세요')
        return
      }

      setPropertyLoading(true)
      setPropertyError('')
      setPropertyResult(null)

      try {
        console.log('🔍 전체 정보 조회 시작 (지갑 필요)...')
        console.log('컨트랙트 주소:', contractAddress)

        const info = await getPropertyFullInfo(contractAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setPropertyResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setPropertyError(err.message)
      } finally {
        setPropertyLoading(false)
      }
    }

    // 3. 사용자 보유량 테스트 (지갑 연결 필요)
    const testUserBalance = async () => {
      if (!contractAddress) {
        alert('컨트랙트 주소를 입력하세요')
        return
      }

      setPropertyLoading(true)
      setPropertyError('')
      setPropertyResult(null)

      try {
        console.log('🔍 사용자 보유량 조회 시작...')
        console.log('컨트랙트 주소:', contractAddress)

        const balance = await getUserBalance(contractAddress)

        console.log('✅ 성공!')
        console.log('보유량:', balance)

        setPropertyResult({ balance })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setPropertyError(err.message)
      } finally {
        setPropertyLoading(false)
      }
    }

    // ============================================
    //       ONCHAINID 테스트 함수들
    // ============================================

    // 4. ONCHAINID 기본 정보 테스트
    const testOnchainIdInfo = async () => {
      if (!onchainIdAddress) {
        alert('ONCHAINID 컨트랙트 주소를 입력하세요')
        return
      }

      setOnchainIdLoading(true)
      setOnchainIdError('')
      setOnchainIdResult(null)

      try {
        console.log('🔍 ONCHAINID 정보 조회 시작...')
        console.log('컨트랙트 주소:', onchainIdAddress)

        const info = await getOnchainIdInfo(onchainIdAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setOnchainIdResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setOnchainIdError(err.message)
      } finally {
        setOnchainIdLoading(false)
      }
    }

    // 5. Claim 조회 테스트
    const testGetClaim = async () => {
      if (!onchainIdAddress) {
        alert('ONCHAINID 컨트랙트 주소를 입력하세요')
        return
      }

      setOnchainIdLoading(true)
      setOnchainIdError('')
      setOnchainIdResult(null)

      try {
        console.log('🔍 Claim 조회 시작...')
        console.log('컨트랙트 주소:', onchainIdAddress)
        console.log('Topic:', topic)

        const claimInfo = await getClaim(onchainIdAddress, Number(topic))

        console.log('✅ 성공!')
        console.log('결과:', claimInfo)

        setOnchainIdResult(claimInfo)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setOnchainIdError(err.message)
      } finally {
        setOnchainIdLoading(false)
      }
    }

    // 6. Claim 존재 여부 테스트
    const testHasClaim = async () => {
      if (!onchainIdAddress) {
        alert('ONCHAINID 컨트랙트 주소를 입력하세요')
        return
      }

      setOnchainIdLoading(true)
      setOnchainIdError('')
      setOnchainIdResult(null)

      try {
        console.log('🔍 Claim 존재 여부 확인 중...')
        console.log('컨트랙트 주소:', onchainIdAddress)
        console.log('Topic:', topic)

        const exists = await hasClaim(onchainIdAddress, Number(topic))

        console.log('✅ 성공!')
        console.log('존재 여부:', exists)

        setOnchainIdResult({ exists, topic: Number(topic) })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setOnchainIdError(err.message)
      } finally {
        setOnchainIdLoading(false)
      }
    }

    // 7. Claim 유효성 테스트
    const testIsValidClaim = async () => {
      if (!onchainIdAddress) {
        alert('ONCHAINID 컨트랙트 주소를 입력하세요')
        return
      }

      setOnchainIdLoading(true)
      setOnchainIdError('')
      setOnchainIdResult(null)

      try {
        console.log('🔍 Claim 유효성 확인 중...')
        console.log('컨트랙트 주소:', onchainIdAddress)
        console.log('Topic:', topic)

        const valid = await isValidClaim(onchainIdAddress, Number(topic))

        console.log('✅ 성공!')
        console.log('유효성:', valid)

        setOnchainIdResult({ valid, topic: Number(topic) })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setOnchainIdError(err.message)
      } finally {
        setOnchainIdLoading(false)
      }
    }

    // ============================================
    //    DividendDistributor 테스트 함수들
    // ============================================

    // 8. DividendDistributor 기본 정보 테스트
    const testDividendBasicInfo = async () => {
      if (!dividendAddress) {
        alert('DividendDistributor 컨트랙트 주소를 입력하세요')
        return
      }

      setDividendLoading(true)
      setDividendError('')
      setDividendResult(null)

      try {
        console.log('🔍 DividendDistributor 기본 정보 조회 시작...')
        console.log('컨트랙트 주소:', dividendAddress)

        const info = await getDividendDistributorBasicInfo(dividendAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setDividendResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setDividendError(err.message)
      } finally {
        setDividendLoading(false)
      }
    }

    // 9. 특정 배당 정보 조회
    const testDividendInfo = async () => {
      if (!dividendAddress) {
        alert('DividendDistributor 컨트랙트 주소를 입력하세요')
        return
      }

      setDividendLoading(true)
      setDividendError('')
      setDividendResult(null)

      try {
        console.log('🔍 배당 정보 조회 시작...')
        console.log('컨트랙트 주소:', dividendAddress)
        console.log('배당 ID:', dividendId)

        const info = await getDividendInfo(dividendAddress, Number(dividendId))

        console.log('✅ 성공!')
        console.log('결과:', info)

        setDividendResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setDividendError(err.message)
      } finally {
        setDividendLoading(false)
      }
    }

    // 10. 배당 ID 목록 조회
    const testDividendIds = async () => {
      if (!dividendAddress) {
        alert('DividendDistributor 컨트랙트 주소를 입력하세요')
        return
      }

      setDividendLoading(true)
      setDividendError('')
      setDividendResult(null)

      try {
        console.log('🔍 배당 ID 목록 조회 시작...')
        console.log('컨트랙트 주소:', dividendAddress)

        const ids = await getDividendIds(dividendAddress)

        console.log('✅ 성공!')
        console.log('배당 ID 목록:', ids)

        setDividendResult({ dividendIds: ids, count: ids.length })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setDividendError(err.message)
      } finally {
        setDividendLoading(false)
      }
    }

    // 11. 청구 가능 배당금 조회 (특정 배당)
    const testClaimableDividend = async () => {
      if (!dividendAddress) {
        alert('DividendDistributor 컨트랙트 주소를 입력하세요')
        return
      }

      setDividendLoading(true)
      setDividendError('')
      setDividendResult(null)

      try {
        console.log('🔍 청구 가능 배당금 조회 시작...')
        console.log('컨트랙트 주소:', dividendAddress)
        console.log('배당 ID:', dividendId)

        const claimable = await getClaimableDividend(dividendAddress, Number(dividendId))

        console.log('✅ 성공!')
        console.log('청구 가능 금액:', claimable)

        setDividendResult({ dividendId: Number(dividendId), claimableAmount: claimable })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setDividendError(err.message)
      } finally {
        setDividendLoading(false)
      }
    }

    // 12. 전체 청구 가능 배당금 조회
    const testTotalClaimable = async () => {
      if (!dividendAddress) {
        alert('DividendDistributor 컨트랙트 주소를 입력하세요')
        return
      }

      setDividendLoading(true)
      setDividendError('')
      setDividendResult(null)

      try {
        console.log('🔍 전체 청구 가능 배당금 조회 시작...')
        console.log('컨트랙트 주소:', dividendAddress)

        const total = await getTotalClaimable(dividendAddress)

        console.log('✅ 성공!')
        console.log('전체 청구 가능 금액:', total)

        setDividendResult({ totalClaimable: total })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setDividendError(err.message)
      } finally {
        setDividendLoading(false)
      }
    }

    // 13. 전체 정보 조회 (지갑 필요)
    const testFullDividendInfo = async () => {
      if (!dividendAddress) {
        alert('DividendDistributor 컨트랙트 주소를 입력하세요')
        return
      }

      setDividendLoading(true)
      setDividendError('')
      setDividendResult(null)

      try {
        console.log('🔍 DividendDistributor 전체 정보 조회 시작 (지갑 필요)...')
        console.log('컨트랙트 주소:', dividendAddress)

        const info = await getDividendDistributorFullInfo(dividendAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setDividendResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setDividendError(err.message)
      } finally {
        setDividendLoading(false)
      }
    }

    // ============================================
    //    GovernanceToken 테스트 함수들
    // ============================================

    // 14. GovernanceToken 기본 정보 테스트
    const testGovTokenBasicInfo = async () => {
      if (!governanceTokenAddress) {
        alert('GovernanceToken 컨트랙트 주소를 입력하세요')
        return
      }

      setGovTokenLoading(true)
      setGovTokenError('')
      setGovTokenResult(null)

      try {
        console.log('🔍 GovernanceToken 기본 정보 조회 시작...')
        console.log('컨트랙트 주소:', governanceTokenAddress)

        const info = await getGovernanceTokenBasicInfo(governanceTokenAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setGovTokenResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovTokenError(err.message)
      } finally {
        setGovTokenLoading(false)
      }
    }

    // 15. 투표권 조회
    const testVotingPower = async () => {
      if (!governanceTokenAddress) {
        alert('GovernanceToken 컨트랙트 주소를 입력하세요')
        return
      }

      setGovTokenLoading(true)
      setGovTokenError('')
      setGovTokenResult(null)

      try {
        console.log('🔍 투표권 조회 시작...')
        console.log('컨트랙트 주소:', governanceTokenAddress)

        const info = await getVotingPower(governanceTokenAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setGovTokenResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovTokenError(err.message)
      } finally {
        setGovTokenLoading(false)
      }
    }

    // 16. 과거 투표권 조회
    const testPastVotingPower = async () => {
      if (!governanceTokenAddress) {
        alert('GovernanceToken 컨트랙트 주소를 입력하세요')
        return
      }

      setGovTokenLoading(true)
      setGovTokenError('')
      setGovTokenResult(null)

      try {
        console.log('🔍 과거 투표권 조회 시작...')
        console.log('컨트랙트 주소:', governanceTokenAddress)
        console.log('Timepoint:', timepoint)

        const pastVotes = await getPastVotingPower(governanceTokenAddress, Number(timepoint))

        console.log('✅ 성공!')
        console.log('과거 투표권:', pastVotes)

        setGovTokenResult({ timepoint: Number(timepoint), pastVotes })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovTokenError(err.message)
      } finally {
        setGovTokenLoading(false)
      }
    }

    // 17. GovernanceToken 전체 정보 (지갑 필요)
    const testGovTokenFullInfo = async () => {
      if (!governanceTokenAddress) {
        alert('GovernanceToken 컨트랙트 주소를 입력하세요')
        return
      }

      setGovTokenLoading(true)
      setGovTokenError('')
      setGovTokenResult(null)

      try {
        console.log('🔍 GovernanceToken 전체 정보 조회 시작 (지갑 필요)...')
        console.log('컨트랙트 주소:', governanceTokenAddress)

        const info = await getGovernanceTokenFullInfo(governanceTokenAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setGovTokenResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovTokenError(err.message)
      } finally {
        setGovTokenLoading(false)
      }
    }

    // ============================================
    //    Governance 테스트 함수들
    // ============================================

    // 18. Governance 기본 정보 테스트
    const testGovernanceBasicInfo = async () => {
      if (!governanceAddress) {
        alert('Governance 컨트랙트 주소를 입력하세요')
        return
      }

      setGovernanceLoading(true)
      setGovernanceError('')
      setGovernanceResult(null)

      try {
        console.log('🔍 Governance 기본 정보 조회 시작...')
        console.log('컨트랙트 주소:', governanceAddress)

        const info = await getGovernanceBasicInfo(governanceAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setGovernanceResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovernanceError(err.message)
      } finally {
        setGovernanceLoading(false)
      }
    }

    // 19. 제안 정보 조회
    const testProposalInfo = async () => {
      if (!governanceAddress) {
        alert('Governance 컨트랙트 주소를 입력하세요')
        return
      }

      setGovernanceLoading(true)
      setGovernanceError('')
      setGovernanceResult(null)

      try {
        console.log('🔍 제안 정보 조회 시작...')
        console.log('컨트랙트 주소:', governanceAddress)
        console.log('제안 ID:', proposalId)

        const info = await getProposalInfo(governanceAddress, Number(proposalId))

        console.log('✅ 성공!')
        console.log('결과:', info)

        setGovernanceResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovernanceError(err.message)
      } finally {
        setGovernanceLoading(false)
      }
    }

    // 20. 투표 여부 확인
    const testHasVoted = async () => {
      if (!governanceAddress) {
        alert('Governance 컨트랙트 주소를 입력하세요')
        return
      }

      setGovernanceLoading(true)
      setGovernanceError('')
      setGovernanceResult(null)

      try {
        console.log('🔍 투표 여부 확인 시작...')
        console.log('컨트랙트 주소:', governanceAddress)
        console.log('제안 ID:', proposalId)

        const hasVoted = await checkHasVoted(governanceAddress, Number(proposalId))

        console.log('✅ 성공!')
        console.log('투표 여부:', hasVoted)

        setGovernanceResult({ proposalId: Number(proposalId), hasVoted })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovernanceError(err.message)
      } finally {
        setGovernanceLoading(false)
      }
    }

    // 21. 전체 제안 목록 조회
    const testAllProposals = async () => {
      if (!governanceAddress) {
        alert('Governance 컨트랙트 주소를 입력하세요')
        return
      }

      setGovernanceLoading(true)
      setGovernanceError('')
      setGovernanceResult(null)

      try {
        console.log('🔍 전체 제안 목록 조회 시작...')
        console.log('컨트랙트 주소:', governanceAddress)

        const proposals = await getAllProposals(governanceAddress)

        console.log('✅ 성공!')
        console.log('전체 제안 목록:', proposals)

        setGovernanceResult({ proposals, count: proposals.length })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovernanceError(err.message)
      } finally {
        setGovernanceLoading(false)
      }
    }

    // 22. 활성 제안 목록 조회
    const testActiveProposals = async () => {
      if (!governanceAddress) {
        alert('Governance 컨트랙트 주소를 입력하세요')
        return
      }

      setGovernanceLoading(true)
      setGovernanceError('')
      setGovernanceResult(null)

      try {
        console.log('🔍 활성 제안 목록 조회 시작...')
        console.log('컨트랙트 주소:', governanceAddress)

        const proposals = await getActiveProposals(governanceAddress)

        console.log('✅ 성공!')
        console.log('활성 제안 목록:', proposals)

        setGovernanceResult({ activeProposals: proposals, count: proposals.length })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovernanceError(err.message)
      } finally {
        setGovernanceLoading(false)
      }
    }

    // 23. Governance 전체 정보 (지갑 필요)
    const testGovernanceFullInfo = async () => {
      if (!governanceAddress) {
        alert('Governance 컨트랙트 주소를 입력하세요')
        return
      }

      setGovernanceLoading(true)
      setGovernanceError('')
      setGovernanceResult(null)

      try {
        console.log('🔍 Governance 전체 정보 조회 시작 (지갑 필요)...')
        console.log('컨트랙트 주소:', governanceAddress)

        const info = await getGovernanceFullInfo(governanceAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setGovernanceResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setGovernanceError(err.message)
      } finally {
        setGovernanceLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🧪 블록체인 API
  테스트</h1>

          {/* 컨트랙트 주소 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              컨트랙트 주소
            </label>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-800 border border-gray-600
  rounded px-4 py-2 text-white"
            />
          </div>

          {/* 네트워크 전환 버튼 (최우선) */}
          <div className="mb-4">
            <button
              onClick={handleSwitchNetwork}
              disabled={propertyLoading}
              className="w-full bg-red-600 hover:bg-red-700
  disabled:bg-gray-600 px-6 py-4 rounded-lg font-bold transition-colors text-lg"
            >
              🔄 Giwa Sepolia로 네트워크 전환 (chainId: 91342)
              <div className="text-xs mt-1 opacity-70 font-normal">먼저 이 버튼을 눌러주세요!</div>
            </button>
          </div>

          {/* 테스트 버튼들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={testNetworkDiagnostic}
              disabled={propertyLoading}
              className="bg-orange-600 hover:bg-orange-700
  disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
            >
              0️⃣ 네트워크 진단
              <div className="text-xs mt-1 opacity-70">RPC 연결 확인</div>
            </button>

            <button
              onClick={testBasicInfo}
              disabled={propertyLoading}
              className="bg-blue-600 hover:bg-blue-700
  disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
            >
              1️⃣ 기본 정보
              <div className="text-xs mt-1 opacity-70">지갑
  불필요</div>
            </button>

            <button
              onClick={testFullInfo}
              disabled={propertyLoading}
              className="bg-purple-600 hover:bg-purple-700
  disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
            >
              2️⃣ 전체 정보
              <div className="text-xs mt-1 opacity-70">지갑 필요</div>
            </button>

            <button
              onClick={testUserBalance}
              disabled={propertyLoading}
              className="bg-green-600 hover:bg-green-700
  disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
            >
              3️⃣ 보유량
              <div className="text-xs mt-1 opacity-70">지갑 필요</div>
            </button>
          </div>

          {/* PropertyToken 테스트 결과 */}
          {propertyLoading && (
            <div className="bg-yellow-900 border border-yellow-600 rounded p-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                <span>PropertyToken 테스트 중... (F12 → Console 탭 확인)</span>
              </div>
            </div>
          )}

          {propertyError && (
            <div className="bg-red-900 border border-red-600 rounded p-4 mb-4">
              <h3 className="font-bold mb-2">❌ PropertyToken 에러 발생</h3>
              <pre className="text-sm overflow-auto">{propertyError}</pre>
            </div>
          )}

          {propertyResult && (
            <div className="bg-gray-800 border border-gray-600 rounded p-4 mb-4">
              <h3 className="font-bold mb-2 text-green-400">✅ PropertyToken 성공! (F12 → Console에서도 확인)</h3>
              <pre className="text-sm overflow-auto bg-black p-4 rounded">
                {JSON.stringify(propertyResult, null, 2)}
              </pre>
            </div>
          )}

          {/* ONCHAINID 테스트 섹션 */}
          <div className="mt-12 border-t border-gray-600 pt-8">
            <h2 className="text-2xl font-bold mb-6">🆔 ONCHAINID 테스트</h2>

            {/* ONCHAINID 컨트랙트 주소 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                ONCHAINID 컨트랙트 주소
              </label>
              <input
                type="text"
                value={onchainIdAddress}
                onChange={(e) => setOnchainIdAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
              />
            </div>

            {/* Topic 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Topic (1=KYC, 2=AML, 3=Accredited Investor 등)
              </label>
              <input
                type="number"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="1"
                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
              />
            </div>

            {/* ONCHAINID 테스트 버튼들 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={testOnchainIdInfo}
                disabled={onchainIdLoading}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                4️⃣ 기본 정보
                <div className="text-xs mt-1 opacity-70">Owner 조회</div>
              </button>

              <button
                onClick={testGetClaim}
                disabled={onchainIdLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                5️⃣ Claim 조회
                <div className="text-xs mt-1 opacity-70">Topic별 Claim</div>
              </button>

              <button
                onClick={testHasClaim}
                disabled={onchainIdLoading}
                className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                6️⃣ Claim 존재?
                <div className="text-xs mt-1 opacity-70">존재 여부</div>
              </button>

              <button
                onClick={testIsValidClaim}
                disabled={onchainIdLoading}
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                7️⃣ Claim 유효?
                <div className="text-xs mt-1 opacity-70">유효성 확인</div>
              </button>
            </div>

            {/* ONCHAINID 테스트 결과 */}
            {onchainIdLoading && (
              <div className="bg-yellow-900 border border-yellow-600 rounded p-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                  <span>ONCHAINID 테스트 중... (F12 → Console 탭 확인)</span>
                </div>
              </div>
            )}

            {onchainIdError && (
              <div className="bg-red-900 border border-red-600 rounded p-4 mb-4">
                <h3 className="font-bold mb-2">❌ ONCHAINID 에러 발생</h3>
                <pre className="text-sm overflow-auto">{onchainIdError}</pre>
              </div>
            )}

            {onchainIdResult && (
              <div className="bg-gray-800 border border-gray-600 rounded p-4 mb-4">
                <h3 className="font-bold mb-2 text-green-400">✅ ONCHAINID 성공! (F12 → Console에서도 확인)</h3>
                <pre className="text-sm overflow-auto bg-black p-4 rounded">
                  {JSON.stringify(onchainIdResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* DividendDistributor 테스트 섹션 */}
          <div className="mt-12 border-t border-gray-600 pt-8">
            <h2 className="text-2xl font-bold mb-6">💰 DividendDistributor 테스트</h2>

            {/* DividendDistributor 컨트랙트 주소 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                DividendDistributor 컨트랙트 주소
              </label>
              <input
                type="text"
                value={dividendAddress}
                onChange={(e) => setDividendAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
              />
            </div>

            {/* 배당 ID 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                배당 ID (특정 배당 조회용)
              </label>
              <input
                type="number"
                value={dividendId}
                onChange={(e) => setDividendId(e.target.value)}
                placeholder="1"
                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
              />
            </div>

            {/* DividendDistributor 테스트 버튼들 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={testDividendBasicInfo}
                disabled={dividendLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                8️⃣ 기본 정보
                <div className="text-xs mt-1 opacity-70">지갑 불필요</div>
              </button>

              <button
                onClick={testDividendInfo}
                disabled={dividendLoading}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                9️⃣ 배당 정보
                <div className="text-xs mt-1 opacity-70">특정 ID</div>
              </button>

              <button
                onClick={testDividendIds}
                disabled={dividendLoading}
                className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                🔟 ID 목록
                <div className="text-xs mt-1 opacity-70">전체 배당</div>
              </button>

              <button
                onClick={testClaimableDividend}
                disabled={dividendLoading}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                1️⃣1️⃣ 청구가능금
                <div className="text-xs mt-1 opacity-70">특정 ID</div>
              </button>

              <button
                onClick={testTotalClaimable}
                disabled={dividendLoading}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                1️⃣2️⃣ 전체청구금
                <div className="text-xs mt-1 opacity-70">지갑 필요</div>
              </button>

              <button
                onClick={testFullDividendInfo}
                disabled={dividendLoading}
                className="bg-rose-600 hover:bg-rose-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                1️⃣3️⃣ 전체 정보
                <div className="text-xs mt-1 opacity-70">지갑 필요</div>
              </button>
            </div>

            {/* DividendDistributor 테스트 결과 */}
            {dividendLoading && (
              <div className="bg-yellow-900 border border-yellow-600 rounded p-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                  <span>DividendDistributor 테스트 중... (F12 → Console 탭 확인)</span>
                </div>
              </div>
            )}

            {dividendError && (
              <div className="bg-red-900 border border-red-600 rounded p-4 mb-4">
                <h3 className="font-bold mb-2">❌ DividendDistributor 에러 발생</h3>
                <pre className="text-sm overflow-auto">{dividendError}</pre>
              </div>
            )}

            {dividendResult && (
              <div className="bg-gray-800 border border-gray-600 rounded p-4 mb-4">
                <h3 className="font-bold mb-2 text-green-400">✅ DividendDistributor 성공! (F12 → Console에서도 확인)</h3>
                <pre className="text-sm overflow-auto bg-black p-4 rounded">
                  {JSON.stringify(dividendResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* GovernanceToken 테스트 섹션 */}
          <div className="mt-12 border-t border-gray-600 pt-8">
            <h2 className="text-2xl font-bold mb-6">🗳️ GovernanceToken 테스트</h2>

            {/* GovernanceToken 컨트랙트 주소 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                GovernanceToken 컨트랙트 주소
              </label>
              <input
                type="text"
                value={governanceTokenAddress}
                onChange={(e) => setGovernanceTokenAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
              />
            </div>

            {/* Timepoint 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Timepoint (과거 투표권 조회용 - 블록 번호 or 타임스탬프)
              </label>
              <input
                type="number"
                value={timepoint}
                onChange={(e) => setTimepoint(e.target.value)}
                placeholder="0"
                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
              />
            </div>

            {/* GovernanceToken 테스트 버튼들 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={testGovTokenBasicInfo}
                disabled={govTokenLoading}
                className="bg-lime-600 hover:bg-lime-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                1️⃣4️⃣ 기본 정보
                <div className="text-xs mt-1 opacity-70">지갑 불필요</div>
              </button>

              <button
                onClick={testVotingPower}
                disabled={govTokenLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                1️⃣5️⃣ 투표권
                <div className="text-xs mt-1 opacity-70">지갑 필요</div>
              </button>

              <button
                onClick={testPastVotingPower}
                disabled={govTokenLoading}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                1️⃣6️⃣ 과거 투표권
                <div className="text-xs mt-1 opacity-70">지갑+Timepoint</div>
              </button>

              <button
                onClick={testGovTokenFullInfo}
                disabled={govTokenLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                1️⃣7️⃣ 전체 정보
                <div className="text-xs mt-1 opacity-70">지갑 필요</div>
              </button>
            </div>

            {/* GovernanceToken 테스트 결과 */}
            {govTokenLoading && (
              <div className="bg-yellow-900 border border-yellow-600 rounded p-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                  <span>GovernanceToken 테스트 중... (F12 → Console 탭 확인)</span>
                </div>
              </div>
            )}

            {govTokenError && (
              <div className="bg-red-900 border border-red-600 rounded p-4 mb-4">
                <h3 className="font-bold mb-2">❌ GovernanceToken 에러 발생</h3>
                <pre className="text-sm overflow-auto">{govTokenError}</pre>
              </div>
            )}

            {govTokenResult && (
              <div className="bg-gray-800 border border-gray-600 rounded p-4 mb-4">
                <h3 className="font-bold mb-2 text-green-400">✅ GovernanceToken 성공! (F12 → Console에서도 확인)</h3>
                <pre className="text-sm overflow-auto bg-black p-4 rounded">
                  {JSON.stringify(govTokenResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Governance 테스트 섹션 */}
          <div className="mt-12 border-t border-gray-600 pt-8">
            <h2 className="text-2xl font-bold mb-6">🏛️ Governance 테스트</h2>

            {/* Governance 컨트랙트 주소 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Governance 컨트랙트 주소
              </label>
              <input
                type="text"
                value={governanceAddress}
                onChange={(e) => setGovernanceAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
              />
            </div>

            {/* Proposal ID 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Proposal ID (제안 번호)
              </label>
              <input
                type="number"
                value={proposalId}
                onChange={(e) => setProposalId(e.target.value)}
                placeholder="0"
                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
              />
            </div>

            {/* Governance 테스트 버튼들 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={testGovernanceBasicInfo}
                disabled={governanceLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                1️⃣8️⃣ 기본 정보
                <div className="text-xs mt-1 opacity-70">지갑 불필요</div>
              </button>

              <button
                onClick={testProposalInfo}
                disabled={governanceLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                1️⃣9️⃣ 제안 정보
                <div className="text-xs mt-1 opacity-70">Proposal ID</div>
              </button>

              <button
                onClick={testHasVoted}
                disabled={governanceLoading}
                className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                2️⃣0️⃣ 투표 여부
                <div className="text-xs mt-1 opacity-70">지갑 필요</div>
              </button>

              <button
                onClick={testAllProposals}
                disabled={governanceLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                2️⃣1️⃣ 전체 제안
                <div className="text-xs mt-1 opacity-70">전체 목록</div>
              </button>

              <button
                onClick={testActiveProposals}
                disabled={governanceLoading}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                2️⃣2️⃣ 활성 제안
                <div className="text-xs mt-1 opacity-70">활성만</div>
              </button>

              <button
                onClick={testGovernanceFullInfo}
                disabled={governanceLoading}
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
              >
                2️⃣3️⃣ 전체 정보
                <div className="text-xs mt-1 opacity-70">지갑 필요</div>
              </button>
            </div>

            {/* Governance 테스트 결과 */}
            {governanceLoading && (
              <div className="bg-yellow-900 border border-yellow-600 rounded p-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                  <span>Governance 테스트 중... (F12 → Console 탭 확인)</span>
                </div>
              </div>
            )}

            {governanceError && (
              <div className="bg-red-900 border border-red-600 rounded p-4 mb-4">
                <h3 className="font-bold mb-2">❌ Governance 에러 발생</h3>
                <pre className="text-sm overflow-auto">{governanceError}</pre>
              </div>
            )}

            {governanceResult && (
              <div className="bg-gray-800 border border-gray-600 rounded p-4 mb-4">
                <h3 className="font-bold mb-2 text-green-400">✅ Governance 성공! (F12 → Console에서도 확인)</h3>
                <pre className="text-sm overflow-auto bg-black p-4 rounded">
                  {JSON.stringify(governanceResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* 안내 */}
          <div className="mt-8 bg-gray-800 border border-gray-600
  rounded p-6">
            <h3 className="font-bold mb-3">📝 사용 방법</h3>

            <div className="mb-6">
              <h4 className="font-semibold text-white mb-2">🏠 PropertyToken 테스트:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong className="text-red-400">🔄 먼저 "Giwa Sepolia로 네트워크 전환" 버튼 클릭!</strong> → MetaMask 팝업에서 승인</li>
                <li>컨트랙트 주소 입력: <code className="bg-black px-1">0x5b2cfebf524267e3ae91dcef5f4656eee09ccd09</code></li>
                <li>"0️⃣ 네트워크 진단" 버튼 클릭 → chainId가 91342인지 확인</li>
                <li>진단 통과하면 "1️⃣ 기본 정보" 버튼 클릭</li>
                <li><strong>F12 눌러서 Console 탭 확인!</strong> (상세 로그)</li>
              </ol>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <h4 className="font-semibold text-white mb-2">🆔 ONCHAINID 테스트:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>ONCHAINID 컨트랙트 주소 입력</li>
                <li>Topic 번호 입력 (1=KYC, 2=AML, 3=Accredited Investor 등)</li>
                <li>"4️⃣ 기본 정보" 버튼 클릭 → Owner 주소 확인</li>
                <li>"5️⃣ Claim 조회" 버튼 클릭 → Claim 정보 확인</li>
                <li>"6️⃣ Claim 존재?" 버튼 클릭 → 해당 Topic Claim 존재 여부</li>
                <li>"7️⃣ Claim 유효?" 버튼 클릭 → Claim 유효성 검증</li>
              </ol>
            </div>

            <div className="border-t border-gray-600 pt-4 mt-4">
              <h4 className="font-semibold text-white mb-2">💰 DividendDistributor 테스트:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>DividendDistributor 컨트랙트 주소 입력</li>
                <li>"8️⃣ 기본 정보" 버튼 클릭 → 총 분배 배당금, 컨트랙트 잔액 확인</li>
                <li>"🔟 ID 목록" 버튼 클릭 → 모든 배당 ID 확인</li>
                <li>배당 ID 입력 후 "9️⃣ 배당 정보" 버튼 클릭 → 특정 배당 상세 정보</li>
                <li>"1️⃣1️⃣ 청구가능금" 버튼 클릭 → 특정 배당에서 청구 가능한 금액</li>
                <li>"1️⃣2️⃣ 전체청구금" 버튼 클릭 → 모든 배당에서 청구 가능한 총 금액 (지갑 필요)</li>
                <li>"1️⃣3️⃣ 전체 정보" 버튼 클릭 → 기본 정보 + 사용자 청구 가능 금액 (지갑 필요)</li>
              </ol>
            </div>

            <div className="border-t border-gray-600 pt-4 mt-4">
              <h4 className="font-semibold text-white mb-2">🗳️ GovernanceToken 테스트:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>GovernanceToken 컨트랙트 주소 입력</li>
                <li>"1️⃣4️⃣ 기본 정보" 버튼 클릭 → 토큰 이름, 총 공급량, clock 모드 확인</li>
                <li>"1️⃣5️⃣ 투표권" 버튼 클릭 → 현재 투표권, 위임 상태 확인 (지갑 필요)</li>
                <li>Timepoint 입력 (블록 번호 or 타임스탬프)</li>
                <li>"1️⃣6️⃣ 과거 투표권" 버튼 클릭 → 특정 시점의 투표권 확인 (지갑 필요)</li>
                <li>"1️⃣7️⃣ 전체 정보" 버튼 클릭 → 기본 정보 + 사용자 투표권 (지갑 필요)</li>
              </ol>
            </div>

            <div className="border-t border-gray-600 pt-4 mt-4">
              <h4 className="font-semibold text-white mb-2">🏛️ Governance 테스트:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Governance 컨트랙트 주소 입력</li>
                <li>"1️⃣8️⃣ 기본 정보" 버튼 클릭 → 제안 개수, 투표 기간 확인</li>
                <li>"2️⃣1️⃣ 전체 제안" 버튼 클릭 → 모든 제안 목록 확인</li>
                <li>"2️⃣2️⃣ 활성 제안" 버튼 클릭 → 현재 진행 중인 제안만 확인</li>
                <li>Proposal ID 입력 후 "1️⃣9️⃣ 제안 정보" 버튼 클릭 → 특정 제안 상세 정보</li>
                <li>"2️⃣0️⃣ 투표 여부" 버튼 클릭 → 내가 해당 제안에 투표했는지 확인 (지갑 필요)</li>
                <li>"2️⃣3️⃣ 전체 정보" 버튼 클릭 → 기본 정보 + 제안 목록 (지갑 필요)</li>
              </ol>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-xs text-gray-400">
                💡 Tip: chainId가 43113 (Avalanche)가 아닌 91342 (Giwa Sepolia)여야 합니다!
                <br/>
                네트워크 전환 버튼을 누르면 자동으로 Giwa Sepolia로 전환됩니다.
                <br/>
                <br/>
                📌 ONCHAINID는 투자자별 신원 증명 컨트랙트입니다. KYC, AML 등의 Claim을 저장하고 검증합니다.
                <br/>
                📌 DividendDistributor는 임대수익 배당 컨트랙트입니다. PropertyToken 스냅샷 기반으로 배당금을 분배합니다.
                <br/>
                📌 GovernanceToken은 ERC20Votes 기반 거버넌스 토큰입니다. PropertyToken을 기반으로 투표권을 부여하고 위임 기능을 제공합니다.
                <br/>
                📌 Governance는 제안 및 투표 시스템 컨트랙트입니다. GovernanceToken 보유자가 제안을 생성하고 투표할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }