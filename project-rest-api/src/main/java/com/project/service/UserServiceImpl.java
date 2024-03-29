package com.project.service;

import com.project.auth.AuthenticationService;
import com.project.model.Role;
import com.project.model.User;
import com.project.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var user = userRepository.findByEmail(email)
                .orElseThrow();
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), user.getAuthorities());
    }

    @Override
    public void saveUser(User user) {
        logger.info("Saving user {}", user.getEmail());
        userRepository.save(user);
    }

    @Override
    public void assignRoleToUser(String email, Role role) {
        logger.info("Assigning role {} to user {}", role, email);
        var user = userRepository.findByEmail(email)
                .orElseThrow();
        user.setRole(role);
    }

    @Override
    public Optional<User> getUser(String email) {
        logger.info("Fetching user {}", email);
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll();
    }
}
