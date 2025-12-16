import { useState } from 'react'
import { getPropertyBasicInfo, getPropertyFullInfo, getUserBalance, getPropertyContract } from '../apis/blockchain/contracts/propertyToken'
import { getProvider } from '../apis/blockchain/provider'
import { switchToGiwaSepolia } from '../apis/blockchain/network'

  export default function BlockchainTest() {
    const [contractAddress, setContractAddress] = useState('')
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // -1. 네트워크 전환 (Giwa Sepolia로 강제 전환)
    const handleSwitchNetwork = async () => {
      setLoading(true)
      setError('')
      setResult(null)

      try {
        console.log('🔄 Giwa Sepolia로 네트워크 전환 중...')
        await switchToGiwaSepolia()

        console.log('✅ 네트워크 전환 완료!')
        setResult({ message: '✅ Giwa Sepolia로 전환 완료! 이제 "0️⃣ 네트워크 진단" 버튼을 눌러보세요.' })
      } catch (err: any) {
        console.error('❌ 네트워크 전환 실패:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // 0. 네트워크 진단 테스트 (RPC 연결 확인)
    const testNetworkDiagnostic = async () => {
      if (!contractAddress) {
        alert('컨트랙트 주소를 입력하세요')
        return
      }

      setLoading(true)
      setError('')
      setResult(null)

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
        setResult(diagnosticInfo)

      } catch (err: any) {
        console.error('\n❌ 진단 에러!')
        console.error('에러 메시지:', err.message)
        console.error('에러 상세:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // 1. 기본 정보 테스트 (지갑 연결 불필요)
    const testBasicInfo = async () => {
      if (!contractAddress) {
        alert('컨트랙트 주소를 입력하세요')
        return
      }

      setLoading(true)
      setError('')
      setResult(null)

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

        setResult(info)
      } catch (err: any) {
        console.error('\n❌ 에러 발생!')
        console.error('에러 메시지:', err.message)
        console.error('에러 상세:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // 2. 전체 정보 테스트 (지갑 연결 필요)
    const testFullInfo = async () => {
      if (!contractAddress) {
        alert('컨트랙트 주소를 입력하세요')
        return
      }

      setLoading(true)
      setError('')
      setResult(null)

      try {
        console.log('🔍 전체 정보 조회 시작 (지갑 필요)...')
        console.log('컨트랙트 주소:', contractAddress)

        const info = await getPropertyFullInfo(contractAddress)

        console.log('✅ 성공!')
        console.log('결과:', info)

        setResult(info)
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // 3. 사용자 보유량 테스트 (지갑 연결 필요)
    const testUserBalance = async () => {
      if (!contractAddress) {
        alert('컨트랙트 주소를 입력하세요')
        return
      }

      setLoading(true)
      setError('')
      setResult(null)

      try {
        console.log('🔍 사용자 보유량 조회 시작...')
        console.log('컨트랙트 주소:', contractAddress)

        const balance = await getUserBalance(contractAddress)

        console.log('✅ 성공!')
        console.log('보유량:', balance)

        setResult({ balance })
      } catch (err: any) {
        console.error('❌ 에러:', err)
        setError(err.message)
      } finally {
        setLoading(false)
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
              disabled={loading}
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
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700
  disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
            >
              0️⃣ 네트워크 진단
              <div className="text-xs mt-1 opacity-70">RPC 연결 확인</div>
            </button>

            <button
              onClick={testBasicInfo}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700
  disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
            >
              1️⃣ 기본 정보
              <div className="text-xs mt-1 opacity-70">지갑
  불필요</div>
            </button>

            <button
              onClick={testFullInfo}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700
  disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
            >
              2️⃣ 전체 정보
              <div className="text-xs mt-1 opacity-70">지갑 필요</div>
            </button>

            <button
              onClick={testUserBalance}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700
  disabled:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
            >
              3️⃣ 보유량
              <div className="text-xs mt-1 opacity-70">지갑 필요</div>
            </button>
          </div>

          {/* 로딩 */}
          {loading && (
            <div className="bg-yellow-900 border border-yellow-600 
  rounded p-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 
  border-b-2 border-yellow-400"></div>
                <span>로딩 중... (F12 → Console 탭 확인)</span>
              </div>
            </div>
          )}

          {/* 에러 */}
          {error && (
            <div className="bg-red-900 border border-red-600 rounded 
  p-4 mb-4">
              <h3 className="font-bold mb-2">❌ 에러 발생</h3>
              <pre className="text-sm overflow-auto">{error}</pre>
            </div>
          )}

          {/* 결과 */}
          {result && (
            <div className="bg-gray-800 border border-gray-600 rounded
   p-4">
              <h3 className="font-bold mb-2 text-green-400">✅ 성공!
  (F12 → Console에서도 확인)</h3>
              <pre className="text-sm overflow-auto bg-black p-4 
  rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* 안내 */}
          <div className="mt-8 bg-gray-800 border border-gray-600
  rounded p-6">
            <h3 className="font-bold mb-3">📝 사용 방법</h3>
            <ol className="list-decimal list-inside space-y-2
  text-sm">
              <li><strong className="text-red-400">🔄 먼저 "Giwa Sepolia로 네트워크 전환" 버튼 클릭!</strong> → MetaMask 팝업에서 승인</li>
              <li>컨트랙트 주소 입력: <code className="bg-black px-1">0x5b2cfebf524267e3ae91dcef5f4656eee09ccd09</code></li>
              <li>"0️⃣ 네트워크 진단" 버튼 클릭 → chainId가 91342인지 확인</li>
              <li>진단 통과하면 "1️⃣ 기본 정보" 버튼 클릭</li>
              <li><strong>F12 눌러서 Console 탭 확인!</strong> (상세 로그)</li>
            </ol>

            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-xs text-gray-400">
                💡 Tip: chainId가 43113 (Avalanche)가 아닌 91342 (Giwa Sepolia)여야 합니다!
                <br/>
                네트워크 전환 버튼을 누르면 자동으로 Giwa Sepolia로 전환됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }