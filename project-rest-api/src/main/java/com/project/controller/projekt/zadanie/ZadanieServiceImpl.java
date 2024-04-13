package com.project.controller.projekt.zadanie;

import com.project.model.Projekt;
import com.project.model.Zadanie;
import com.project.repository.ProjektRepository;
import com.project.repository.UserRepository;
import com.project.repository.ZadanieRepository;
import com.project.service.ProjektService;
import com.project.service.StatusService;
import com.project.service.UserService;
import com.project.service.ZadanieService;
import org.springframework.beans.factory.annotation.Autowired;
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
}