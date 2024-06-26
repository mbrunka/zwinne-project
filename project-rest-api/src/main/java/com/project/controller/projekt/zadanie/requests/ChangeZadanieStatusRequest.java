package com.project.controller.projekt.zadanie.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangeZadanieStatusRequest {
    private Long zadanieId;

    private Long statusId;
}
