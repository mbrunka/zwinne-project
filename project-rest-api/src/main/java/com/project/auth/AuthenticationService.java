package com.project.auth;

import com.project.auth.request.*;
import com.project.config.JwtUtil;
import com.project.model.Role;
import com.project.model.Student;
import com.project.model.Teacher;
import com.project.model.User;
import com.project.repository.StudentRepository;
import com.project.repository.TeacherRepository;
import com.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
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
        var jwtAccessToken = jwtUtil.generateAccessToken(user);
        var jwtRefreshToken = jwtUtil.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .authToken(jwtAccessToken)
                .refreshToken(jwtRefreshToken)
                .build();
    }

    public AuthenticationResponse selfRegisterTeacher(TeacherRegisterRequest request) {
        logger.info("REGISTER TEACHER: firstName: " + request.getFirstName() + " lastName: " + request.getLastName() + " email: " + request.getEmail());
        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.KANDYDAT_N)
                .build();
        userRepository.save(user);
        var jwtAccessToken = jwtUtil.generateAccessToken(user);
        var jwtRefreshToken = jwtUtil.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .authToken(jwtAccessToken)
                .refreshToken(jwtRefreshToken)
                .build();
    }

    public AuthenticationResponse fullRegisterTeacher(TeacherRegisterRequest request) {
        logger.info("REGISTER TEACHER: firstName: " + request.getFirstName() + " lastName: " + request.getLastName() + " email: " + request.getEmail());
        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.NAUCZYCIEL)
                .build();
        userRepository.save(user);
        var teacher = Teacher.builder()
                .user(user)
                .build();
        teacherRepository.save(teacher);
        user.setTeacher(teacher);
        userRepository.save(user);
        var jwtAccessToken = jwtUtil.generateAccessToken(user);
        var jwtRefreshToken = jwtUtil.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .authToken(jwtAccessToken)
                .refreshToken(jwtRefreshToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        logger.info("AUTHENTICATE: email: " + request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtAccessToken = jwtUtil.generateAccessToken(user);
        var jwtRefreshToken = jwtUtil.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .authToken(jwtAccessToken)
                .refreshToken(jwtRefreshToken)
                .role(user.getRole().name())
                .build();
    }

    public RefreshResponse refresh(RefreshRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        return RefreshResponse.builder()
                .authToken(jwtUtil.generateAccessToken(user))
                .build();
    }

    public AuthenticationResponse logout(AuthenticationRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        return AuthenticationResponse.builder()
                .authToken(null)
                .build();
    }

    public GetUserResponse getUser(GetUserRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        return GetUserResponse.builder()
                .student_id(user.getStudent().getStudentId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .nrIndeksu(user.getStudent().getNrIndeksu())
                .stacjonarny(user.getStudent().getStacjonarny())
                .userId(user.getUserId().toString())
                .token(jwtUtil.generateAccessToken(user))
                .build();
    }

    public GetCandidatesResponse getCandidates() {
        var candidates = userRepository.findAllCandidates();
        return GetCandidatesResponse.builder().users(candidates).build();
    }

    public GetStudentsResponse getStudents() {
        List<User> students = userRepository.findAllStudents();

        List<GetStudentsResponse.UserWithStudent> usersWithStudents = students.stream()
                .map(student -> {
                    GetStudentsResponse.UserWithStudent userWithStudent = new GetStudentsResponse.UserWithStudent();
                    userWithStudent.setUser(student);
                    userWithStudent.setStudent(student.getStudent());
                    return userWithStudent;
                })
                .collect(Collectors.toList());

        return GetStudentsResponse.builder().users(usersWithStudents).build();
    }

    public GetTeachersResponse getTeachers() {
        var teachers = userRepository.findAllTeachers();
        return GetTeachersResponse.builder().users(teachers).build();
    }

    public Number verifyCandidate(VerifyCandidateRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        if (user == null) {
            return 404;
        }

        user.setRole(Role.NAUCZYCIEL);
        userRepository.save(user);
        return 200;
    }

    public Object changePassword(ChangePasswordRequest request, @AuthenticationPrincipal User currentUser) {
        var user = userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow();
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public Object changeEmail(ChangeEmailRequest request, @AuthenticationPrincipal User currentUser) {
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
