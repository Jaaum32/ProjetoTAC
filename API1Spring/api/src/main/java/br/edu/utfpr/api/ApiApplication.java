package br.edu.utfpr.api;

import java.time.LocalDate;
import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.edu.utfpr.api.model.Person;
import br.edu.utfpr.api.model.Role;
import br.edu.utfpr.api.model.RoleName;
import br.edu.utfpr.api.repository.RoleRepository;
import br.edu.utfpr.api.service.PersonService;

@SpringBootApplication
public class ApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	@Bean
	CommandLineRunner run(PersonService personService, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			Role rUser = roleRepository.save(new Role(RoleName.USER));
			Role rAdmin = roleRepository.save(new Role(RoleName.ADMIN));

			personService.save(new Person("Administrator", "admin@admin.com", passwordEncoder.encode("1234"),
					LocalDate.now(), Arrays.asList(rAdmin, rUser)));

		};
	}
}