package org.landmark.global.blockchain.service;

import lombok.extern.slf4j.Slf4j;
import org.landmark.global.blockchain.config.BlockchainConfig;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Convert;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class BlockchainWalletService {

    @Nullable
    private final Web3j web3j;
    @Nullable
    private final Credentials credentials;
    private final BlockchainConfig blockchainConfig;
    private final DefaultGasProvider gasProvider;

    @Autowired
    public BlockchainWalletService(@Nullable Web3j web3j,
                                    @Nullable Credentials credentials,
                                    BlockchainConfig blockchainConfig,
                                    DefaultGasProvider gasProvider) {
        this.web3j = web3j;
        this.credentials = credentials;
        this.blockchainConfig = blockchainConfig;
        this.gasProvider = gasProvider;
    }

    /* 현재 지갑 주소 조회 */
    public String getWalletAddress() {
        validateInitialized();
        return credentials.getAddress();
    }

    /* 지갑의 네이티브 코인 잔액 조회 */
    public BigDecimal getNativeBalance() {
        validateInitialized();

        try {
            EthGetBalance ethGetBalance = web3j.ethGetBalance(
                    credentials.getAddress(),
                    DefaultBlockParameterName.LATEST
            ).send();

            BigInteger weiBalance = ethGetBalance.getBalance();
            return Convert.fromWei(weiBalance.toString(), Convert.Unit.ETHER);

        } catch (Exception e) {
            log.error("네이티브 코인 잔액 조회 실패", e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_BALANCE_QUERY_FAILED);
        }
    }
    private static final String KRWT_TOKEN_ADDRESS = "0x233E008B74e27d51a88c933F6A1b2c79C8e6A4F3";

    public BigInteger getKrwtBalance(String targetAddress) {
        validateInitialized();

        log.info("KRWT 잔액 조회 시작 - targetAddress: {}", targetAddress);
        log.info("[DEBUG] Snapshot TX FROM: {}", credentials.getAddress());
        try {
            // balanceOf(address account) 함수 정의
            Function function = new Function(
                    "balanceOf",
                    Arrays.asList(new org.web3j.abi.datatypes.Address(targetAddress)),
                    Arrays.asList(new TypeReference<Uint256>() {})
            );

            String encodedFunction = FunctionEncoder.encode(function);

            // ethCall을 사용하여 상태 변경 없이 조회
            org.web3j.protocol.core.methods.response.EthCall response = web3j.ethCall(
                    org.web3j.protocol.core.methods.request.Transaction.createEthCallTransaction(
                            credentials.getAddress(), // 호출 주체
                            KRWT_TOKEN_ADDRESS,      // KRWT 토큰 컨트랙트 주소
                            encodedFunction),
                    DefaultBlockParameterName.LATEST
            ).send();

            if (response.hasError()) {
                log.error("KRWT 잔액 조회 실패 - error: {}", response.getError().getMessage());
                throw new BusinessException(ErrorCode.BLOCKCHAIN_BALANCE_QUERY_FAILED);
            }

            // 결과 디코딩
            List<org.web3j.abi.datatypes.Type> results = org.web3j.abi.FunctionReturnDecoder.decode(
                    response.getValue(), function.getOutputParameters());

            // KRWT는 정수 단위로 가정했으므로 BigInteger로 반환
            return (BigInteger) results.get(0).getValue();

        } catch (Exception e) {
            log.error("KRWT 잔액 조회 중 오류 발생", e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_BALANCE_QUERY_FAILED);
        }
    }

    /* PropertyToken의 총 발행량 조회 (대사용) */
    public BigInteger getTotalSupply(String propertyTokenAddress) {
        validateInitialized();

        log.info("totalSupply 조회 - propertyTokenAddress: {}", propertyTokenAddress);
        try {
            Function function = new Function(
                    "totalSupply",
                    Collections.emptyList(),
                    Arrays.asList(new TypeReference<Uint256>() {})
            );

            String encodedFunction = FunctionEncoder.encode(function);

            org.web3j.protocol.core.methods.response.EthCall response = web3j.ethCall(
                    org.web3j.protocol.core.methods.request.Transaction.createEthCallTransaction(
                            credentials.getAddress(),
                            propertyTokenAddress,
                            encodedFunction),
                    DefaultBlockParameterName.LATEST
            ).send();

            if (response.hasError()) {
                log.error("totalSupply 조회 실패 - error: {}", response.getError().getMessage());
                throw new BusinessException(ErrorCode.BLOCKCHAIN_BALANCE_QUERY_FAILED);
            }

            List<org.web3j.abi.datatypes.Type> results = org.web3j.abi.FunctionReturnDecoder.decode(
                    response.getValue(), function.getOutputParameters());

            BigInteger totalSupply = (BigInteger) results.get(0).getValue();
            log.info("totalSupply 조회 완료 - address: {}, totalSupply: {}", propertyTokenAddress, totalSupply);
            return totalSupply;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("totalSupply 조회 중 오류 발생 - address: {}", propertyTokenAddress, e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_BALANCE_QUERY_FAILED);
        }
    }

    /* PropertyToken 컨트랙트의 snapshot 함수 호출 */
    public BigInteger createSnapshot(String propertyTokenAddress) {
        validateInitialized();

        log.info("Snapshot 생성 시작 - propertyTokenAddress: {}", propertyTokenAddress);

        try {
            // snapshot() 함수 - 파라미터 없음, uint256 리턴
            Function function = new Function(
                "snapshot",
                Collections.emptyList(),
                Arrays.asList(new TypeReference<Uint256>() {})
            );

            String encodedFunction = FunctionEncoder.encode(function);

            // 트랜잭션 매니저 생성
            TransactionManager txManager = new RawTransactionManager(
                web3j,
                credentials,
                blockchainConfig.getChainId()
            );

            // 트랜잭션 전송
            EthSendTransaction transactionResponse = txManager.sendTransaction(
                gasProvider.getGasPrice(),
                gasProvider.getGasLimit(),
                propertyTokenAddress,
                encodedFunction,
                BigInteger.ZERO
            );

            if (transactionResponse.hasError()) {
                log.error("Snapshot 생성 실패 - error: {}", transactionResponse.getError().getMessage());
                throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_FAILED);
            }

            String txHash = transactionResponse.getTransactionHash();
            log.info("Snapshot 트랜잭션 전송 성공 - txHash: {}", txHash);

            // 트랜잭션 영수증 대기 및 조회
            TransactionReceipt receipt = waitForTransactionReceipt(txHash);

            // Snapshot 이벤트에서 snapshotId 추출
            // event Snapshot(uint256 id)
            BigInteger snapshotId = extractSnapshotIdFromReceipt(receipt);
            log.info("Snapshot ID 추출 완료 - snapshotId: {}", snapshotId);

            return snapshotId;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Snapshot 생성 중 오류 발생", e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_FAILED);
        }
    }

    /* DividendDistributor 컨트랙트의 createDividend 함수 호출 */
    public String createDividend(BigInteger snapshotId, BigInteger amount) {
        validateInitialized();

        if (blockchainConfig.getDividendDistributorAddress() == null ||
            blockchainConfig.getDividendDistributorAddress().isEmpty()) {
            throw new BusinessException(ErrorCode.BLOCKCHAIN_NOT_INITIALIZED);
        }

        log.info("배당 생성 시작 - snapshotId: {}, amount: {}", snapshotId, amount);

        try {
            // createDividend(uint256 snapshotId, uint256 amount) 함수
            Function function = new Function(
                "createDividend",
                Arrays.asList(
                    new Uint256(snapshotId),
                    new Uint256(amount)
                ),
                Collections.emptyList()
            );

            String encodedFunction = FunctionEncoder.encode(function);

            // 트랜잭션 매니저 생성
            TransactionManager txManager = new RawTransactionManager(
                web3j,
                credentials,
                blockchainConfig.getChainId()
            );

            // 트랜잭션 전송
            EthSendTransaction transactionResponse = txManager.sendTransaction(
                gasProvider.getGasPrice(),
                gasProvider.getGasLimit(),
                blockchainConfig.getDividendDistributorAddress(),
                encodedFunction,
                BigInteger.ZERO
            );

            if (transactionResponse.hasError()) {
                log.error("배당 생성 실패 - error: {}", transactionResponse.getError().getMessage());
                throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_FAILED);
            }

            String txHash = transactionResponse.getTransactionHash();
            log.info("배당 생성 성공 - txHash: {}, snapshotId: {}, amount: {}", txHash, snapshotId, amount);
            return txHash;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("배당 생성 중 오류 발생 - snapshotId: {}, amount: {}", snapshotId, amount, e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_FAILED);
        }
    }

    /* KYC 컨트랙트에 신원 해시 등록 */
    public String submitKycVerification(String walletAddress, String idHashHex) {
        validateInitialized();

        String contractAddress = blockchainConfig.getKycContractAddress();
        if (contractAddress == null || contractAddress.isBlank()) {
            throw new BusinessException(ErrorCode.BLOCKCHAIN_NOT_INITIALIZED);
        }

        log.info("KYC 온체인 등록 시작 - walletAddress: {}", walletAddress);
        try {
            Function function = new Function(
                    "registerKyc",
                    Arrays.asList(
                            new Address(walletAddress),
                            new Bytes32(hexToBytes32(idHashHex))
                    ),
                    Collections.emptyList()
            );

            TransactionManager txManager = new RawTransactionManager(web3j, credentials, blockchainConfig.getChainId());
            EthSendTransaction tx = txManager.sendTransaction(
                    gasProvider.getGasPrice(), gasProvider.getGasLimit(),
                    contractAddress, FunctionEncoder.encode(function), BigInteger.ZERO
            );

            if (tx.hasError()) {
                log.error("KYC 온체인 등록 실패 - error: {}", tx.getError().getMessage());
                throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_FAILED);
            }

            String txHash = tx.getTransactionHash();
            log.info("KYC 온체인 등록 성공 - txHash: {}", txHash);
            return txHash;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("KYC 온체인 등록 중 오류 발생", e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_FAILED);
        }
    }

    /* Credit 컨트랙트에 신용 점수 등록 */
    public String submitCreditVerification(String walletAddress, String reportHashHex, int score) {
        validateInitialized();

        String contractAddress = blockchainConfig.getCreditContractAddress();
        if (contractAddress == null || contractAddress.isBlank()) {
            throw new BusinessException(ErrorCode.BLOCKCHAIN_NOT_INITIALIZED);
        }

        log.info("Credit 온체인 등록 시작 - walletAddress: {}, score: {}", walletAddress, score);
        try {
            Function function = new Function(
                    "registerCredit",
                    Arrays.asList(
                            new Address(walletAddress),
                            new Bytes32(hexToBytes32(reportHashHex)),
                            new Uint256(BigInteger.valueOf(score))
                    ),
                    Collections.emptyList()
            );

            TransactionManager txManager = new RawTransactionManager(web3j, credentials, blockchainConfig.getChainId());
            EthSendTransaction tx = txManager.sendTransaction(
                    gasProvider.getGasPrice(), gasProvider.getGasLimit(),
                    contractAddress, FunctionEncoder.encode(function), BigInteger.ZERO
            );

            if (tx.hasError()) {
                log.error("Credit 온체인 등록 실패 - error: {}", tx.getError().getMessage());
                throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_FAILED);
            }

            String txHash = tx.getTransactionHash();
            log.info("Credit 온체인 등록 성공 - txHash: {}", txHash);
            return txHash;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Credit 온체인 등록 중 오류 발생", e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_FAILED);
        }
    }

    /* 트랜잭션 영수증 조회 (트랜잭션 성공 여부 확인) */
    public TransactionReceipt getTransactionReceipt(String txHash) {
        validateInitialized();

        try {
            return web3j.ethGetTransactionReceipt(txHash)
                    .send()
                    .getTransactionReceipt()
                    .orElseThrow(() -> new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_NOT_FOUND));

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("트랜잭션 영수증 조회 실패 - txHash: {}", txHash, e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_RECEIPT_FAILED);
        }
    }

    /* 트랜잭션 영수증 대기 (폴링) */
    private TransactionReceipt waitForTransactionReceipt(String txHash) {
        validateInitialized();

        log.info("트랜잭션 영수증 대기 중 - txHash: {}", txHash);

        int maxAttempts = 30; // 최대 30번 시도
        int attemptIntervalMs = 2000; // 2초 간격

        for (int i = 0; i < maxAttempts; i++) {
            try {
                var receiptOptional = web3j.ethGetTransactionReceipt(txHash).send().getTransactionReceipt();
                if (receiptOptional.isPresent()) {
                    TransactionReceipt receipt = receiptOptional.get();
                    log.info("트랜잭션 영수증 확인 - txHash: {}, status: {}", txHash, receipt.getStatus());
                    return receipt;
                }

                log.debug("트랜잭션 대기 중... ({}/{})", i + 1, maxAttempts);
                Thread.sleep(attemptIntervalMs);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_RECEIPT_FAILED);
            } catch (Exception e) {
                log.warn("트랜잭션 영수증 조회 재시도 - attempt: {}/{}", i + 1, maxAttempts);
            }
        }

        throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_NOT_FOUND);
    }

    /* Snapshot 이벤트에서 snapshotId 추출 */
    private BigInteger extractSnapshotIdFromReceipt(TransactionReceipt receipt) {
        // event Snapshot(uint256 indexed id)
        // 실제 이벤트 시그니처 (블록체인 팀 컨트랙트)
        String snapshotEventTopic = "0x0a5b69dda4109f3b3c9a78321d06fd4c59f56d886e9c6c8abaddd33d3d16c103";

        for (org.web3j.protocol.core.methods.response.Log eventLog : receipt.getLogs()) {
            if (eventLog.getTopics().size() >= 2 && eventLog.getTopics().get(0).equals(snapshotEventTopic)) {
                // indexed 파라미터는 topics에 들어감
                // topics[0]: 이벤트 시그니처
                // topics[1]: uint256 indexed id (snapshotId)
                String snapshotIdHex = eventLog.getTopics().get(1);
                BigInteger snapshotId = new BigInteger(snapshotIdHex.substring(2), 16);
                log.info("Snapshot 이벤트 파싱 성공 - snapshotId: {}", snapshotId);
                return snapshotId;
            }
        }

        log.error("Snapshot 이벤트를 찾을 수 없습니다 - txHash: {}", receipt.getTransactionHash());
        throw new BusinessException(ErrorCode.BLOCKCHAIN_TRANSACTION_FAILED);
    }

    /* 64자 hex 문자열을 bytes32로 변환 */
    private static byte[] hexToBytes32(String hex) {
        byte[] bytes = new byte[32];
        for (int i = 0; i < 32; i++) {
            bytes[i] = (byte) Integer.parseInt(hex, i * 2, i * 2 + 2, 16);
        }
        return bytes;
    }

    /* Web3j와 Credentials 초기화 여부 검증 */
    private void validateInitialized() {
        if (web3j == null || credentials == null) {
            throw new BusinessException(ErrorCode.BLOCKCHAIN_NOT_INITIALIZED);
        }
    }
}
