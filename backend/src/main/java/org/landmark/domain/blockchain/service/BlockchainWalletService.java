package org.landmark.domain.blockchain.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.blockchain.config.BlockchainConfig;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.stereotype.Service;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class BlockchainWalletService {

    private final Web3j web3j;
    private final Credentials credentials;
    private final BlockchainConfig blockchainConfig;
    private final DefaultGasProvider gasProvider;

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

    /* 백엔드 지갑의 KRWT 토큰 잔액 조회 */
    public BigInteger getKrwtBalance() {
        return getKrwtBalance(credentials.getAddress());
    }

    /* 특정 주소의 KRWT 토큰 잔액 조회 */
    public BigInteger getKrwtBalance(String address) {
        validateInitialized();

        if (blockchainConfig.getKrwtContractAddress() == null || blockchainConfig.getKrwtContractAddress().isEmpty()) {
            throw new BusinessException(ErrorCode.BLOCKCHAIN_NOT_INITIALIZED);
        }

        try {
            // ERC20 balanceOf 함수 호출
            org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                "balanceOf",
                java.util.Arrays.asList(new org.web3j.abi.datatypes.Address(address)),
                java.util.Arrays.asList(new org.web3j.abi.TypeReference<org.web3j.abi.datatypes.generated.Uint256>() {})
            );

            String encodedFunction = org.web3j.abi.FunctionEncoder.encode(function);

            org.web3j.protocol.core.methods.response.EthCall response = web3j.ethCall(
                org.web3j.protocol.core.methods.request.Transaction.createEthCallTransaction(
                    credentials.getAddress(),
                    blockchainConfig.getKrwtContractAddress(),
                    encodedFunction
                ),
                DefaultBlockParameterName.LATEST
            ).send();

            java.util.List<org.web3j.abi.datatypes.Type> result = org.web3j.abi.FunctionReturnDecoder.decode(
                response.getValue(),
                function.getOutputParameters()
            );

            if (result.isEmpty()) {
                return BigInteger.ZERO;
            }

            return (BigInteger) result.get(0).getValue();

        } catch (Exception e) {
            log.error("KRWT 잔액 조회 실패 - address: {}", address, e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_BALANCE_QUERY_FAILED);
        }
    }

    /* KRWT 토큰을 특정 주소로 전송 */
    public String transferKrwt(String toAddress, BigInteger amount) {
        validateInitialized();

        if (blockchainConfig.getKrwtContractAddress() == null || blockchainConfig.getKrwtContractAddress().isEmpty()) {
            throw new BusinessException(ErrorCode.BLOCKCHAIN_NOT_INITIALIZED);
        }

        log.info("KRWT 전송 시작 - to: {}, amount: {}", toAddress, amount);

        try {
            // 잔액 확인
            BigInteger balance = getKrwtBalance();
            if (balance.compareTo(amount) < 0) {
                log.error("백엔드 지갑 KRWT 잔액 부족 - 필요: {}, 보유: {}", amount, balance);
                throw new BusinessException(ErrorCode.INSUFFICIENT_KRWT_BALANCE);
            }

            // ERC20 transfer 함수 호출
            org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                "transfer",
                java.util.Arrays.asList(
                    new org.web3j.abi.datatypes.Address(toAddress),
                    new org.web3j.abi.datatypes.generated.Uint256(amount)
                ),
                java.util.Collections.emptyList()
            );

            String encodedFunction = org.web3j.abi.FunctionEncoder.encode(function);

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
                blockchainConfig.getKrwtContractAddress(),
                encodedFunction,
                BigInteger.ZERO
            );

            if (transactionResponse.hasError()) {
                log.error("KRWT 전송 실패 - error: {}", transactionResponse.getError().getMessage());
                throw new BusinessException(ErrorCode.BLOCKCHAIN_KRWT_TRANSFER_FAILED);
            }

            String txHash = transactionResponse.getTransactionHash();
            log.info("KRWT 전송 성공 - txHash: {}, to: {}, amount: {}", txHash, toAddress, amount);
            return txHash;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("KRWT 전송 중 오류 발생 - to: {}, amount: {}", toAddress, amount, e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_KRWT_TRANSFER_FAILED);
        }
    }

    /*
     * KRWT 토큰을 STO 컨트랙트로 전송 (배당금 분배용)
     * TODO: 블록체인 팀으로부터 인터페이스 스펙 받은 후 구현
     */
    public String sendKrwtToStoContract(Long propertyId, BigInteger krwtAmount) {
        validateInitialized();

        log.info("KRWT 전송 시작 - propertyId: {}, amount: {}", propertyId, krwtAmount);

        try {
            // TODO: 블록체인 팀으로부터 받을 정보
            // 1. STO 컨트랙트의 함수명 (예: depositRentalIncome)
            // 2. 함수 파라미터 (propertyId, amount 등)
            // 3. KRWT 컨트랙트 주소
            // 4. ABI (Application Binary Interface)

            // 예시 구조 (실제 구현 시 수정 필요):
            // Function function = new Function(
            //     "depositRentalIncome",  // 함수명
            //     Arrays.asList(
            //         new Uint256(propertyId),
            //         new Uint256(krwtAmount)
            //     ),
            //     Collections.emptyList()
            // );
            //
            // String encodedFunction = FunctionEncoder.encode(function);
            //
            // TransactionManager txManager = new RawTransactionManager(
            //     web3j,
            //     credentials,
            //     blockchainConfig.getChainId()
            // );
            //
            // EthSendTransaction transactionResponse = txManager.sendTransaction(
            //     gasProvider.getGasPrice(),
            //     gasProvider.getGasLimit(),
            //     blockchainConfig.getStoContractAddress(),
            //     encodedFunction,
            //     BigInteger.ZERO
            // );
            //
            // String txHash = transactionResponse.getTransactionHash();
            // log.info("트랜잭션 전송 성공 - txHash: {}", txHash);
            // return txHash;

            log.warn("KRWT 전송 기능은 블록체인 팀의 인터페이스 스펙이 필요합니다.");
            throw new BusinessException(ErrorCode.BLOCKCHAIN_INTERFACE_NOT_READY);

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("KRWT 전송 중 오류 발생", e);
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

    /* Web3j와 Credentials 초기화 여부 검증 */
    private void validateInitialized() {
        if (web3j == null || credentials == null) {
            throw new BusinessException(ErrorCode.BLOCKCHAIN_NOT_INITIALIZED);
        }
    }
}
