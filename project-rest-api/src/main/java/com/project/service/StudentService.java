package com.project.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.project.model.Student;

public interface StudentService {
    Optional<Student> getStudent(Integer projektId);
    Student setStudent(Student projekt);
    void deleteStudent(Integer projektId);
    Page<Student> getStudenci(Pageable pageable);
    Page<Student> searchByNrIndeksu(String nrIndeksu, Pageable pageable);
    Page<Student> searchByNazwisko(String nazwisko, Pageable pageable);
}
