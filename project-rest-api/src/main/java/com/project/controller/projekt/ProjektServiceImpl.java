package com.project.controller.projekt;

import com.project.model.Projekt;
import com.project.model.Student;
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
    public Optional<Projekt> getProjekt(Integer projektId) {
        return projektRepository.findById(projektId);
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
    public void deleteProjekt(Integer projektId) {
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
    public Optional<Projekt> getProjektByTeacherTeacherId(Long teacherId) {
        return projektRepository.findByTeacherTeacherId(teacherId);
    }

    @Override
    public Set<Projekt> getProjektyByStudentId(Long studentId) {
        Optional<Student> student = studentRepository.findByStudentId(studentId);
        return student.map(Student::getProjekty).orElseThrow(() -> new RuntimeException("Student not found"));
    }

}