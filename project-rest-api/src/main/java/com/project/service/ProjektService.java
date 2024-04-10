package com.project.service;

import com.project.model.Projekt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.Set;

public interface ProjektService {

    Optional<Projekt> getProjekt(Integer projektId);

    Optional<Projekt> getProjekt(String joinCode);

    Projekt setProjekt(Projekt projekt);

    void deleteProjekt(Integer projektId);

    Page<Projekt> getProjekty(Pageable pageable);

    Page<Projekt> searchByNazwa(String nazwa, Pageable pageable);

    Set<Projekt> getProjektByTeacherTeacherId(Long teacherId);

    Set<Projekt> getProjektyByStudentId(Long studentId);
}