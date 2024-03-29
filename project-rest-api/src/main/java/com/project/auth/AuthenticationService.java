package com.project.auth;

import com.project.auth.requsts.*;
import com.project.config.JwtUtil;
import com.project.model.Role;
import com.project.model.Student;
import com.project.model.User;
import com.project.repository.StudentRepository;
import com.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse registerStudent(RegisterRequest request) {
        logger.info("firstName: " + request.getFirstName() + " lastName: " + request.getLastName() + " email: " + request.getEmail() + " nrIndeksu: " + request.getNrIndeksu() + " stacjonarny: " + request.getStacjonarny());
        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.STUDENT)
                .build();

        logger.info("" + user.getUserId());
        userRepository.save(user);
        User createdUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var student = Student.builder()
                .nrIndeksu(request.getNrIndeksu())
                .stacjonarny(request.getStacjonarny())
                .user(createdUser)
                .build();
        logger.info("Registering student with index number: " + request.getNrIndeksu());
        studentRepository.save(student);
        Student createdStudent = studentRepository.findByNrIndeksu(request.getNrIndeksu())
                .orElseThrow();
        user.setStudent(createdStudent);
        var jwtToken = jwtUtil.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse registerTeacher(TeacherRegisterRequest request) {
        logger.info("REGISTER TEACHER: firstName: " + request.getFirstName() + " lastName: " + request.getLastName() + " email: " + request.getEmail());
        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.KANDYDAT_N)
                .build();
        userRepository.save(user);
        var jwtToken = jwtUtil.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        logger.info("AUTHENTICATE: email: " + request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        return AuthenticationResponse.builder()
                .token(jwtUtil.generateToken(user))
                .build();
    }

    public AuthenticationResponse refresh(AuthenticationRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        return AuthenticationResponse.builder()
                .token(jwtUtil.generateToken(user))
                .build();
    }

    public AuthenticationResponse logout(AuthenticationRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        return AuthenticationResponse.builder()
                .token(jwtUtil.generateToken(user))
                .build();
    }

    public GetUserResponse getUser(GetUserRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        return GetUserResponse.builder()
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .nrIndeksu(user.getStudent().getNrIndeksu())
                .stacjonarny(user.getStudent().getStacjonarny())
                .userId(user.getUserId().toString())
                .token(jwtUtil.generateToken(user))
                .build();
    }


}
