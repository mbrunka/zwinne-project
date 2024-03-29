package com.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProjectRestApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectRestApiApplication.class, args);
    }

//    @Bean
//    CommandLineRunner run(UserService userService) {
//        return args -> {
//            userService.saveUser(User.builder()
//                    .email("admin")
//                    .firstName("Head")
//                    .lastName("Admin")
//                    .password("admin")
//                    .role(Role.ADMIN)
//                    .build());
//        };
//    }
}

