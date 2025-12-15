package org.landmark.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI()
        .info(apiInfo())
        .servers(List.of(
            new Server().url("https://3.34.156.86.nip.io").description("Production HTTPS Server"),
            new Server().url("http://localhost:8080").description("Local Development Server")
        ));
  }

  private Info apiInfo() {
    return new Info()
        .title("NovaTerra API Documentation")
        .description("NovaTerra의 백엔드 API 명세서")
        .version("1.0.0");
  }
}