package com.project.service;

import com.project.model.Student;
import com.project.model.Zadanie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public interface ZadanieService {
    Optional<Zadanie> getZadanie(Long zadanieId);

    Zadanie setZadanie(Zadanie zadanie);

    void deleteZadanie(Long zadanieId);

    Page<Zadanie> getZadaniaByProjektIdAndFilters(Long projektId, String nazwa, String opis, Long studentId, Pageable pageable);
}
