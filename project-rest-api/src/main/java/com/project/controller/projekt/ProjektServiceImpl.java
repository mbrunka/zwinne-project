package com.project.controller.projekt;

import com.project.controller.projekt.zadanie.util.StatusDto;
import com.project.controller.projekt.zadanie.util.ZadanieDto;
import com.project.model.Projekt;
import com.project.model.Status;
import com.project.model.Student;
import com.project.model.Zadanie;
import com.project.repository.ProjektRepository;
import com.project.repository.StudentRepository;
import com.project.repository.ZadanieRepository;
import com.project.service.ProjektService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class ProjektServiceImpl implements ProjektService {
    private final ProjektRepository projektRepository;
    private final ZadanieRepository zadanieRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public ProjektServiceImpl(ProjektRepository projektRepository, ZadanieRepository zadanieRepo, StudentRepository studentRepository) {
        this.projektRepository = projektRepository;
        this.zadanieRepository = zadanieRepo;
        this.studentRepository = studentRepository;
    }

    @Override
    public Optional<Projekt> getProjekt(Long projektId) {
        return projektRepository.findByProjektId(projektId);
    }

    @Override
    public Optional<Projekt> getProjekt(String joinCode)  {
        return projektRepository.findByJoinCode(joinCode);
    }

    @Override
    public Projekt setProjekt(Projekt projekt) {
        if(projekt.getJoinCode() == null) {
            projekt.setJoinCode(Projekt.generateJoinCode());
        }
        return projektRepository.save(projekt);
    }

    @Override
    @Transactional
    public void deleteProjekt(Long projektId) {
        zadanieRepository.deleteAll(zadanieRepository.findZadaniaProjektu(projektId));
        projektRepository.deleteById(projektId);
    }

    @Override
    public Page<Projekt> getProjekty(Pageable pageable) {
        return projektRepository.findAll(pageable);
    }

    @Override
    public Page<Projekt> searchByNazwa(String nazwa, Pageable pageable) {
        return projektRepository.findByNazwaContainingIgnoreCase(nazwa, pageable);
    }

    @Override
    public Set<Projekt> getProjektByTeacherTeacherId(Long teacherId) {
        return projektRepository.findByTeacherTeacherId(teacherId);
    }

    @Override
    public Set<Projekt> getProjektyByStudentId(Long studentId) {
        Optional<Student> student = studentRepository.findByStudentId(studentId);
        return student.map(Student::getProjekty).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @Override
    public ZadanieDto convertZadanieToDto(Zadanie zadanie) {
        ZadanieDto dto = new ZadanieDto();
        dto.setZadanieId(zadanie.getZadanieId());
        dto.setNazwa(zadanie.getNazwa());
        dto.setOpis(zadanie.getOpis());
        dto.setStudenci(zadanie.getStudenci());
        return dto;
    }

    @Override
    public StatusDto convertStatusToDto(Status status, Set<ZadanieDto> zadanieDtos) {
        StatusDto dto = new StatusDto();
        dto.setStatusId(status.getStatusId());
        dto.setNazwa(status.getNazwa());
        dto.setKolor(status.getKolor());
        dto.setWaga(status.getWaga());
        dto.setZadania(zadanieDtos);
        return dto;
    }

}