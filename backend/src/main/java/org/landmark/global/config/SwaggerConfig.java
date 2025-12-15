package org.landmark.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

  @Value("${app.swagger.server-url}")
  private String serverUrl;

  @Value("${app.swagger.description}")
  private String serverDescription;

  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI()
        .info(apiInfo())
        .servers(List.of(
            new Server().url(serverUrl).description(serverDescription)
        ));
  }

  private Info apiInfo() {
    return new Info()
        .title("NovaTerra API Documentation")
        .description("NovaTerra의 백엔드 API 명세서")
        .version("1.0.0");
  }
}