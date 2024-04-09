package com.project.service;

import com.project.model.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface TeacherService {

    Optional<Teacher> getTeacher(Integer teacherId);

    Teacher setTeacher(Teacher teacher);

    void deleteTeacher(Integer teacherId);

    Page<Teacher> getTeachers(Pageable pageable);

    Page<Teacher> searchByLastName(String lastName, Pageable pageable);



}
