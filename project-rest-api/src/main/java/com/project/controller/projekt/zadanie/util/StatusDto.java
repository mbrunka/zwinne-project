package com.project.controller.projekt.zadanie.util;

import com.project.model.Student;
import com.project.model.Zadanie;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusDto {
    private Long statusId;
    private String nazwa;
    private String kolor;
    private Integer waga;
    private Set<Zadanie> zadania;
    private Student student;
}