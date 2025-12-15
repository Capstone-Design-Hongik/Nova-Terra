# Nova-Terra - 부동산 토큰화 플랫폼

ERC-3643 표준 기반 부동산 Security Token 발행 플랫폼

## 📋 목차
- [시스템 개요](#시스템-개요)
- [사전 준비: KRWT 배포](#사전-준비-krwt-배포)
- [빠른 배포 (스크립트)](#빠른-배포-스크립트)
- [컨트랙트 배포 순서](#컨트랙트-배포-순서)
- [배포 후 설정](#배포-후-설정)
- [투자자 온보딩](#투자자-온보딩)
- [Foundry 사용법](#foundry-사용법)

---

## 🎯 시스템 개요

### 주요 기능
- ✅ KYC 기반 신원 검증 (Giwa Chain 연동)
- ✅ 규제 준수 (락업, 투자한도, 보유비율 제한)
- ✅ 배당금 자동 분배 (스냅샷 기반)
- ✅ 거버넌스 투표 (토큰 보유자 의사결정)

### 아키텍처
```
Identity Layer: KYC/신원 증명
    ↓
Compliance Layer: 규제 준수 모듈
    ↓
Token Layer: Security Token (PropertyToken)
    ↓
Application Layer: 배당/거버넌스
```

---

## 🏦 사전 준비: KRWT 배포

Nova-Terra 시스템은 결제 및 배당 지급을 위해 **KRWT (Korean Won Token)**를 사용합니다.
전체 시스템 배포 전에 먼저 KRWT를 배포해야 합니다.

### KRWT 배포 방법

```bash
# .env 파일에 PRIVATE_KEY와 RPC_URL 설정
source .env

# KRWT 배포 스크립트 실행
forge script script/DeployKRWT.s.sol:DeployKRWT \
  --rpc-url $RPC_URL \
  --broadcast

# 배포된 KRWT 주소를 .env에 추가
# KRWT_ADDRESS=0x...
```

배포 완료 후 출력되는 KRWT 주소를 `.env` 파일의 `KRWT_ADDRESS`에 저장하세요.

**KRWT info**:
- 이름: Korean Won Token
- 심볼: KRWT
- 초기 발행량: 10억 KRWT
- 소유자: 배포자 주소
- 기능: Mint (Owner), Burn (Anyone)

---

## ⚡ 빠른 배포 (스크립트)

배포 스크립트가 **2개로 분리**되어 있습니다:

1. **`DeployInfrastructure.s.sol`** - 관리자가 **한 번만** 실행 (Identity + Compliance + TokenFactory)
2. **`DeployProperty.s.sol`** - 백엔드가 **부동산마다** 실행 (PropertyToken + Apps + Configuration)

---

### 📦 Step 1: 인프라 배포 (관리자 - 한 번만)

전체 시스템의 기반 인프라를 배포합니다. **한 번만 실행**하면 됩니다.

#### 1-1. 환경 변수 설정

```bash
# .env.example을 복사
cp .env.example .env

# .env 파일 수정
PRIVATE_KEY=0x...
KRWT_ADDRESS=0x...  # DeployKRWT.s.sol로 먼저 배포한 KRWT 주소
RPC_URL=https://rpc.giwa.network
```

#### 1-2. 인프라 배포 실행

```bash
source .env
forge script script/DeployInfrastructure.s.sol:DeployInfrastructure \
  --rpc-url $RPC_URL \
  --broadcast
```

#### 1-3. 배포 결과를 .env에 추가

배포 완료 후 콘솔에 출력되는 주소들을 `.env`에 추가하세요:

```bash
IDENTITY_REGISTRY=0x...
COMPLIANCE=0x...
TOKEN_FACTORY=0x...
```

**배포되는 컨트랙트**:
- ✅ TrustedIssuersRegistry
- ✅ ClaimTopicsRegistry
- ✅ IdentityRegistry
- ✅ ModularCompliance
- ✅ TokenFactory

---

### 🏢 Step 2: 부동산 토큰 배포 (백엔드 - 부동산마다)

각 부동산마다 PropertyToken과 관련 컨트랙트를 배포합니다.

#### 2-1. 부동산 정보 설정

`.env` 파일에 부동산 정보를 추가하세요:

```bash
# PropertyToken 설정
PROPERTY_NAME="Gangnam Tower Token"
PROPERTY_SYMBOL="GANG"
PROPERTY_VALUE=10000000000  # 100억 원
TOKEN_PRICE=1000000         # 100만 원

# Compliance Module 설정
MAX_BALANCE_PERCENT=1000    # 10%
```

#### 2-2. 부동산 토큰 배포 실행

```bash
source .env
forge script script/DeployProperty.s.sol:DeployProperty \
  --rpc-url $RPC_URL \
  --broadcast
```

#### 2-3. 배포 결과를 DB에 저장

배포 완료 후 출력되는 주소들을 데이터베이스에 저장하세요:

```
PROPERTY_TOKEN=0x...
MAX_BALANCE_MODULE=0x...
DIVIDEND_DISTRIBUTOR=0x...
GOVERNANCE_TOKEN=0x...
GOVERNANCE=0x...
```

**배포되는 컨트랙트** (부동산마다):
- ✅ PropertyToken (via TokenFactory.createPropertyToken)
- ✅ MaxBalanceModule
- ✅ DividendDistributor
- ✅ GovernanceToken
- ✅ Governance
- ✅ Configuration (모듈 등록, 바인딩, 연결)

---

## 🚀 컨트랙트 배포 순서

### Phase 1: 신원 인프라 배포

#### 1-1. TrustedIssuersRegistry 배포
```bash
forge create src/contracts/identity/TrustedIssuersRegistry.sol:TrustedIssuersRegistry \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY>
```
**역할**: 신뢰할 수 있는 Claim 발급 기관 관리
**저장**: `TRUSTED_ISSUERS_REGISTRY=0x...`

#### 1-2. ClaimTopicsRegistry 배포
```bash
forge create src/contracts/identity/ClaimTopicsRegistry.sol:ClaimTopicsRegistry \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY>
```
**역할**: 필요한 Claim 종류 정의 (KYC, 적격투자자, 국적)
**저장**: `CLAIM_TOPICS_REGISTRY=0x...`
**기본값**: TOPIC_KYC(1), TOPIC_ACCREDITED_INVESTOR(2), TOPIC_COUNTRY(3)

#### 1-3. IdentityRegistry 배포
```bash
forge create src/contracts/identity/IdentityRegistry.sol:IdentityRegistry \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  --constructor-args <TRUSTED_ISSUERS_REGISTRY> <CLAIM_TOPICS_REGISTRY>
```
**역할**: 지갑 주소 ↔ ONCHAINID 연결 관리
**저장**: `IDENTITY_REGISTRY=0x...`

---

### Phase 2: 부동산별 토큰 배포

#### 2-1. ModularCompliance 배포
```bash
forge create src/contracts/compliance/ModularCompliance.sol:ModularCompliance \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY>
```
**역할**: 컴플라이언스 모듈 관리자
**저장**: `COMPLIANCE=0x...`

#### 2-2. Compliance 모듈 배포 (선택)

#### 2-3. TokenFactory 배포
```bash
forge create src/contracts/TokenFactory.sol:TokenFactory \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  --constructor-args <IDENTITY_REGISTRY> <KRWT_ADDRESS>
```
**역할**: 부동산 토큰 자동 배포
**저장**: `TOKEN_FACTORY=0x...`

#### 2-4. PropertyToken 생성 (via TokenFactory)
```bash
cast send <TOKEN_FACTORY> \
  "createPropertyToken(string,string,uint256,uint256,address)" \
  "Gangnam Tower Token" "GANG" 10000000000 1000000 <COMPLIANCE> \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY>

# 10000000000 = 총 부동산 가치 100억 원
# 1000000 = 토큰당 가격 100만 원
# → maxSupply = 10,000개 자동 계산
```
**확인**: 이벤트에서 PropertyToken 주소 확인
**저장**: `PROPERTY_TOKEN=0x...`

##### LockupModule (락업 기간)
```bash
forge create src/contracts/compliance/modules/LockupModule.sol:LockupModule \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  --constructor-args <COMPLIANCE> 15552000
  # 15552000 = 6개월 (초 단위)
```
**저장**: `LOCKUP_MODULE=0x...`

##### MaxBalanceModule (보유비율 제한)
```bash
forge create src/contracts/compliance/modules/MaxBalanceModule.sol:MaxBalanceModule \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  --constructor-args <COMPLIANCE> <PROPERTY_TOKEN> 1000
  # 1000 = 10% (10000 = 100%)
```
**저장**: `MAX_BALANCE_MODULE=0x...`
**주의**: PropertyToken 배포 후에 배포 (또는 나중에 token 주소 설정)

##### MaxInvestmentModule (투자한도 제한)
```bash
forge create src/contracts/compliance/modules/MaxInvestmentModule.sol:MaxInvestmentModule \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  --constructor-args <COMPLIANCE> <PROPERTY_TOKEN> 1000000
  # 1000000 = 토큰 1개당 가격 (KRW)
```
**저장**: `MAX_INVESTMENT_MODULE=0x...`
**기본 한도**: 일반투자자 연 1000만원/총 2000만원


#### 2-5. DividendDistributor 배포
```bash
forge create src/contracts/DividendDistributor.sol:DividendDistributor \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  --constructor-args <PROPERTY_TOKEN> <KRWT_ADDRESS>
```
**역할**: 배당금 분배
**저장**: `DIVIDEND_DISTRIBUTOR=0x...`

#### 2-6. GovernanceToken 배포
```bash
forge create src/contracts/governance/GovernanceToken.sol:GovernanceToken \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  --constructor-args <PROPERTY_TOKEN>
```
**역할**: 거버넌스 투표권 토큰
**저장**: `GOVERNANCE_TOKEN=0x...`

#### 2-7. Governance 배포
```bash
forge create src/contracts/governance/Governance.sol:Governance \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  --constructor-args <GOVERNANCE_TOKEN>
```
**역할**: 거버넌스 투표 시스템
**저장**: `GOVERNANCE=0x...`

---

## ⚙️ 배포 후 설정

### 1. Compliance 모듈 등록
```bash
# ModularCompliance에 모듈 추가
cast send <COMPLIANCE> "addModule(address)" <LOCKUP_MODULE> --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
cast send <COMPLIANCE> "addModule(address)" <MAX_BALANCE_MODULE> --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
cast send <COMPLIANCE> "addModule(address)" <MAX_INVESTMENT_MODULE> --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

### 2. Compliance를 PropertyToken에 바인딩
```bash
cast send <COMPLIANCE> "bindToken(address)" <PROPERTY_TOKEN> --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

### 3. 신뢰 발급 기관 등록
```bash
# TrustedIssuersRegistry에 신뢰 기관 추가
# 예: 신한은행이 KYC(1), 국적(3) Claim 발급 가능
cast send <TRUSTED_ISSUERS_REGISTRY> \
  "addTrustedIssuer(address,uint256[])" \
  <신한은행_주소> "[1,3]" \
  --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

### 4. PropertyToken 초기 발행 (의뢰인용)
```bash
# 의뢰인에게 30% (3,000개) 발행
cast send <PROPERTY_TOKEN> \
  "initialMint(address,uint256)" \
  <의뢰인_주소> 3000000000000000000000 \
  --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
  # 3000 * 10^18 (18 decimals)
```

### 5. TokenFactory에 부동산 연결 정보 저장
```bash
# Dividend 주소 설정
cast send <TOKEN_FACTORY> \
  "setDividendContract(bytes32,address)" \
  <PROPERTY_ID> <DIVIDEND_DISTRIBUTOR> \
  --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>

# Governance 주소 설정
cast send <TOKEN_FACTORY> \
  "setGovernanceContract(bytes32,address)" \
  <PROPERTY_ID> <GOVERNANCE> \
  --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

---

## 👥 투자자 온보딩

### 1. 투자자 ONCHAINID 발급
```bash
# 각 투자자마다 ONCHAINID 컨트랙트 배포
forge create src/contracts/identity/ONCHAINID.sol:ONCHAINID \
  --rpc-url <RPC_URL> \
  --private-key <ADMIN_KEY> \
  --constructor-args <투자자_지갑_주소>
```
**저장**: `INVESTOR_ONCHAINID=0x...`

### 2. Claim 발급 (신뢰 기관)
```bash
# 적격투자자 Claim 추가 (topic=2)
cast send <INVESTOR_ONCHAINID> \
  "addClaim(uint256,bytes,uint256,uint256)" \
  2 0x 1704067200 1735689600 \
  --rpc-url <RPC_URL> --private-key <발급기관_KEY>
  # validFrom: 2024-01-01, validTo: 2025-01-01
```

### 3. IdentityRegistry 등록
```bash
cast send <IDENTITY_REGISTRY> \
  "registerIdentity(address,address)" \
  <투자자_지갑> <INVESTOR_ONCHAINID> \
  --rpc-url <RPC_URL> --private-key <ADMIN_KEY>
```

### 4. 투자자 유형 설정 (MaxInvestmentModule)
```bash
# 0 = 일반투자자, 2 = 전문투자자
cast send <MAX_INVESTMENT_MODULE> \
  "setInvestorType(address,uint8)" \
  <투자자_지갑> 0 \
  --rpc-url <RPC_URL> --private-key <ADMIN_KEY>
```

### 5. 토큰 구매 (투자자)
```bash
# Step 1: KRWT approve
cast send <KRWT_ADDRESS> \
  "approve(address,uint256)" \
  <PROPERTY_TOKEN> 100000000 \
  --rpc-url <RPC_URL> --private-key <투자자_KEY>

# Step 2: 토큰 구매 (100개 = 1억 원)
cast send <PROPERTY_TOKEN> \
  "buy(uint256)" \
  100000000000000000000 \
  --rpc-url <RPC_URL> --private-key <투자자_KEY>
```

---

## 💰 배당 분배

### 1. 스냅샷 생성
```bash
cast send <PROPERTY_TOKEN> "snapshot()" \
  --rpc-url <RPC_URL> --private-key <ADMIN_KEY>
```
**확인**: 이벤트에서 `snapshotId` 확인

### 2. 배당금 입금
```bash
# Step 1: KRWT approve
cast send <KRWT_ADDRESS> \
  "approve(address,uint256)" \
  <DIVIDEND_DISTRIBUTOR> 50000000 \
  --rpc-url <RPC_URL> --private-key <ADMIN_KEY>

# Step 2: 배당 생성 (5천만 원)
cast send <DIVIDEND_DISTRIBUTOR> \
  "createDividend(uint256,uint256)" \
  1 50000000 \
  --rpc-url <RPC_URL> --private-key <ADMIN_KEY>
  # 1 = snapshotId
```

### 3. 투자자 배당 청구
```bash
cast send <DIVIDEND_DISTRIBUTOR> \
  "claimDividend(uint256)" \
  1 \
  --rpc-url <RPC_URL> --private-key <투자자_KEY>
```

---

## 🗳️ 거버넌스

### 1. 거버넌스 토큰 발급
```bash
cast send <GOVERNANCE_TOKEN> \
  "mintGovernanceTokens(address)" \
  <투자자_주소> \
  --rpc-url <RPC_URL> --private-key <ADMIN_KEY>
```

### 2. 투표권 위임 (선택)
```bash
cast send <GOVERNANCE_TOKEN> \
  "delegate(address)" \
  <대표자_주소> \
  --rpc-url <RPC_URL> --private-key <투자자_KEY>
```

### 3. 제안 생성
```bash
cast send <GOVERNANCE> \
  "createProposal(string)" \
  "건물 외벽 도색 진행" \
  --rpc-url <RPC_URL> --private-key <투자자_KEY>
```

### 4. 투표
```bash
# true = 찬성, false = 반대
cast send <GOVERNANCE> \
  "vote(uint256,bool)" \
  0 true \
  --rpc-url <RPC_URL> --private-key <투자자_KEY>
```

---

## 🛠️ Foundry 사용법

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

### Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
