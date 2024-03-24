package com.project.auth;

import com.project.auth.requsts.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> registerStudent(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.registerStudent(request));
    }

    @PostMapping("/registerTeacher")
    public ResponseEntity<AuthenticationResponse> registerTeacher(
            @RequestBody TeacherRegisterRequest request
    ) {
        return ResponseEntity.ok(service.registerTeacher(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PatchMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.refresh(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthenticationResponse> logout(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.logout(request));
    }

    @GetMapping("/getUser")
    public ResponseEntity<GetUserResponse> getUser(
            @RequestBody GetUserRequest request
    ) {
        return ResponseEntity.ok(service.getUser(request));
    }
}
