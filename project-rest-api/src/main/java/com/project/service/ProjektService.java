package com.project.service;

import com.project.controller.projekt.zadanie.util.StatusDto;
import com.project.model.Projekt;
import com.project.model.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface ProjektService {

    Optional<Projekt> getProjekt(Long projektId);

    Optional<Projekt> getProjekt(String joinCode);

    Projekt setProjekt(Projekt projekt);

    void deleteProjekt(Long projektId);

    Page<Projekt> getProjekty(Pageable pageable);

    Page<Projekt> searchByNazwa(String nazwa, Pageable pageable);

    Set<Projekt> getProjektByTeacherTeacherId(Long teacherId);

    Set<Projekt> getProjektyByStudentId(Long studentId);

    //Status addStatusToProjekt(Long projektId, Long statusId);


    //TODO tu potrzebuję jeszce zwracanie studenta przypisanego do zadania
    public StatusDto convertToDto(Status status);
}