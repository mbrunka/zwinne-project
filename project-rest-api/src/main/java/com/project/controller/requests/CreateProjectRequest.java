package com.project.controller.requests;

import com.project.model.Student;
import com.project.model.Zadanie;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateProjectRequest {

    private List<Zadanie> zadania;

    private Set<Student> studenci;

    private String nazwa;

    private String opis;
}
