package com.medloop.admin.dto;

import lombok.Data;

import java.util.List;

@Data
public class KeycloakUserRequest {
    private String username;
    private String email;
    private String password;
    private List<String> roles;
}
