package com.project.controller;

import com.project.model.Role;
import com.project.model.Teacher;
import com.project.model.User;
import com.project.repository.TeacherRepository;
import com.project.repository.UserRepository;
import com.project.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserResource {
    private final UserService userService;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;

    @CrossOrigin(origins = "http://localhost:3000")
    @PreAuthorize("hasRole('NAUCZYCIEL')")
    @GetMapping("/users/all")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok().body(userService.getUsers());
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<User>> getCandidates() {
        return ResponseEntity.ok().body(userService.getCandidates());
    }

    @PostMapping("/user/role")
    public ResponseEntity assignRoleToUser(@RequestBody RoleToUserForm form) {
        var user = userService.getUser(form.getEmail()).orElseThrow();
        if (user.getRole() != Role.KANDYDAT_N && form.getRoleName() == Role.NAUCZYCIEL) {
            var teacher = Teacher.builder().user(user).build();
            teacherRepository.save(teacher);
            user.setTeacher(teacher);
            userRepository.save(user);
        }
        userService.assignRoleToUser(form.getEmail(), form.getRoleName());
        return ResponseEntity.ok().build();
    }
}

@Data
class RoleToUserForm {
    private String email;
    private Role roleName;
}