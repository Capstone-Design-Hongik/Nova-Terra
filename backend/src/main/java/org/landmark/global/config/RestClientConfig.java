package org.landmark.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;


@Configuration
public class RestClientConfig {

    @Value("${blockchain.server.url}")
    private String blockchainServerUrl;

    @Bean
    public RestClient blockchainRestClient() {
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory();
        requestFactory.setReadTimeout(Duration.ofSeconds(30));

        return RestClient.builder()
                .baseUrl(blockchainServerUrl)
                .requestFactory(requestFactory)
                .build();
    }
}
