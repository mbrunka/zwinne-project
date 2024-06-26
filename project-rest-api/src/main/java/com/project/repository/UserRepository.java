package com.project.repository;

import com.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUserId(Long userId);

    @Query("SELECT u FROM User u WHERE u.role = 'KANDYDAT_N'")
    List<User> findAllCandidates();

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.student WHERE u.role = 'STUDENT'")
    List<User> findAllStudents();

    @Query("SELECT u FROM User u WHERE u.role = 'NAUCZYCIEL'")
    List<User> findAllTeachers();
}
