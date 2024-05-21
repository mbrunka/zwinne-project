package com.project.controller.projekt.zadanie.util;

import com.project.model.Status;
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
    private Set<Student> studenci;
    private Status status;
}
