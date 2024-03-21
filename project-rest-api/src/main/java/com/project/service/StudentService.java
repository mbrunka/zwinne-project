package com.project.service;

import com.project.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface StudentService {
    Optional<Student> getStudent(Integer projektId);

    Student setStudent(Student projekt);

    void deleteStudent(Integer projektId);

    Page<Student> getStudenci(Pageable pageable);

    Page<Student> searchByNrIndeksu(String nrIndeksu, Pageable pageable);

}
