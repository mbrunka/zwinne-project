package com.project.auth.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetUserResponse {
    private String token;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String nrIndeksu;
    private Boolean stacjonarny;
    private String userId;

}
