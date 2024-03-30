package com.project.service;

import com.project.model.Role;
import com.project.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;

    void saveUser(User user);

    void assignRoleToUser(String email, Role role);

    Optional<User> getUser(String email);

    List<User> getUsers();

    List<User> getCandidates();
}
