package com.project.controller;

import com.project.model.Role;
import com.project.model.User;
import com.project.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserResource {
    private final UserService userService;

    @CrossOrigin(origins = "http://localhost:3000")
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
        userService.assignRoleToUser(form.getEmail(), form.getRoleName());
        return ResponseEntity.ok().build();
    }
}

@Data
class RoleToUserForm {
    private String email;
    private Role roleName;
}