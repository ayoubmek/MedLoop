package com.medloop.admin.controller;

import com.medloop.admin.dto.ApiResponse;
import com.medloop.admin.dto.KeycloakUserRequest;
import com.medloop.admin.service.AuditService;
import com.medloop.admin.service.KeycloakService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/keycloak")
@RequiredArgsConstructor
@Tag(name = "Keycloak Admin", description = "Operations for Keycloak user management")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class KeycloakUserController {

    private final KeycloakService keycloakService;
    private final AuditService auditService;

    @PostMapping("/users")
    @Operation(summary = "Create Keycloak user and assign roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> createUser(@Valid @RequestBody KeycloakUserRequest req, HttpServletRequest request) {
        String id = keycloakService.createUser(req);
        auditService.logAction("CREATE", "KEYCLOAK_USER", id, "Created Keycloak user: " + req.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("User created", id));
    }
}
