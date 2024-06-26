package com.project.repository;

import com.project.model.Projekt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ProjektRepository extends JpaRepository<Projekt, Long> {
    Page<Projekt> findByNazwaContainingIgnoreCase(String nazwa, Pageable pageable);

    Optional<Projekt> findByProjektId(Long projektId);

    List<Projekt> findByNazwaContainingIgnoreCase(String nazwa);
    // Metoda findByNazwaContainingIgnoreCase definiuje zapytanie
    // SELECT p FROM Projekt p WHERE upper(p.nazwa) LIKE upper(%:nazwa%)

    Optional<Projekt> findByJoinCode(String joinCode);

    Set<Projekt> findByTeacherTeacherId(Long teacherId);

}