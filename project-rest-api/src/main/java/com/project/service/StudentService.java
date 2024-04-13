package com.project.service;

import com.project.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.Set;

public interface StudentService {
    Optional<Student> getStudent(Integer studentId);

    Student setStudent(Student student);

    void deleteStudent(Integer studentId);

    Page<Student> getStudenci(Pageable pageable);

    Page<Student> searchByNrIndeksu(String nrIndeksu, Pageable pageable);

    Set<Student> getStudentsByIds(Set<Long> studentIds);
}
