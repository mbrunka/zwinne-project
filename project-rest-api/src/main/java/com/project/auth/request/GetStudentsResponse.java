package com.project.auth.request;

import com.project.model.Student;
import com.project.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetStudentsResponse {
    private List<UserWithStudent> users;

    // Wewnętrzna klasa reprezentująca użytkownika wraz ze studentem
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserWithStudent {
        private User user;
        private Student student; // Dodaj pole reprezentujące studenta
    }
}