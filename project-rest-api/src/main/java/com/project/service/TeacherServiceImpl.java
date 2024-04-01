package com.project.service;

import com.project.model.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Override
    public Optional<Teacher> getTeacher(Integer teacherId) {
        return Optional.empty();
    }

    @Override
    public Teacher setTeacher(Teacher teacher) {
        return null;
    }

    @Override
    public void deleteTeacher(Integer teacherId) {

    }

    @Override
    public Page<Teacher> getTeachers(Pageable pageable) {
        return null;
    }

    @Override
    public Page<Teacher> searchByLastName(String lastName, Pageable pageable) {
        return null;
    }
}
