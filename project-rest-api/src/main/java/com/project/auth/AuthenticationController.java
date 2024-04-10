package com.project.auth;

import com.project.auth.request.*;
import com.project.model.User;
import com.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
        return ResponseEntity.ok(service.selfRegisterTeacher(request));
    }

    @PostMapping("/admin/registerTeacher")
    public ResponseEntity<AuthenticationResponse> adminRegisterTeacher(
            @RequestBody TeacherRegisterRequest request
    ) {
        return ResponseEntity.ok(service.fullRegisterTeacher(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(
            @RequestBody RefreshRequest request
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

    @GetMapping("/getCandidates")
    public ResponseEntity<GetCandidatesResponse> getCandidates(
    ) {
        return ResponseEntity.ok(service.getCandidates());
    }

    @GetMapping("/getStudents")
    public ResponseEntity<GetStudentsResponse> getStudents(
    ) {
        return ResponseEntity.ok(service.getStudents());
    }

    @GetMapping("/getTeachers")
    public ResponseEntity<GetTeachersResponse> getTeachers(
    ) {
        return ResponseEntity.ok(service.getTeachers());
    }

    @PutMapping("/verifyCandidate")
    public ResponseEntity<?> verifyCandidate(
            @RequestBody VerifyCandidateRequest request
    ) {
        return ResponseEntity.ok(service.verifyCandidate(request));
    }
}
