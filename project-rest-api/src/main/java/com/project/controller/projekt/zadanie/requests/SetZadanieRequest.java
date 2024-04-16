package com.project.controller.projekt.zadanie.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SetZadanieRequest {
    private String nazwa;
    private String opis;
    private int piorytet;
    private long statusId;
    private long projektId;
    private Set<Long> studentIds;
}
