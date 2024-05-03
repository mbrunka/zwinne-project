package com.project.controller.projekt.zadanie.util;

import com.project.model.Student;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZadanieDto {
    private Long zadanieId;
    private String nazwa;
    private String opis;
    private Set<Student> studenci; // Add this field to represent the students assigned to the task
}
