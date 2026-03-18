package org.landmark.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app.swagger")
@Setter
public class SwaggerConfig {

  private List<ServerConfig> servers;

  @Bean
  public OpenAPI openAPI() {
    List<Server> serverList = servers.stream()
        .map(s -> new Server().url(s.url()).description(s.description()))
        .toList();

    SecurityScheme securityScheme = new SecurityScheme()
        .type(SecurityScheme.Type.HTTP)
        .scheme("bearer")
        .bearerFormat("JWT")
        .in(SecurityScheme.In.HEADER)
        .name("Authorization");

    return new OpenAPI()
        .info(apiInfo())
        .servers(serverList)
        .components(new Components().addSecuritySchemes("Bearer Authentication", securityScheme))
        .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"));
  }

  private Info apiInfo() {
    return new Info()
        .title("NovaTerra API Documentation")
        .description("NovaTerra의 백엔드 API 명세서")
        .version("1.0.0");
  }

  record ServerConfig(String url, String description) {}
}