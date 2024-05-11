package com.project.controller.projekt.zadanie;

import com.project.controller.projekt.zadanie.util.ZadanieSpecification;
import com.project.model.Zadanie;
import com.project.repository.ZadanieRepository;
import com.project.service.ZadanieService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ZadanieServiceImpl implements ZadanieService {
    private final ZadanieRepository zadanieRepository;

    public ZadanieServiceImpl(ZadanieRepository zadanieRepository) {
        this.zadanieRepository = zadanieRepository;
    }

    public Optional<Zadanie> getZadanie(Long zadanieId) {
        return zadanieRepository.findById(zadanieId);
    }

    @Override
    public Zadanie setZadanie(Zadanie zadanie) {
        return zadanieRepository.save(zadanie);
    }

    @Override
    public void deleteZadanie(Long zadanieId) {
        zadanieRepository.deleteById(zadanieId);
    }

    @Override
    public Page<Zadanie> getZadaniaByProjektIdAndFilters(Long projektId, String nazwa, String opis, Long studentId, Pageable pageable) {
        ZadanieSpecification zadanieSpecification = new ZadanieSpecification(projektId, nazwa, opis, studentId);
        return zadanieRepository.findAll(zadanieSpecification, pageable);
    }

}