package br.edu.utfpr.api.openapi;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@Configuration

// Configurações gerais da API
@OpenAPIDefinition(
  info =@Info(
    title = "API do Gado",
    version = "${api.version}",
    contact = @Contact(
      name = "João, Erick e Biel", email = "jv418070@gmail.com", url = "??"
    ),
    license = @License(
      name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0"
    ),
    //termsOfService = "${tos.uri}",
    description = "${api.description}"
  ),
  servers = {
    @Server(
      url = "${api.server.dev}",
      description = "Development"
    ),
    @Server(
      url = "${api.server.prod}",
      description = "Production"
    ),
  }
)

// Configurações de autenticação
@SecurityScheme(
  name = "Authorization",
  type = SecuritySchemeType.HTTP,
  bearerFormat = "JWT",
  scheme = "bearer"
)
public class OpenAPIConfiguration {}