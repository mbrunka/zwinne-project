package com.project.repository;

import com.project.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByNrIndeksu(String nrIndeksu);

    Page<Student> findByNrIndeksuStartsWith(String nrIndeksu, Pageable pageable);

    //Page<Student> findByNazwiskoStartsWithIgnoreCase(String nazwisko, Pageable pageable);

    Optional<Student> findByStudentId(Long studentId);

    //Page<Student> findByNazwiskoStartsWithIgnoreCase(String nazwisko, Pageable pageable);
    // Metoda findByNrIndeksuStartsWith definiuje zapytanie
    // SELECT s FROM Student s WHERE s.nrIndeksu LIKE :nrIndeksu%
    // Metoda findByNazwiskoStartsWithIgnoreCase definiuje zapytanie
    // SELECT s FROM Student s WHERE upper(s.nazwisko) LIKE upper(:nazwisko%)
}

