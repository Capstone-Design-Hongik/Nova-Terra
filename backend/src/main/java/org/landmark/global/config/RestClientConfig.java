package org.landmark.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Base64;


@Configuration
public class RestClientConfig {

    @Value("${blockchain.server.url}")
    private String blockchainServerUrl;

    @Value("${toss.payments.url}")
    private String tossPaymentsUrl;

    @Value("${toss.payments.secret-key}")
    private String tossPaymentsSecretKey;

    @Bean
    public RestClient blockchainRestClient() {
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory();
        requestFactory.setReadTimeout(Duration.ofSeconds(30));

        return RestClient.builder()
                .baseUrl(blockchainServerUrl)
                .requestFactory(requestFactory)
                .build();
    }

    @Bean
    public RestClient tossPaymentsRestClient() {
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory();
        requestFactory.setReadTimeout(Duration.ofSeconds(30));

        // Base64 인코딩된 Basic 인증 헤더 생성
        String encodedSecretKey = Base64.getEncoder().encodeToString((tossPaymentsSecretKey + ":").getBytes());

        return RestClient.builder()
                .baseUrl(tossPaymentsUrl)
                .requestFactory(requestFactory)
                .defaultHeader("Authorization", "Basic " + encodedSecretKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
