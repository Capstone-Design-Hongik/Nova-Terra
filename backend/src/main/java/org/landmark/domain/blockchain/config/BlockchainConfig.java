package org.landmark.domain.blockchain.config;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

// TODO: 블록체인 설정 완료 후 재활성화
//@Slf4j
//@Getter
//@Configuration
//public class BlockchainConfig {
//
//    @Value("${blockchain.network.rpc-url:}")
//    private String rpcUrl;
//
//    @Value("${blockchain.network.chain-id:0}")
//    private Long chainId;
//
//    @Value("${blockchain.wallet.private-key:}")
//    private String privateKey;
//
//    @Value("${blockchain.contract.sto-address:}")
//    private String stoContractAddress;
//
//    @Value("${blockchain.contract.krwt-address:}")
//    private String krwtContractAddress;
//
//    /* Web3j 인스턴스 생성 */
//    @Bean
//    public Web3j web3j() {
//        if (rpcUrl == null || rpcUrl.isEmpty()) {
//            log.warn("블록체인 RPC URL이 설정되지 않았습니다. Web3j를 초기화하지 않습니다.");
//            return null; // 개발 초기에는 null 허용
//        }
//
//        log.info("Web3j 초기화 중 - RPC URL: {}", rpcUrl);
//        return Web3j.build(new HttpService(rpcUrl));
//    }
//
//    /* Credentials 생성 */
//    @Bean
//    public Credentials credentials() {
//        if (privateKey == null || privateKey.isEmpty()) {
//            log.warn("블록체인 프라이빗 키가 설정되지 않았습니다. Credentials를 초기화하지 않습니다.");
//            return null; // 개발 초기에는 null 허용
//        }
//
//        log.info("Credentials 초기화 중");
//        Credentials creds = Credentials.create(privateKey);
//        log.info("Wallet 주소: {}", creds.getAddress());
//        return creds;
//    }
//
//    /* Gas Provider */
//    @Bean
//    public DefaultGasProvider gasProvider() {
//        return new DefaultGasProvider();
//    }
//}
