package com.project.controller.projekt.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateStatusRequest {
    private Long statusId;
    private Long projektId;
    private String nazwa;
    private String kolor;
    private Integer waga;
}
