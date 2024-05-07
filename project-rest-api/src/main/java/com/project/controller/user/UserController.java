package com.project.controller.user;

import com.project.controller.user.requests.ChangeEmailRequest;
import com.project.controller.user.requests.ChangePasswordRequest;
import com.project.model.User;
import com.project.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        var user = userRepository.findById(currentUser.getUserId())
                .orElseThrow();
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/changeEmail")
    public ResponseEntity<?> changeEmail(
            @RequestBody ChangeEmailRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        var user = userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Password is incorrect");
        }
        var userWithNewEmail = userRepository.findByEmail(request.getNewEmail());
        if (userWithNewEmail.isPresent()) {
            return ResponseEntity.badRequest().body("Email is already taken");
        }
        user.setEmail(request.getNewEmail());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
